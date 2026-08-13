const Result = require('../models/Result');
const sendNotification = require('../utils/sendNotification');

exports.getResults = async (req, res, next) => {
    try {
        const result = await Result.findOne({ event: req.params.eventId }).populate('results.student publishedBy', 'name email department');
        if (!result) return res.status(404).json({ success: false, message: 'Results not found for this event' });
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.publishResults = async (req, res, next) => {
    try {
        const { eventId, results } = req.body;
        
        let result = await Result.findOne({ event: eventId });
        if (result) {
            result.results = results;
            result.publishedBy = req.user.id;
            result.publishedAt = Date.now();
            await result.save();
        } else {
            result = await Result.create({
                event: eventId,
                results,
                publishedBy: req.user.id
            });
        }
        
        for (let r of results) {
            if (r.student) {
                 await sendNotification(r.student, 'Results Published', `Results have been published for an event you participated in.`, 'result', eventId);
            }
        }
        
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

exports.deleteResults = async (req, res, next) => {
    try {
        await Result.findOneAndDelete({ event: req.params.eventId });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
