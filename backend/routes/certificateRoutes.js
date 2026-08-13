const express = require('express');
const { getMyCertificates, uploadCertificate, deleteCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyCertificates);

router.route('/')
    .post(protect, authorize('admin', 'faculty', 'coordinator'), uploadCertificate);

router.route('/:id')
    .delete(protect, authorize('admin', 'faculty'), deleteCertificate);

module.exports = router;
