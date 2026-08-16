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

exports.getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find().populate('user', 'name email role').sort('-createdAt').limit(50);
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

exports.broadcastNotification = async (req, res, next) => {
    try {
        const { targetAudience, type, title, message, eventId } = req.body;
        const User = require('../models/User');
        const Registration = require('../models/Registration');
        
        let query = {};
        if (targetAudience === 'All Students' || targetAudience === 'students') {
            query.role = 'student';
        } else if (targetAudience === 'All Faculty' || targetAudience === 'faculty') {
            query.role = { $in: ['faculty', 'coordinator'] };
        } else if (targetAudience === 'Specific Event Participants' && eventId) {
            const regs = await Registration.find({ event: eventId, status: { $ne: 'cancelled' } });
            const userIds = regs.map(r => r.student);
            query._id = { $in: userIds };
        }

        const users = await User.find(query).select('_id');
        const notifications = users.map(u => ({
            user: u._id,
            title,
            message,
            type: type || 'system',
            relatedEvent: eventId || null
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, count: notifications.length, message: `Notification sent to ${notifications.length} recipients` });
    } catch (error) {
        next(error);
    }
};
