const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Technical', 'Hackathon', 'Workshop', 'Seminar', 'Cultural', 'Sports', 'Fest', 'Coding Contest', 'Club Activity', 'Placement', 'Awareness', 'Other'],
        required: true
    },
    department: { type: String },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    maxParticipants: { type: Number },
    registrationDeadline: { type: Date },
    poster: { type: String },
    rules: [{ type: String }],
    requirements: [{ type: String }],
    contact: {
        name: { type: String },
        email: { type: String },
        phone: { type: String }
    },
    status: { 
        type: String, 
        enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'], 
        default: 'published' 
    },
    tags: [{ type: String }],
    currentRegistrations: { type: Number, default: 0 }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

eventSchema.virtual('availableSeats').get(function() {
    if (!this.maxParticipants) return null;
    return this.maxParticipants - this.currentRegistrations;
});

eventSchema.virtual('isFull').get(function() {
    if (!this.maxParticipants) return false;
    return this.currentRegistrations >= this.maxParticipants;
});

eventSchema.virtual('isRegistrationOpen').get(function() {
    if (this.status !== 'published') return false;
    if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
    if (this.isFull) return false;
    return true;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
