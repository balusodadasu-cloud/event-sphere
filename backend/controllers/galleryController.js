const Gallery = require('../models/Gallery');
const { uploadImage } = require('../config/cloudinary');

exports.getGallery = async (req, res, next) => {
    try {
        const gallery = await Gallery.findOne({ event: req.params.eventId }).populate('uploadedBy', 'name');
        if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found for this event' });
        res.status(200).json({ success: true, data: gallery });
    } catch (error) {
        next(error);
    }
};

exports.uploadGallery = async (req, res, next) => {
    try {
        const { eventId, caption } = req.body;
        let images = [];
        
        if (req.files) {
            for (const file of req.files) {
                 try {
                     const result = await uploadImage(file.path);
                     images.push({ url: result.secure_url, caption: caption || '', publicId: result.public_id });
                 } catch (err) {
                     images.push({ url: `/${file.path.replace('\\', '/')}`, caption: caption || '' });
                 }
            }
        }
        
        let gallery = await Gallery.findOne({ event: eventId });
        if (gallery) {
            gallery.images.push(...images);
            await gallery.save();
        } else {
            gallery = await Gallery.create({
                event: eventId,
                images,
                uploadedBy: req.user.id
            });
        }
        
        res.status(201).json({ success: true, data: gallery });
    } catch (error) {
        next(error);
    }
};

exports.deleteGalleryImage = async (req, res, next) => {
    try {
        const { eventId, imageId } = req.params;
        const gallery = await Gallery.findOne({ event: eventId });
        if (!gallery) return res.status(404).json({ success: false, message: 'Gallery not found' });
        
        gallery.images = gallery.images.filter(img => img._id.toString() !== imageId);
        await gallery.save();
        
        res.status(200).json({ success: true, data: gallery });
    } catch (error) {
        next(error);
    }
};
