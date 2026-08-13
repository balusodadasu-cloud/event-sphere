const express = require('express');
const { getUsers, getUser, updateUser, deleteUser, getStudents, getFaculty } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/students', protect, authorize('admin', 'faculty'), getStudents);
router.get('/faculty', protect, authorize('admin'), getFaculty);

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/:id')
    .get(protect, getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
