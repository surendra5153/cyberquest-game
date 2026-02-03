const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Validate role
        const validRoles = ['student', 'parent', 'teacher'];
        const userRole = validRoles.includes(role) ? role : 'student';

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: userRole
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('linkedStudents', 'username email')
            .populate('linkedGuardians', 'username email role');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/auth/link-student
 * @desc    Link a student to parent/teacher account
 * @access  Private (parent/teacher only)
 */
router.post('/link-student', protect, async (req, res) => {
    try {
        const { studentEmail } = req.body;

        // Only parents/teachers can link students
        if (!['parent', 'teacher'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Only parents and teachers can link students'
            });
        }

        // Find student
        const student = await User.findOne({ email: studentEmail, role: 'student' });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Add student to guardian's linked students
        const guardian = await User.findById(req.user._id);

        if (!guardian.linkedStudents.includes(student._id)) {
            guardian.linkedStudents.push(student._id);
            await guardian.save();
        }

        // Add guardian to student's linked guardians
        if (!student.linkedGuardians.includes(guardian._id)) {
            student.linkedGuardians.push(guardian._id);
            await student.save();
        }

        res.json({
            success: true,
            message: 'Student linked successfully',
            data: { studentId: student._id, studentUsername: student.username }
        });
    } catch (error) {
        console.error('Link student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
