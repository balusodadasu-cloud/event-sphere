const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['event', 'registration', 'certificate', 'result', 'system'], 
        default: 'system' 
    },
    read: { type: Boolean, default: false },
    relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
