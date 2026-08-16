const Certificate = require('../models/Certificate');
const sendNotification = require('../utils/sendNotification');

exports.getMyCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find({ student: req.user.id }).populate('event issuedBy', 'title name');
        res.status(200).json({ success: true, count: certificates.length, data: certificates });
    } catch (error) {
        next(error);
    }
};

exports.uploadCertificate = async (req, res, next) => {
    try {
        const { studentId, eventId, certificateUrl, certificateType } = req.body;
        
        const certificate = await Certificate.create({
            student: studentId,
            event: eventId,
            certificateUrl,
            certificateType,
            issuedBy: req.user.id
        });
        
        await sendNotification(studentId, 'New Certificate', `You have received a new ${certificateType} certificate.`, 'certificate', eventId);
        
        res.status(201).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

exports.getAllCertificates = async (req, res, next) => {
    try {
        const certificates = await Certificate.find().populate('student', 'name email department year').populate('event', 'title date').populate('issuedBy', 'name email').sort('-createdAt');
        res.status(200).json({ success: true, count: certificates.length, data: certificates });
    } catch (error) {
        next(error);
    }
};

exports.deleteCertificate = async (req, res, next) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

