const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { guardianOnly } = require('../middleware/rbac');

/**
 * @route   GET /api/analytics/dashboard/:studentId
 * @desc    Get detailed analytics for a specific student
 * @access  Private (parents/teachers only)
 */
router.get('/dashboard/:studentId', protect, guardianOnly, async (req, res) => {
    try {
        const { studentId } = req.params;

        // Verify the guardian has access to this student
        const guardian = await User.findById(req.user._id);
        if (!guardian.linkedStudents.includes(studentId)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this student\'s data'
            });
        }

        // Get student info
        const student = await User.findById(studentId).select('username email createdAt');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get all progress
        const progress = await Progress.find({ userId: studentId }).sort({ levelId: 1 });

        // Get all badges
        const badges = await Badge.find({ userId: studentId }).sort({ earnedAt: -1 });

        // Calculate analytics
        const analytics = calculateAnalytics(progress);

        res.json({
            success: true,
            data: {
                student,
                progress,
                badges,
                analytics
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/analytics/students
 * @desc    Get summary analytics for all linked students
 * @access  Private (parents/teachers only)
 */
router.get('/students', protect, guardianOnly, async (req, res) => {
    try {
        const guardian = await User.findById(req.user._id).populate('linkedStudents', 'username email');

        const studentsAnalytics = await Promise.all(
            guardian.linkedStudents.map(async (student) => {
                const progress = await Progress.find({ userId: student._id });
                const badges = await Badge.find({ userId: student._id });
                const analytics = calculateAnalytics(progress);

                return {
                    student: {
                        _id: student._id,
                        username: student.username,
                        email: student.email
                    },
                    summary: {
                        levelsCompleted: progress.filter(p => p.completed).length,
                        totalBadges: badges.length,
                        averageScore: analytics.averageScore,
                        totalTimeSpent: analytics.totalTimeSpent,
                        riskAreas: analytics.riskAreas
                    }
                };
            })
        );

        res.json({
            success: true,
            data: studentsAnalytics
        });
    } catch (error) {
        console.error('Students analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students analytics',
            error: error.message
        });
    }
});

/**
 * Calculate detailed analytics from progress data
 */
function calculateAnalytics(progress) {
    if (!progress || progress.length === 0) {
        return {
            levelsCompleted: 0,
            totalAttempts: 0,
            averageScore: 0,
            totalTimeSpent: 0,
            commonMistakes: [],
            riskAreas: [],
            strengthAreas: [],
            progressOverTime: []
        };
    }

    // Basic stats
    const completedProgress = progress.filter(p => p.completed);
    const levelsCompleted = completedProgress.length;
    const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Average score
    const averageScore = completedProgress.length > 0
        ? Math.round(completedProgress.reduce((sum, p) => sum + p.highScore, 0) / completedProgress.length)
        : 0;

    // Aggregate all mistakes
    const allMistakes = progress.flatMap(p => p.mistakes);
    const mistakeCounts = {};
    allMistakes.forEach(mistake => {
        mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1;
    });

    // Sort and get top mistakes
    const commonMistakes = Object.entries(mistakeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([mistake, count]) => ({ mistake, count }));

    // Determine risk areas based on low scores and common mistakes
    const riskAreas = [];
    progress.forEach(p => {
        if (p.highScore < 70) {
            riskAreas.push({
                level: p.levelName,
                score: p.highScore,
                category: getLevelCategory(p.levelId)
            });
        }
    });

    // Determine strength areas based on high scores
    const strengthAreas = completedProgress
        .filter(p => p.highScore >= 80)
        .map(p => ({
            level: p.levelName,
            score: p.highScore,
            category: getLevelCategory(p.levelId)
        }));

    // Progress over time (for charts)
    const progressOverTime = completedProgress.map(p => ({
        levelId: p.levelId,
        levelName: p.levelName,
        score: p.highScore,
        completedAt: p.completedAt
    }));

    return {
        levelsCompleted,
        totalAttempts,
        averageScore,
        totalTimeSpent,
        commonMistakes,
        riskAreas,
        strengthAreas,
        progressOverTime
    };
}

/**
 * Get category name for a level
 */
function getLevelCategory(levelId) {
    const categories = {
        1: 'Phishing Detection',
        2: 'Password Security',
        3: 'Quick Decision Making',
        4: 'Cyberbullying Awareness',
        5: 'Online Scam Prevention'
    };
    return categories[levelId] || 'General Cybersecurity';
}

module.exports = router;
