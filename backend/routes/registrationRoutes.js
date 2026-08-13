const express = require('express');
const { createRegistration, getMyRegistrations, getEventRegistrations, cancelRegistration, getRegistrationById } = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, authorize('student'), createRegistration);

router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, authorize('admin', 'faculty', 'coordinator'), getEventRegistrations);

router.route('/:id')
    .get(protect, getRegistrationById)
    .delete(protect, cancelRegistration);

module.exports = router;
