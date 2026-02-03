import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { LevelGrid, LEVELS } from '../components/LevelCard';
import Badge from '../components/Badge';

/**
 * Student Dashboard Component
 * Shows progress, badges, and level selection
 */
export default function StudentDashboard() {
    const { user } = useAuth();
    const {
        progress,
        badges,
        loading,
        fetchProgress,
        fetchBadges,
        isLevelUnlocked,
        getStats
    } = useGame();

    // Fetch data on mount
    useEffect(() => {
        fetchProgress();
        fetchBadges();
    }, [fetchProgress, fetchBadges]);

    const stats = getStats();

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-cyber-primary">{user?.username}</span>!
                    </h1>
                    <p className="text-gray-400">
                        Continue your cybersecurity journey
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <StatCard
                        icon="🎮"
                        label="Levels Completed"
                        value={`${stats.completedLevels}/${stats.totalLevels}`}
                        color="#3B82F6"
                    />
                    <StatCard
                        icon="⭐"
                        label="Average Score"
                        value={`${stats.averageScore}%`}
                        color="#10B981"
                    />
                    <StatCard
                        icon="🏆"
                        label="Badges Earned"
                        value={stats.totalBadges}
                        color="#F59E0B"
                    />
                    <StatCard
                        icon="⏱️"
                        label="Time Played"
                        value={formatTime(stats.totalTime)}
                        color="#8B5CF6"
                    />
                </motion.div>

                {/* Progress Overview */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-cyber text-2xl font-bold text-white">
                            Your Progress
                        </h2>
                        <div className="text-sm text-gray-400">
                            {Math.round((stats.completedLevels / stats.totalLevels) * 100)}% Complete
                        </div>
                    </div>

                    {/* Overall progress bar */}
                    <div className="cyber-progress h-4 mb-2">
                        <motion.div
                            className="cyber-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${(stats.completedLevels / stats.totalLevels) * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </motion.div>

                {/* Levels Grid */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="font-cyber text-2xl font-bold text-white mb-6">
                        Game Levels
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <span className="cyber-spinner w-12 h-12" />
                        </div>
                    ) : (
                        <LevelGrid progress={progress} isLevelUnlocked={isLevelUnlocked} />
                    )}
                </motion.div>

                {/* Recent Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-cyber text-2xl font-bold text-white">
                            Your Badges
                        </h2>
                        <Link
                            to="/badges"
                            className="text-cyber-primary hover:underline text-sm"
                        >
                            View All →
                        </Link>
                    </div>

                    {badges.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {badges.slice(0, 6).map((badge, index) => (
                                <motion.div
                                    key={badge._id}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <Badge badge={badge} size="md" />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="cyber-card text-center py-8">
                            <span className="text-4xl mb-4 block">🎖️</span>
                            <p className="text-gray-400 mb-4">No badges earned yet</p>
                            <Link to="/levels/1" className="cyber-btn">
                                Start Playing
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

/**
 * StatCard Component
 * Displays a single stat with icon
 */
function StatCard({ icon, label, value, color }) {
    return (
        <motion.div
            className="cyber-card text-center"
            whileHover={{ scale: 1.02 }}
        >
            <span className="text-3xl mb-2 block">{icon}</span>
            <div
                className="text-2xl font-cyber font-bold mb-1"
                style={{ color }}
            >
                {value}
            </div>
            <div className="text-xs text-gray-400">{label}</div>
        </motion.div>
    );
}

/**
 * Format seconds into readable time
 */
function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
}
