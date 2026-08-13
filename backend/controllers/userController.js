const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const users = await User.find().skip(startIndex).limit(limit);
        const total = await User.countDocuments();

        res.status(200).json({ success: true, count: users.length, total, data: users });
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

exports.getStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student' });
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        next(error);
    }
};

exports.getFaculty = async (req, res, next) => {
    try {
        const faculty = await User.find({ role: 'faculty' });
        res.status(200).json({ success: true, count: faculty.length, data: faculty });
    } catch (error) {
        next(error);
    }
};
