import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

/**
 * Parent/Teacher Dashboard Component
 * Analytics view for monitoring student progress
 */
export default function ParentDashboard() {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linkEmail, setLinkEmail] = useState('');
    const [linkMessage, setLinkMessage] = useState('');

    // Fetch linked students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`${API_URL}/analytics/students`);
                setStudents(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch students:', error);
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    // Fetch analytics for selected student
    const fetchAnalytics = async (studentId) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/analytics/dashboard/${studentId}`);
            setAnalytics(res.data.data);
            setSelectedStudent(studentId);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Link a student account
    const handleLinkStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/auth/link-student`, {
                studentEmail: linkEmail
            });
            setLinkMessage(`Successfully linked ${res.data.data.studentUsername}!`);
            setLinkEmail('');
            // Refresh students list
            const studentsRes = await axios.get(`${API_URL}/analytics/students`);
            setStudents(studentsRes.data.data);
        } catch (error) {
            setLinkMessage(error.response?.data?.message || 'Failed to link student');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-4xl font-bold text-white mb-2">
                        {user?.role === 'parent' ? 'Parent' : 'Teacher'} Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Monitor your students' cybersecurity learning progress
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Students List */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="cyber-card mb-6">
                            <h2 className="font-cyber text-xl font-bold text-white mb-4">
                                Linked Students
                            </h2>

                            {students.length > 0 ? (
                                <div className="space-y-3">
                                    {students.map((item) => (
                                        <div
                                            key={item.student._id}
                                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedStudent === item.student._id
                                                    ? 'bg-cyber-primary/20 border border-cyber-primary'
                                                    : 'bg-cyber-dark/50 border border-transparent hover:border-cyber-primary/30'
                                                }`}
                                            onClick={() => fetchAnalytics(item.student._id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium text-white">
                                                        {item.student.username}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {item.student.email}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-cyber-primary font-bold">
                                                        {item.summary.levelsCompleted}/4
                                                    </div>
                                                    <div className="text-xs text-gray-500">levels</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-4">
                                    No students linked yet
                                </p>
                            )}
                        </div>

                        {/* Link Student Form */}
                        <div className="cyber-card">
                            <h3 className="font-semibold text-white mb-4">Link a Student</h3>
                            <form onSubmit={handleLinkStudent}>
                                <input
                                    type="email"
                                    value={linkEmail}
                                    onChange={(e) => setLinkEmail(e.target.value)}
                                    placeholder="Student's email"
                                    className="cyber-input mb-3"
                                    required
                                />
                                <button type="submit" className="cyber-btn w-full py-3">
                                    Link Student
                                </button>
                            </form>
                            {linkMessage && (
                                <p className={`mt-3 text-sm ${linkMessage.includes('Successfully') ? 'text-cyber-success' : 'text-cyber-danger'
                                    }`}>
                                    {linkMessage}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* Analytics Panel */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {loading ? (
                            <div className="cyber-card flex items-center justify-center py-20">
                                <span className="cyber-spinner w-12 h-12" />
                            </div>
                        ) : analytics ? (
                            <div className="space-y-6">
                                {/* Student Overview */}
                                <div className="cyber-card">
                                    <h2 className="font-cyber text-xl font-bold text-white mb-4">
                                        {analytics.student.username}'s Progress
                                    </h2>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <StatBox
                                            label="Levels Completed"
                                            value={analytics.analytics.levelsCompleted}
                                            icon="🎮"
                                            color="#3B82F6"
                                        />
                                        <StatBox
                                            label="Average Score"
                                            value={`${analytics.analytics.averageScore}%`}
                                            icon="⭐"
                                            color="#10B981"
                                        />
                                        <StatBox
                                            label="Total Badges"
                                            value={analytics.badges.length}
                                            icon="🏆"
                                            color="#F59E0B"
                                        />
                                        <StatBox
                                            label="Time Spent"
                                            value={formatTime(analytics.analytics.totalTimeSpent)}
                                            icon="⏱️"
                                            color="#8B5CF6"
                                        />
                                    </div>
                                </div>

                                {/* Risk Areas */}
                                {analytics.analytics.riskAreas.length > 0 && (
                                    <div className="cyber-card border-cyber-danger/30">
                                        <h3 className="font-semibold text-cyber-danger mb-4 flex items-center gap-2">
                                            <span>⚠️</span> Risk Areas (Needs Attention)
                                        </h3>
                                        <div className="space-y-3">
                                            {analytics.analytics.riskAreas.map((risk, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-cyber-danger/10 rounded-lg">
                                                    <div>
                                                        <span className="text-white">{risk.level}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({risk.category})</span>
                                                    </div>
                                                    <span className="text-cyber-danger font-bold">{risk.score}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Strength Areas */}
                                {analytics.analytics.strengthAreas.length > 0 && (
                                    <div className="cyber-card border-cyber-success/30">
                                        <h3 className="font-semibold text-cyber-success mb-4 flex items-center gap-2">
                                            <span>✅</span> Strength Areas
                                        </h3>
                                        <div className="space-y-3">
                                            {analytics.analytics.strengthAreas.map((strength, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-cyber-success/10 rounded-lg">
                                                    <div>
                                                        <span className="text-white">{strength.level}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({strength.category})</span>
                                                    </div>
                                                    <span className="text-cyber-success font-bold">{strength.score}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Common Mistakes */}
                                {analytics.analytics.commonMistakes.length > 0 && (
                                    <div className="cyber-card">
                                        <h3 className="font-semibold text-cyber-accent mb-4 flex items-center gap-2">
                                            <span>📊</span> Common Mistakes
                                        </h3>
                                        <div className="space-y-2">
                                            {analytics.analytics.commonMistakes.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-300">{item.mistake}</span>
                                                    <span className="text-cyber-accent">{item.count}x</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Badges Earned */}
                                <div className="cyber-card">
                                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                        <span>🏆</span> Badges Earned
                                    </h3>
                                    {analytics.badges.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {analytics.badges.map((badge) => (
                                                <div
                                                    key={badge._id}
                                                    className="flex items-center gap-2 px-3 py-2 bg-cyber-dark/50 rounded-full"
                                                >
                                                    <span>{badge.badgeIcon}</span>
                                                    <span className="text-sm text-white">{badge.badgeName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">No badges earned yet</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="cyber-card text-center py-20">
                                <span className="text-6xl mb-4 block">👈</span>
                                <p className="text-gray-400">
                                    Select a student to view their analytics
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

/**
 * StatBox Component
 */
function StatBox({ label, value, icon, color }) {
    return (
        <div className="text-center p-4 bg-cyber-dark/50 rounded-lg">
            <span className="text-2xl mb-2 block">{icon}</span>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}

/**
 * Format seconds into readable time
 */
function formatTime(seconds) {
    if (!seconds) return '0m';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
}
