const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');

exports.getEvents = async (req, res, next) => {
    try {
        let query;

        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        query = Event.find(JSON.parse(queryStr)).populate('club organizer', 'name email');

        if (req.query.search) {
            query = query.find({
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } }
                ]
            });
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Event.countDocuments(query);

        query = query.skip(startIndex).limit(limit);

        const events = await query;

        const pagination = {};
        if (endIndex < total) pagination.next = { page: page + 1, limit };
        if (startIndex > 0) pagination.prev = { page: page - 1, limit };

        res.status(200).json({ success: true, count: events.length, pagination, data: events });
    } catch (error) {
        next(error);
    }
};

exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('club organizer', 'name email department');
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        req.body.organizer = req.user.id;
        
        if (req.file) {
            try {
                // if cloudinary is configured
                const result = await uploadImage(req.file.path);
                req.body.poster = result.secure_url;
            } catch (err) {
                // fallback to local path
                req.body.poster = `/${req.file.path.replace('\\', '/')}`;
            }
        }

        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
        }
        
        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
        
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }
        
        await event.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

exports.getEventsByClub = async (req, res, next) => {
    try {
        const events = await Event.find({ club: req.params.clubId }).sort('-createdAt');
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (error) {
        next(error);
    }
};
