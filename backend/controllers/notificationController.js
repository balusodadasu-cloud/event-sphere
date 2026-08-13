const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.markRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

exports.markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        next(error);
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

exports.getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({ user: req.user.id, read: false });
        res.status(200).json({ success: true, count });
    } catch (error) {
        next(error);
    }
};
