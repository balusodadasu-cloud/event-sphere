const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scannedAt: { type: Date, default: Date.now },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present'
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
