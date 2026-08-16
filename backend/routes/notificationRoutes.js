const express = require('express');
const { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount, getAllNotifications, broadcastNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getNotifications)
    .post(protect, authorize('admin', 'coordinator'), broadcastNotification);

router.get('/all', protect, authorize('admin'), getAllNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllRead);

router.route('/:id')
    .put(protect, markRead) // using PUT for individual read marking
    .delete(protect, deleteNotification);
    
router.put('/:id/read', protect, markRead);

module.exports = router;

