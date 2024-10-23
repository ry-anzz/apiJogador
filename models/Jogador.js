const mongoose = require('mongoose');

const jogadorSchema = new mongoose.Schema({
    nomeJogador: { type: String, required: true },
    posicao: { type: String, required: true },
    salario: { type: String, required: true },
    gols: { type: String, required: true },
    Time: { type: mongoose.Schema.Types.ObjectId, ref: 'Time' } // Referência para o modelo de Time
});

module.exports = mongoose.model('Musica', MusicaSchema);
