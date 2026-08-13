const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');

exports.scanAttendance = async (req, res, next) => {
    try {
        const { registrationId } = req.body;
        
        const registration = await Registration.findOne({ registrationId });
        if (!registration) return res.status(404).json({ success: false, message: 'Invalid QR / Registration not found' });
        
        registration.attendance = true;
        await registration.save();
        
        let attendance = await Attendance.findOne({ registration: registration._id });
        if (!attendance) {
            attendance = await Attendance.create({
                registration: registration._id,
                event: registration.event,
                student: registration.student,
                scannedBy: req.user.id,
                status: 'present'
            });
        }
        
        res.status(200).json({ success: true, data: attendance, message: 'Attendance marked successfully' });
    } catch (error) {
        next(error);
    }
};

exports.getEventAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ event: req.params.eventId }).populate('student scannedBy', 'name email');
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        next(error);
    }
};

exports.getMyAttendance = async (req, res, next) => {
    try {
        const attendance = await Attendance.find({ student: req.user.id }).populate('event');
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        next(error);
    }
};
