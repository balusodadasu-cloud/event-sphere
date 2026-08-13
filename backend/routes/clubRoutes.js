const express = require('express');
const { getClubs, getClub, createClub, updateClub, deleteClub } = require('../controllers/clubController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getClubs)
    .post(protect, authorize('admin'), createClub);

router.route('/:id')
    .get(getClub)
    .put(protect, authorize('admin', 'coordinator'), updateClub)
    .delete(protect, authorize('admin'), deleteClub);

module.exports = router;
