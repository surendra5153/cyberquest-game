import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Home Page Component
 * Landing page with game overview
 */
export default function Home() {
    const { isAuthenticated, isStudent } = useAuth();

    return (
        <div className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 left-10 w-64 h-64 bg-cyber-primary/10 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-96 h-96 bg-cyber-secondary/10 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity }}
                    />
                </div>

                <div className="max-w-6xl mx-auto text-center relative z-10">
                    {/* Main Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-cyber text-5xl md:text-7xl font-black mb-6">
                            <span className="text-white">Cyber</span>
                            <span className="text-cyber-primary text-glow">Quest</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-4">
                            Master Cybersecurity Through Play
                        </p>
                        <p className="text-gray-500 max-w-2xl mx-auto mb-8">
                            Interactive levels, real-world scenarios, and engaging stories that teach you
                            how to stay safe online. Perfect for teens aged 13-18.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {isAuthenticated ? (
                            <Link
                                to={isStudent ? '/dashboard' : '/analytics'}
                                className="cyber-btn text-lg px-10 py-4"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="cyber-btn text-lg px-10 py-4">
                                    Start Your Quest
                                </Link>
                                <Link to="/login" className="cyber-btn-secondary text-lg px-10 py-4">
                                    Login
                                </Link>
                            </>
                        )}
                    </motion.div>

                    {/* Hero Image/Animation */}
                    <motion.div
                        className="relative w-full max-w-4xl mx-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <div className="aspect-video bg-gradient-to-br from-cyber-dark to-cyber-darker rounded-2xl border border-cyber-primary/30 overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <motion.div
                                        className="text-8xl mb-4"
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        🛡️
                                    </motion.div>
                                    <p className="text-cyber-primary font-cyber text-xl">
                                        Defend the Digital World
                                    </p>
                                </div>
                            </div>
                            {/* Scan line effect */}
                            <div className="absolute inset-0 scanlines opacity-30" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-cyber-darker/50">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="font-cyber text-3xl md:text-4xl font-bold text-center mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-white">Game </span>
                        <span className="text-cyber-primary">Features</span>
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="cyber-card text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="text-4xl mb-4 block">{feature.icon}</span>
                                <h3 className="font-cyber text-lg font-bold text-cyber-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Levels Preview */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="font-cyber text-3xl md:text-4xl font-bold text-center mb-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-white">Epic </span>
                        <span className="text-cyber-secondary">Levels</span>
                    </motion.h2>
                    <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                        Progress through challenging levels, each teaching essential cybersecurity skills
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {levels.map((level, index) => (
                            <motion.div
                                key={index}
                                className="cyber-card flex items-start gap-4"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div
                                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{
                                        background: `linear-gradient(135deg, ${level.color}33, ${level.color}11)`,
                                        border: `2px solid ${level.color}50`
                                    }}
                                >
                                    {level.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{level.title}</h3>
                                    <p className="text-sm text-gray-400">{level.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        className="cyber-card py-12 px-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-cyber text-3xl font-bold text-white mb-4">
                            Ready to Become a Cyber Guardian?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Join thousands of students learning to protect themselves and others online.
                            Free to play, fun to master!
                        </p>
                        {!isAuthenticated && (
                            <Link to="/register" className="cyber-btn text-lg px-10 py-4">
                                Start Now - It's Free! 🚀
                            </Link>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-cyber-primary/10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <span className="font-cyber text-cyber-primary">CyberQuest</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2024 CyberQuest. Teaching cybersecurity through play.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Feature data
const features = [
    {
        icon: '🎮',
        title: 'Game-Based Learning',
        description: 'Learn through interactive gameplay, not boring lectures'
    },
    {
        icon: '⚡',
        title: 'Short Levels',
        description: '1-3 minute levels perfect for busy schedules'
    },
    {
        icon: '🏆',
        title: 'Earn Badges',
        description: 'Collect achievements and track your progress'
    },
    {
        icon: '📊',
        title: 'Parent Dashboard',
        description: 'Parents and teachers can monitor learning progress'
    }
];

// Level preview data
const levels = [
    {
        icon: '🎣',
        title: 'Level 1: Phishing Detection',
        description: 'Spot fake websites and phishing attempts before they catch you',
        color: '#3B82F6'
    },
    {
        icon: '🔐',
        title: 'Level 2: Password Builder',
        description: 'Create unbreakable passwords using proven techniques',
        color: '#10B981'
    },
    {
        icon: '⚡',
        title: 'Level 3: Cyber Rush',
        description: '30-second challenge to test your quick-thinking skills',
        color: '#F59E0B'
    },
    {
        icon: '📖',
        title: 'Level 4: Story Mode',
        description: 'Navigate real-world scenarios through interactive storytelling',
        color: '#8B5CF6'
    }
];
