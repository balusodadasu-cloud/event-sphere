const Notification = require('../models/Notification');

const sendNotification = async (userId, title, message, type = 'system', relatedEvent = null) => {
    try {
        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type,
            relatedEvent
        });
        return notification;
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = sendNotification;
