const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
    department: { type: String },
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String }
    }],
    socialLinks: {
        website: { type: String },
        instagram: { type: String },
        linkedin: { type: String }
    },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

const Club = mongoose.model('Club', clubSchema);
module.exports = Club;
