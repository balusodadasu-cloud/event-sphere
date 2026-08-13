const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    images: [{
        url: { type: String, required: true },
        caption: { type: String },
        publicId: { type: String }
    }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
