const express = require('express');
const { addBookmark, removeBookmark, getBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, addBookmark)
    .get(protect, getBookmarks);

router.delete('/:eventId', protect, removeBookmark);

module.exports = router;
