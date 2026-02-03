import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar Component
 * Top navigation with role-based menu items
 */
export default function Navbar() {
    const { user, isAuthenticated, isStudent, isGuardian, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 bg-cyber-darker/90 backdrop-blur-lg border-b border-cyber-primary/20"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-secondary rounded-lg flex items-center justify-center text-xl">
                            🛡️
                        </div>
                        <span className="font-cyber text-xl font-bold text-cyber-primary group-hover:text-glow transition-all">
                            CyberQuest
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                {/* Student Navigation */}
                                {isStudent && (
                                    <>
                                        <NavLink to="/dashboard">Dashboard</NavLink>
                                        <NavLink to="/levels">Play</NavLink>
                                        <NavLink to="/side-quests">Side Quests</NavLink>
                                        <NavLink to="/badges">Badges</NavLink>
                                    </>
                                )}

                                {/* Parent/Teacher Navigation */}
                                {isGuardian && (
                                    <>
                                        <NavLink to="/analytics">Analytics</NavLink>
                                        <NavLink to="/students">Students</NavLink>
                                    </>
                                )}

                                {/* User Menu */}
                                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-cyber-primary/30">
                                    <div className="text-sm">
                                        <span className="text-gray-400">👋 </span>
                                        <span className="text-cyber-primary font-medium">{user?.username}</span>
                                        <span className="text-xs text-gray-500 ml-2 capitalize">({user?.role})</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-400 hover:text-cyber-danger transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login">Login</NavLink>
                                <Link
                                    to="/register"
                                    className="cyber-btn text-xs py-2 px-4"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-cyber-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}

/**
 * NavLink Component
 * Styled navigation link with hover effects
 */
function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-gray-300 hover:text-cyber-primary transition-colors relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-primary transition-all group-hover:w-full" />
        </Link>
    );
}
