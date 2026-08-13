const express = require('express');
const { getGallery, uploadGallery, deleteGalleryImage } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .post(protect, authorize('admin', 'faculty', 'coordinator'), uploadMultiple, uploadGallery);

router.route('/:eventId')
    .get(getGallery);

router.route('/:eventId/:imageId')
    .delete(protect, authorize('admin', 'faculty', 'coordinator'), deleteGalleryImage);

module.exports = router;
