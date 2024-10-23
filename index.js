const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require("./models/Usuario");
const Time = require("./models/Time");
const Jogador = require("./models/Jogador");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Primeira nota
app.get('/', (req, res) => {
    res.json({ message: 'Bem-vindo ao meu Cadastro de jogadores' });
});

// Criar usuário
app.post('/usuario', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    const usuario = { nome, email, senha: senhaCriptografada };

    try {
        await Usuario.create(usuario);
        res.status(201).json({ message: "Usuário inserido no sistema" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Endpoint de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuário não encontrado!' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Senha inválida!' });
        }

        const token = jwt.sign({ id: usuario._id }, 'seu_segredo', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Criar time

app.post('/jogador', async (req, res) => {
    const {   nomeJogador,  posicao, salario,  gols, time } = req.body;

    const jogador = {
        nomeJogador,
        posicao,
        salario,
        gols,
        time
    };

    try {
        await Jogador.create(jogador);
        res.status(201).json({ message: "Jogador cadastrado com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar Jogador
app.patch("/jogador/:id", async (req, res) => {
    const id = req.params.id;
    const {  nomeJogador,  posicao, salario,  gols, time } = req.body;

    const jogador = {  nomeJogador,  posicao, salario,  gols, time };

    try {
        const updateJogador = await Jogador.updateOne({ _id: id }, jogador);
        if (updateJogador.matchedCount === 0) {
            return res.status(422).json({ message: "Jogador não encontrado!" });
        }
        res.status(200).json(jogador);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});


// Criar Time
app.post('/time', async (req, res) => {
    const { nomeTime } = req.body;

    const time = { nomeTime };

    try {
        await Time.create(time);
        res.status(201).json({ message: "Time inserido no sistema" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Ler usuários
app.get("/usuario", async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json({ usuarios });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// ver jogadores
app.get("/jogador", async (req, res) => {
    try {
        const jogador = await Jogador.find().populate('jogador'); 
        res.status(200).json(jogador);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ver jogadores.' });
    }
});

// ver times
app.get("/time", async (req, res) => {
    try {
        const times = await Time.find();
        res.status(200).json(times);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar usuário
app.patch("/usuario/:id", async (req, res) => {
    const id = req.params.id;
    const { nome, email, senha } = req.body;

    const usuario = { nome, email };

    if (senha) {
        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
    }

    try {
        const updateUsuario = await Usuario.updateOne({ _id: id }, usuario);
        if (updateUsuario.matchedCount === 0) {
            return res.status(422).json({ message: "Usuário não encontrado!" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar jogador
app.patch("/jogador/:id", async (req, res) => {
    const id = req.params.id;
    const { nomeJogador } = req.body;

    const jogador = { nomeJogador };

    try {
        const updateJogador = await Jogador.updateOne({ _id: id }, jogador);
        if (updateJogador.matchedCount === 0) {
            return res.status(422).json({ message: "Jogador não encontrado!" });
        }
        res.status(200).json(jogador);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Atualizar time
app.patch("/time/:id", async (req, res) => {
    const id = req.params.id;
    const { nomeTime } = req.body;

    const time = { nomeTime };

    try {
        const updateTime = await Time.updateOne({ _id: id }, time);
        if (updateTime.matchedCount === 0) {
            return res.status(422).json({ message: "Time não encontrado!" });
        }
        res.status(200).json(time);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar usuário
app.delete("/usuario/:id", async (req, res) => {
    const id = req.params.id;

    const usuario = await Usuario.findOne({ _id: id });
    if (!usuario) {
        return res.status(422).json({ message: "Usuário não encontrado!" });
    }

    try {
        await Usuario.deleteOne({ _id: id });
        res.status(200).json({ message: "Usuário removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar jogador
app.delete("/jogador/:id", async (req, res) => {
    const id = req.params.id;

    const jogador = await Jogador.findOne({ _id: id });
    if (!jogador) {
        return res.status(422).json({ message: "jogador não encontrado!" });
    }

    try {
        await Jogador.deleteOne({ _id: id });
        res.status(200).json({ message: "Jogador removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Deletar time
app.delete("/time/:id", async (req, res) => {
    const id = req.params.id;

    const time = await Time.findOne({ _id: id });
    if (!time) {
        return res.status(422).json({ message: "Time não encontrado!" });
    }

    try {
        await Time.deleteOne({ _id: id });
        res.status(200).json({ message: "Time removido com sucesso!" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Conectar ao MongoDB e iniciar o servidor
mongoose.connect('mongodb://localhost:27017/appJogador')
    .then(() => {
        console.log('Conectado ao MongoDB!');
        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    })
    .catch((err) => {
        console.log('Erro ao conectar ao banco de dados: ' + err.message);
    });
