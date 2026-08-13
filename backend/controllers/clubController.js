const Club = require('../models/Club');

exports.getClubs = async (req, res, next) => {
    try {
        const clubs = await Club.find().populate('coordinator', 'name email');
        res.status(200).json({ success: true, count: clubs.length, data: clubs });
    } catch (error) {
        next(error);
    }
};

exports.getClub = async (req, res, next) => {
    try {
        const club = await Club.findById(req.params.id).populate('coordinator members.user', 'name email');
        if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
        res.status(200).json({ success: true, data: club });
    } catch (error) {
        next(error);
    }
};

exports.createClub = async (req, res, next) => {
    try {
        const club = await Club.create(req.body);
        res.status(201).json({ success: true, data: club });
    } catch (error) {
        next(error);
    }
};

exports.updateClub = async (req, res, next) => {
    try {
        const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
        res.status(200).json({ success: true, data: club });
    } catch (error) {
        next(error);
    }
};

exports.deleteClub = async (req, res, next) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.id);
        if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
