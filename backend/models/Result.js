const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    results: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        position: { type: Number },
        score: { type: String },
        remarks: { type: String }
    }],
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
