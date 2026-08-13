const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    certificateUrl: { type: String, required: true },
    certificateType: { 
        type: String, 
        enum: ['participation', 'winner', 'runner-up', 'organizer'],
        required: true
    },
    issuedDate: { type: Date, default: Date.now },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
