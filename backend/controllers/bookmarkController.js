const Bookmark = require('../models/Bookmark');

exports.addBookmark = async (req, res, next) => {
    try {
        const { eventId } = req.body;
        
        let bookmark = await Bookmark.findOne({ user: req.user.id, event: eventId });
        if (bookmark) {
            return res.status(400).json({ success: false, message: 'Already bookmarked' });
        }
        
        bookmark = await Bookmark.create({ user: req.user.id, event: eventId });
        res.status(201).json({ success: true, data: bookmark });
    } catch (error) {
        next(error);
    }
};

exports.removeBookmark = async (req, res, next) => {
    try {
        await Bookmark.findOneAndDelete({ user: req.user.id, event: req.params.eventId });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

exports.getBookmarks = async (req, res, next) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user.id }).populate('event');
        res.status(200).json({ success: true, count: bookmarks.length, data: bookmarks });
    } catch (error) {
        next(error);
    }
};
