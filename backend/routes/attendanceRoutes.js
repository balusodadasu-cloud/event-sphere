const express = require('express');
const { scanAttendance, getEventAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/scan', protect, authorize('admin', 'faculty', 'coordinator'), scanAttendance);
router.get('/event/:eventId', protect, authorize('admin', 'faculty', 'coordinator'), getEventAttendance);
router.get('/my', protect, getMyAttendance);

module.exports = router;
