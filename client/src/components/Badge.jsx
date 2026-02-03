import { motion } from 'framer-motion';

/**
 * Badge Component
 * Displays an earned badge with glow effects
 */
export default function Badge({ badge, size = 'md', showDetails = true }) {
    const sizeClasses = {
        sm: 'w-12 h-12 text-2xl',
        md: 'w-16 h-16 text-3xl',
        lg: 'w-24 h-24 text-5xl'
    };

    return (
        <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.1 }}
        >
            {/* Badge Icon */}
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
                style={{
                    background: `linear-gradient(135deg, ${badge.badgeColor}33, ${badge.badgeColor}11)`,
                    border: `2px solid ${badge.badgeColor}`,
                    boxShadow: `0 0 20px ${badge.badgeColor}66`
                }}
            >
                <span className="text-center">{badge.badgeIcon}</span>

                {/* Glow ring */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        border: `2px solid ${badge.badgeColor}`,
                        opacity: 0.5
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
            </div>

            {/* Badge Details */}
            {showDetails && (
                <div className="text-center">
                    <h4 className="font-semibold text-sm text-white">{badge.badgeName}</h4>
                    <p className="text-xs text-gray-400 max-w-[150px]">{badge.badgeDescription}</p>
                </div>
            )}
        </motion.div>
    );
}

/**
 * BadgeGrid Component
 * Displays a grid of badges
 */
export function BadgeGrid({ badges, emptyMessage = 'No badges earned yet' }) {
    if (!badges || badges.length === 0) {
        return (
            <div className="text-center py-12">
                <span className="text-6xl opacity-50">🎖️</span>
                <p className="text-gray-400 mt-4">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {badges.map((badge, index) => (
                <motion.div
                    key={badge._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Badge badge={badge} />
                </motion.div>
            ))}
        </div>
    );
}

/**
 * LockedBadge Component
 * Displays a badge placeholder for unearned badges
 */
export function LockedBadge({ badge, size = 'md' }) {
    const sizeClasses = {
        sm: 'w-12 h-12 text-2xl',
        md: 'w-16 h-16 text-3xl',
        lg: 'w-24 h-24 text-5xl'
    };

    return (
        <div className="flex flex-col items-center gap-2 opacity-40">
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center bg-gray-800/50 border-2 border-gray-600`}
            >
                <span className="text-gray-500">🔒</span>
            </div>
            <div className="text-center">
                <h4 className="font-semibold text-sm text-gray-500">{badge.name}</h4>
                <p className="text-xs text-gray-600">{badge.description}</p>
            </div>
        </div>
    );
}
