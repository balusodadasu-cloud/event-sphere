const express = require('express');
const { getResults, publishResults, deleteResults } = require('../controllers/resultController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin', 'faculty', 'coordinator'), publishResults);

router.route('/:eventId')
    .get(getResults)
    .delete(protect, authorize('admin', 'faculty'), deleteResults);

router.route('/event/:eventId')
    .get(getResults)
    .delete(protect, authorize('admin', 'faculty'), deleteResults);

module.exports = router;

