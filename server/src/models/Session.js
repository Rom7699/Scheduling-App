"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/models/Session.ts
var mongoose_1 = require("mongoose");
var SessionSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a session title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    startTime: {
        type: Date,
        required: [true, 'Please provide a start time']
    },
    endTime: {
        type: Date,
        required: [true, 'Please provide an end time']
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Session must belong to a user']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
// Validate that endTime is after startTime
SessionSchema.pre('save', function (next) {
    if (this.endTime <= this.startTime) {
        throw new Error('End time must be after start time');
    }
    // Validate that session is in current or next month only
    var now = new Date();
    var startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    var endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);
    if (this.startTime < startOfCurrentMonth || this.startTime > endOfNextMonth) {
        throw new Error('Sessions can only be scheduled for the current or next month');
    }
    next();
});
exports.default = mongoose_1.default.model('Session', SessionSchema);
