const express = require('express');
const { getNotifications, markRead, markAllRead, deleteNotification, getUnreadCount } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getNotifications);

router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllRead);

router.route('/:id')
    .put(protect, markRead) // using PUT for individual read marking
    .delete(protect, deleteNotification);
    
router.put('/:id/read', protect, markRead);

module.exports = router;
