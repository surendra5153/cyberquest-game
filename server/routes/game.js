const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Badge = require('../models/Badge');
const { protect } = require('../middleware/auth');
const { studentOnly } = require('../middleware/rbac');

/**
 * Badge definitions with requirements
 */
const BADGE_DEFINITIONS = {
    phishing_detector: {
        name: 'Phishing Detector',
        description: 'Completed Level 1: Phishing Detection',
        icon: '🔍',
        color: '#3B82F6'
    },
    phishing_master: {
        name: 'Phishing Master',
        description: 'Achieved 100% on Level 1',
        icon: '🛡️',
        color: '#8B5CF6'
    },
    password_builder: {
        name: 'Password Builder',
        description: 'Completed Level 2: Password Builder',
        icon: '🔐',
        color: '#10B981'
    },
    password_pro: {
        name: 'Password Pro',
        description: 'Created a perfect strength password',
        icon: '🔑',
        color: '#F59E0B'
    },
    cyber_speedster: {
        name: 'Cyber Speedster',
        description: 'Completed Level 3: Cyber Rush',
        icon: '⚡',
        color: '#EF4444'
    },
    lightning_reflexes: {
        name: 'Lightning Reflexes',
        description: 'Scored 90%+ on Cyber Rush',
        icon: '🏃',
        color: '#EC4899'
    },
    story_hero: {
        name: 'Story Hero',
        description: 'Completed a story-based level',
        icon: '📖',
        color: '#6366F1'
    },
    cyber_guardian: {
        name: 'Cyber Guardian',
        description: 'Completed all game levels',
        icon: '🦸',
        color: '#FFD700'
    },
    first_steps: {
        name: 'First Steps',
        description: 'Completed your first level',
        icon: '👣',
        color: '#14B8A6'
    },
    quick_learner: {
        name: 'Quick Learner',
        description: 'Completed 3 different levels',
        icon: '📚',
        color: '#F97316'
    },
    safety_expert: {
        name: 'Safety Expert',
        description: 'Completed all levels with 80%+ score',
        icon: '🎖️',
        color: '#A855F7'
    }
};

/**
 * @route   POST /api/game/progress
 * @desc    Save level progress
 * @access  Private (students only)
 */
router.post('/progress', protect, studentOnly, async (req, res) => {
    try {
        const {
            levelId,
            levelName,
            score,
            mistakes,
            risksAvoided,
            learningPoints,
            timeSpent,
            completed
        } = req.body;

        // Find existing progress or create new
        let progress = await Progress.findOne({
            userId: req.user._id,
            levelId
        });

        if (progress) {
            // Update existing progress
            progress.attempts += 1;
            progress.score = score;
            progress.mistakes = mistakes || [];
            progress.risksAvoided = risksAvoided || [];
            progress.learningPoints = learningPoints || [];
            progress.timeSpent = timeSpent || 0;

            if (completed) {
                progress.completed = true;
                progress.completedAt = new Date();
            }

            // Update high score if current is higher
            if (score > progress.highScore) {
                progress.highScore = score;
            }
        } else {
            // Create new progress
            progress = new Progress({
                userId: req.user._id,
                levelId,
                levelName: levelName || `Level ${levelId}`,
                score,
                mistakes: mistakes || [],
                risksAvoided: risksAvoided || [],
                learningPoints: learningPoints || [],
                timeSpent: timeSpent || 0,
                completed: completed || false,
                highScore: score,
                completedAt: completed ? new Date() : null
            });
        }

        await progress.save();

        // Check and award badges
        const newBadges = await checkAndAwardBadges(req.user._id, levelId, score, completed);

        res.json({
            success: true,
            message: 'Progress saved',
            data: {
                progress,
                newBadges
            }
        });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving progress',
            error: error.message
        });
    }
});

/**
 * Check and award badges based on progress
 */
async function checkAndAwardBadges(userId, levelId, score, completed) {
    const newBadges = [];

    if (!completed) return newBadges;

    try {
        // Get all user progress
        const allProgress = await Progress.find({ userId, completed: true });
        const completedLevels = allProgress.map(p => p.levelId);
        const userBadges = await Badge.find({ userId });
        const earnedBadgeTypes = userBadges.map(b => b.badgeType);

        // Helper to award badge if not already earned
        const awardBadge = async (badgeType) => {
            if (!earnedBadgeTypes.includes(badgeType) && BADGE_DEFINITIONS[badgeType]) {
                const badgeDef = BADGE_DEFINITIONS[badgeType];
                const badge = await Badge.create({
                    userId,
                    badgeType,
                    badgeName: badgeDef.name,
                    badgeDescription: badgeDef.description,
                    badgeIcon: badgeDef.icon,
                    badgeColor: badgeDef.color
                });
                newBadges.push(badge);
                earnedBadgeTypes.push(badgeType);
            }
        };

        // First level completion
        if (completedLevels.length === 1) {
            await awardBadge('first_steps');
        }

        // Level-specific badges
        if (levelId === 1) {
            await awardBadge('phishing_detector');
            if (score === 100) await awardBadge('phishing_master');
        }

        if (levelId === 2) {
            await awardBadge('password_builder');
            if (score >= 90) await awardBadge('password_pro');
        }

        if (levelId === 3) {
            await awardBadge('cyber_speedster');
            if (score >= 90) await awardBadge('lightning_reflexes');
        }

        if (levelId === 4 || levelId === 5) {
            await awardBadge('story_hero');
        }

        // Quick learner (3 levels)
        if (completedLevels.length >= 3) {
            await awardBadge('quick_learner');
        }

        // Cyber guardian (all levels)
        if ([1, 2, 3, 4].every(l => completedLevels.includes(l))) {
            await awardBadge('cyber_guardian');
        }

        // Safety expert (all levels with 80%+)
        const allHighScore = allProgress.every(p => p.highScore >= 80);
        if (completedLevels.length >= 4 && allHighScore) {
            await awardBadge('safety_expert');
        }

    } catch (error) {
        console.error('Badge award error:', error);
    }

    return newBadges;
}

/**
 * @route   GET /api/game/progress
 * @desc    Get user's progress for all levels
 * @access  Private
 */
router.get('/progress', protect, async (req, res) => {
    try {
        const progress = await Progress.find({ userId: req.user._id })
            .sort({ levelId: 1 });

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/game/badges
 * @desc    Get user's earned badges
 * @access  Private
 */
router.get('/badges', protect, async (req, res) => {
    try {
        const badges = await Badge.find({ userId: req.user._id })
            .sort({ earnedAt: -1 });

        res.json({
            success: true,
            data: badges,
            allBadges: BADGE_DEFINITIONS
        });
    } catch (error) {
        console.error('Get badges error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching badges',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/game/leaderboard
 * @desc    Get top players (optional feature)
 * @access  Private
 */
router.get('/leaderboard', protect, async (req, res) => {
    try {
        // Aggregate total scores by user
        const leaderboard = await Progress.aggregate([
            { $match: { completed: true } },
            {
                $group: {
                    _id: '$userId',
                    totalScore: { $sum: '$highScore' },
                    levelsCompleted: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: 10 }
        ]);

        // Populate user details
        const User = require('../models/User');
        const populatedLeaderboard = await Promise.all(
            leaderboard.map(async (entry) => {
                const user = await User.findById(entry._id).select('username avatar');
                return {
                    username: user?.username || 'Anonymous',
                    avatar: user?.avatar,
                    totalScore: entry.totalScore,
                    levelsCompleted: entry.levelsCompleted
                };
            })
        );

        res.json({
            success: true,
            data: populatedLeaderboard
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
});

module.exports = router;
