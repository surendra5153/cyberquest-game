import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Badge from './Badge';

/**
 * LevelComplete Component
 * Shows results after completing a level
 */
export default function LevelComplete({
    levelId,
    levelName,
    score,
    risksAvoided = [],
    mistakes = [],
    learningPoints = [],
    newBadges = [],
    timeSpent = 0,
    onReplay,
    onNextLevel
}) {
    const isPerfect = score === 100;
    const isPassing = score >= 70;

    return (
        <motion.div
            className="fixed inset-0 bg-cyber-darker/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="max-w-2xl w-full bg-cyber-dark/80 border border-cyber-primary/30 rounded-2xl p-8 overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="text-6xl mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                    >
                        {isPerfect ? '🏆' : isPassing ? '✅' : '📚'}
                    </motion.div>

                    <h2 className="font-cyber text-2xl font-bold text-white mb-2">
                        {isPerfect ? 'Perfect Score!' : isPassing ? 'Level Complete!' : 'Keep Learning!'}
                    </h2>

                    <p className="text-gray-400">
                        {levelName} - Level {levelId}
                    </p>
                </div>

                {/* Score Display */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-cyber-primary/30 relative">
                        <span
                            className="text-4xl font-cyber font-bold"
                            style={{ color: isPerfect ? '#FFD700' : isPassing ? '#10B981' : '#F59E0B' }}
                        >
                            {score}%
                        </span>
                        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-cyber-primary/20"
                            />
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={isPerfect ? '#FFD700' : isPassing ? '#10B981' : '#F59E0B'}
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: score / 100 }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                style={{
                                    strokeDasharray: '283',
                                    strokeDashoffset: '0'
                                }}
                            />
                        </svg>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Time: {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
                    </p>
                </motion.div>

                {/* New Badges */}
                {newBadges.length > 0 && (
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="text-lg font-semibold text-cyber-primary mb-4 flex items-center gap-2">
                            <span>🎖️</span> New Badges Earned!
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {newBadges.map((badge, i) => (
                                <Badge key={i} badge={badge} size="md" />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Risks Avoided */}
                {risksAvoided.length > 0 && (
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <h3 className="text-lg font-semibold text-cyber-success mb-3 flex items-center gap-2">
                            <span>✅</span> Risks Avoided
                        </h3>
                        <ul className="space-y-2">
                            {risksAvoided.map((risk, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-cyber-success mt-0.5">✓</span>
                                    {risk}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Mistakes */}
                {mistakes.length > 0 && (
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <h3 className="text-lg font-semibold text-cyber-danger mb-3 flex items-center gap-2">
                            <span>⚠️</span> Areas to Improve
                        </h3>
                        <ul className="space-y-2">
                            {mistakes.map((mistake, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-cyber-danger mt-0.5">×</span>
                                    {mistake}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Learning Points */}
                <motion.div
                    className="mb-8 p-4 bg-cyber-primary/10 rounded-lg border border-cyber-primary/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h3 className="text-lg font-semibold text-cyber-primary mb-3 flex items-center gap-2">
                        <span>💡</span> Key Learning Points
                    </h3>
                    <ul className="space-y-2">
                        {learningPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-cyber-primary mt-0.5">{i + 1}.</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Actions */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <button
                        onClick={onReplay}
                        className="cyber-btn-secondary py-3 px-6"
                    >
                        Play Again
                    </button>

                    {onNextLevel && (
                        <button
                            onClick={onNextLevel}
                            className="cyber-btn py-3 px-6"
                        >
                            Next Level →
                        </button>
                    )}

                    <Link
                        to="/dashboard"
                        className="cyber-btn py-3 px-6 text-center"
                    >
                        Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
