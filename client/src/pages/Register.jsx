import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

/**
 * Register Page Component
 * User registration with role selection
 */
export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const { register, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError('');
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        );

        setIsLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    const roles = [
        { id: 'student', label: 'Student', icon: '🎮', description: 'Play levels and earn badges' },
        { id: 'parent', label: 'Parent', icon: '👨‍👩‍👧', description: 'Monitor your child\'s progress' },
        { id: 'teacher', label: 'Teacher', icon: '👩‍🏫', description: 'Track student learning' }
    ];

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-12">
            <motion.div
                className="w-full max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="text-6xl mb-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        🚀
                    </motion.div>
                    <h1 className="font-cyber text-3xl font-bold text-white mb-2">
                        Join CyberQuest
                    </h1>
                    <p className="text-gray-400">
                        Start your cybersecurity adventure
                    </p>
                </div>

                {/* Registration Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="cyber-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Error Message */}
                    {(error || localError) && (
                        <motion.div
                            className="mb-6 p-4 bg-cyber-danger/20 border border-cyber-danger/50 rounded-lg text-cyber-danger text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {error || localError}
                        </motion.div>
                    )}

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            I am a...
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'role', value: role.id } })}
                                    className={`p-4 rounded-lg border-2 transition-all text-center ${formData.role === role.id
                                            ? 'border-cyber-primary bg-cyber-primary/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl block mb-1">{role.icon}</span>
                                    <span className="text-sm font-medium text-white">{role.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {roles.find(r => r.id === formData.role)?.description}
                        </p>
                    </div>

                    {/* Username Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="cyber-input"
                            placeholder="CyberHero123"
                            required
                            minLength={3}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="cyber-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="cyber-input"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyber-primary hover:underline">
                            Login
                        </Link>
                    </p>
                </motion.form>
            </motion.div>
        </div>
    );
}
