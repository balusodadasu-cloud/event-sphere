const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');

exports.getEvents = async (req, res, next) => {
    try {
        const { search, category, department, status, sort, page = 1, limit = 20 } = req.query;

        let filter = {};

        if (category && category !== 'All Categories') filter.category = category;
        if (department && department !== 'All Departments') filter.department = department;
        if (status && status !== 'All Statuses') filter.status = status;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitNum = parseInt(limit, 10);

        let sortOption = { createdAt: -1 };
        if (sort) {
            const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            sortOption = { [sortField]: sortOrder };
        }

        const total = await Event.countDocuments(filter);
        const events = await Event.find(filter)
            .populate('club organizer', 'name email department logo')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            count: events.length,
            total,
            data: events
        });
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
