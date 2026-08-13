const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    createdAt: { type: Date, default: Date.now }
});

bookmarkSchema.index({ user: 1, event: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
