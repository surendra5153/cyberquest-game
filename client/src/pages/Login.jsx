import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Login Page Component
 * User authentication with role display
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        setIsLoading(true);

        const result = await login(email, password);

        setIsLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        🛡️
                    </motion.div>
                    <h1 className="font-cyber text-3xl font-bold text-white mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">
                        Login to continue your quest
                    </p>
                </div>

                {/* Login Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="cyber-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            className="mb-6 p-4 bg-cyber-danger/20 border border-cyber-danger/50 rounded-lg text-cyber-danger text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="cyber-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="cyber-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cyber-btn py-4 text-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="cyber-spinner w-5 h-5" />
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyber-primary hover:underline">
                            Create one
                        </Link>
                    </p>
                </motion.form>

                {/* Demo Accounts Info */}
                <motion.div
                    className="mt-6 text-center text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p>Demo accounts available after registration</p>
                </motion.div>
            </motion.div>
        </div>
    );
}
