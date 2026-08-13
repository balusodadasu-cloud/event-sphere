const mongoose = require('mongoose');
const crypto = require('crypto');

const registrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    registrationId: { 
        type: String, 
        unique: true,
        default: () => crypto.randomUUID()
    },
    registrationDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'attended'],
        default: 'confirmed'
    },
    attendance: { type: Boolean, default: false },
    qrCode: { type: String },
    teamName: { type: String },
    teamMembers: [{ type: String }]
}, {
    timestamps: true
});

registrationSchema.index({ student: 1, event: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
