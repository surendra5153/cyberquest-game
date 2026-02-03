const mongoose = require('mongoose');

/**
 * Badge Schema
 * Stores earned badges/achievements for gamification
 */
const badgeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    badgeType: {
        type: String,
        required: true,
        enum: [
            'phishing_detector',     // Level 1 completion
            'phishing_master',       // Level 1 perfect score
            'password_builder',      // Level 2 completion
            'password_pro',          // Level 2 perfect score
            'cyber_speedster',       // Level 3 completion
            'lightning_reflexes',    // Level 3 high score
            'story_hero',            // Story level completion
            'cyber_guardian',        // Complete all levels
            'first_steps',           // Complete first level
            'quick_learner',         // Complete 3 levels
            'safety_expert'          // Complete all with 80%+ score
        ]
    },
    badgeName: {
        type: String,
        required: true
    },
    badgeDescription: {
        type: String,
        required: true
    },
    badgeIcon: {
        type: String,
        default: '🏆'
    },
    badgeColor: {
        type: String,
        default: '#FFD700' // Gold
    },
    earnedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate badges
badgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);
