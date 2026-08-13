const express = require('express');
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(getEvents)
    .post(protect, authorize('admin', 'faculty', 'coordinator'), uploadSingle, createEvent);

router.route('/:id')
    .get(getEvent)
    .put(protect, authorize('admin', 'faculty', 'coordinator'), updateEvent)
    .delete(protect, authorize('admin', 'faculty', 'coordinator'), deleteEvent);

module.exports = router;
