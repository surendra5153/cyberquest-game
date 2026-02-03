const mongoose = require('mongoose');

/**
 * Progress Schema
 * Tracks student progress through game levels
 * Stores score, mistakes, risks avoided, and learning outcomes
 */
const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    levelId: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    levelName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Track what the student got wrong
    mistakes: [{
        type: String
    }],
    // Track what risks were successfully avoided
    risksAvoided: [{
        type: String
    }],
    // Learning points shown after level completion
    learningPoints: [{
        type: String
    }],
    // Time spent on the level in seconds
    timeSpent: {
        type: Number,
        default: 0
    },
    // Number of attempts on this level
    attempts: {
        type: Number,
        default: 1
    },
    // Whether the level was completed successfully
    completed: {
        type: Boolean,
        default: false
    },
    // Highest score achieved
    highScore: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient queries
progressSchema.index({ userId: 1, levelId: 1 });

module.exports = mongoose.model('Progress', progressSchema);
