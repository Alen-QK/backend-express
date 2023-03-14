const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    id: String,
    history: Array
});

module.exports = mongoose.model('History', HistorySchema);