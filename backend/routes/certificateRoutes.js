const express = require('express');
const { getMyCertificates, getAllCertificates, uploadCertificate, deleteCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my', protect, getMyCertificates);
router.get('/all', protect, authorize('admin', 'faculty', 'coordinator'), getAllCertificates);

router.route('/')
    .get(protect, authorize('admin', 'faculty', 'coordinator'), getAllCertificates)
    .post(protect, authorize('admin', 'faculty', 'coordinator'), uploadCertificate);

router.route('/:id')
    .delete(protect, authorize('admin', 'faculty'), deleteCertificate);

module.exports = router;

