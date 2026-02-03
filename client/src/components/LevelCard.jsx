import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Level definitions with metadata
 */
export const LEVELS = [
    {
        id: 1,
        name: 'Phishing Detection',
        description: 'Learn to identify fake login pages and phishing attempts',
        icon: '🎣',
        color: '#3B82F6',
        duration: '2-3 min',
        difficulty: 'Easy',
        path: '/levels/1',
        skills: ['URL Analysis', 'Security Indicators', 'Critical Thinking']
    },
    {
        id: 2,
        name: 'Password Builder',
        description: 'Create strong passwords and understand what makes them secure',
        icon: '🔐',
        color: '#10B981',
        duration: '2-3 min',
        difficulty: 'Easy',
        path: '/levels/2',
        skills: ['Password Strength', 'Security Patterns', 'Best Practices']
    },
    {
        id: 3,
        name: 'Cyber Rush',
        description: '30-second challenge! Make quick decisions under pressure',
        icon: '⚡',
        color: '#F59E0B',
        duration: '30 sec',
        difficulty: 'Medium',
        path: '/levels/3',
        skills: ['Quick Thinking', 'Risk Assessment', 'Decision Making']
    },
    {
        id: 4,
        name: 'Story: Digital Dilemma',
        description: 'Help Maya navigate cyberbullying and online safety',
        icon: '📖',
        color: '#8B5CF6',
        duration: '3-4 min',
        difficulty: 'Medium',
        path: '/levels/4',
        skills: ['Empathy', 'Problem Solving', 'Online Ethics']
    }
];

/**
 * LevelCard Component
 * Displays a level with progress indicator
 */
export default function LevelCard({ level, progress, isUnlocked = true }) {
    const isCompleted = progress?.completed;
    const score = progress?.highScore || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
        >
            <Link
                to={isUnlocked ? level.path : '#'}
                className={`level-card block h-full ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
                style={{
                    '--level-color': level.color
                }}
                onClick={e => !isUnlocked && e.preventDefault()}
            >
                {/* Level Icon */}
                <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${level.color}33, ${level.color}11)`,
                        border: `2px solid ${level.color}50`
                    }}
                >
                    {!isUnlocked ? '🔒' : level.icon}
                </div>

                {/* Level Info */}
                <h3 className="text-lg font-cyber font-bold text-white mb-2">
                    Level {level.id}: {level.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                    {level.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {level.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <span>📊</span>
                        {level.difficulty}
                    </span>
                </div>

                {/* Progress Bar */}
                {isUnlocked && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">
                                {isCompleted ? 'Best Score' : 'Not completed'}
                            </span>
                            <span style={{ color: level.color }}>{score}%</span>
                        </div>
                        <div className="cyber-progress">
                            <motion.div
                                className="cyber-progress-bar"
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{
                                    background: `linear-gradient(90deg, ${level.color}, ${level.color}88)`
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {level.skills.slice(0, 2).map((skill, i) => (
                        <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Locked Overlay */}
                {!isUnlocked && (
                    <div className="absolute inset-0 bg-cyber-darker/60 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-4xl">🔒</span>
                            <p className="text-sm text-gray-400 mt-2">Complete Level {level.id - 1} first</p>
                        </div>
                    </div>
                )}
            </Link>
        </motion.div>
    );
}

/**
 * LevelGrid Component
 * Displays all levels in a grid
 */
export function LevelGrid({ progress = [], isLevelUnlocked }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEVELS.map(level => (
                <LevelCard
                    key={level.id}
                    level={level}
                    progress={progress.find(p => p.levelId === level.id)}
                    isUnlocked={isLevelUnlocked ? isLevelUnlocked(level.id) : true}
                />
            ))}
        </div>
    );
}
