/**
 * Role-Based Access Control Middleware
 * Restricts routes based on user roles
 */

/**
 * Authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

/**
 * Check if user is a student (can play games)
 */
const studentOnly = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'Only students can play game levels'
        });
    }
    next();
};

/**
 * Check if user is a parent or teacher (can view analytics)
 */
const guardianOnly = (req, res, next) => {
    if (!['parent', 'teacher'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Only parents and teachers can access this resource'
        });
    }
    next();
};

module.exports = { authorize, studentOnly, guardianOnly };
