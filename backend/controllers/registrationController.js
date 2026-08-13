const Registration = require('../models/Registration');
const Event = require('../models/Event');
const generateQR = require('../utils/generateQR');
const sendNotification = require('../utils/sendNotification');

exports.createRegistration = async (req, res, next) => {
    try {
        const { eventId, teamName, teamMembers } = req.body;
        
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
        }
        
        if (event.maxParticipants && event.currentRegistrations >= event.maxParticipants) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }
        
        const existing = await Registration.findOne({ student: req.user.id, event: eventId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Already registered for this event' });
        }
        
        const registration = new Registration({
            student: req.user.id,
            event: eventId,
            teamName,
            teamMembers
        });
        
        const qrDataUrl = await generateQR(registration.registrationId);
        registration.qrCode = qrDataUrl;
        
        await registration.save();
        
        event.currentRegistrations += 1;
        await event.save();
        
        await sendNotification(req.user.id, 'Registration Successful', `You have successfully registered for ${event.title}.`, 'registration', event._id);
        
        res.status(201).json({ success: true, data: registration });
    } catch (error) {
        next(error);
    }
};

exports.getMyRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ student: req.user.id }).populate('event');
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        next(error);
    }
};

exports.getEventRegistrations = async (req, res, next) => {
    try {
        const registrations = await Registration.find({ event: req.params.eventId }).populate('student', 'name email phone department year');
        res.status(200).json({ success: true, count: registrations.length, data: registrations });
    } catch (error) {
        next(error);
    }
};

exports.cancelRegistration = async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
        
        if (registration.student.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to cancel this registration' });
        }
        
        if (registration.status === 'cancelled') {
             return res.status(400).json({ success: false, message: 'Already cancelled' });
        }
        
        registration.status = 'cancelled';
        await registration.save();
        
        const event = await Event.findById(registration.event);
        if (event && event.currentRegistrations > 0) {
            event.currentRegistrations -= 1;
            await event.save();
        }
        
        res.status(200).json({ success: true, data: registration });
    } catch (error) {
        next(error);
    }
};

exports.getRegistrationById = async (req, res, next) => {
    try {
        const registration = await Registration.findById(req.params.id).populate('event student');
        if (!registration) return res.status(404).json({ success: false, message: 'Not found' });
        res.status(200).json({ success: true, data: registration });
    } catch (error) {
        next(error);
    }
};
