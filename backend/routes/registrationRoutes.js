const express = require('express');
const { createRegistration, getMyRegistrations, getEventRegistrations, cancelRegistration, getRegistrationById } = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, authorize('student'), createRegistration);

router.get('/all', protect, authorize('admin', 'faculty', 'coordinator'), async (req, res, next) => {
    try {
        const Registration = require('../models/Registration');
        const regs = await Registration.find().populate('student', 'name email department year phone').populate('event', 'title date venue category').sort('-createdAt');
        res.status(200).json({ success: true, count: regs.length, data: regs });
    } catch (error) { next(error); }
});
router.get('/my', protect, getMyRegistrations);

router.get('/event/:eventId', protect, authorize('admin', 'faculty', 'coordinator'), getEventRegistrations);

router.route('/:id')
    .get(protect, getRegistrationById)
    .delete(protect, cancelRegistration);

module.exports = router;
