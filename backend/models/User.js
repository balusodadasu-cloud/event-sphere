const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        enum: ['student', 'faculty', 'coordinator', 'admin'], 
        default: 'student' 
    },
    studentId: { type: String },
    department: { type: String },
    year: { type: Number, min: 1, max: 4 },
    phone: { type: String },
    profileImage: { type: String },
    bio: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual('fullProfile').get(function() {
    return `${this.name} (${this.role})`;
});

const User = mongoose.model('User', userSchema);
module.exports = User;
