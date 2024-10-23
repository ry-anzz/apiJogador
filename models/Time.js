const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    nomeTime: { type: String, required: true },
});

module.exports = mongoose.model('Time', timeSchema);
