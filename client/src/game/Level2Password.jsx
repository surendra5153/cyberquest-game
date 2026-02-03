import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import zxcvbn from 'zxcvbn';
import { useGame } from '../context/GameContext';
import LevelComplete from '../components/LevelComplete';

/**
 * Level 2 - Password Builder
 * Learn to create strong passwords with real-time strength feedback
 */

// Password patterns for the pattern-based generator
const PATTERNS = {
    words: ['cyber', 'quest', 'hero', 'shield', 'pixel', 'dragon', 'ninja', 'storm', 'blaze', 'frost'],
    numbers: ['123', '456', '789', '2024', '007', '42', '99'],
    symbols: ['!', '@', '#', '$', '%', '&', '*'],
    separators: ['-', '_', '.', '+']
};

// Challenge passwords to evaluate
const CHALLENGES = [
    { password: 'password123', task: 'Rate this password' },
    { password: 'J@ne$mith2005', task: 'Rate this password' },
    { password: 'Tr0ub4dor&3', task: 'Rate this password' },
    { password: 'correcthorsebatterystaple', task: 'Rate this password' }
];

export default function Level2Password() {
    const navigate = useNavigate();
    const { saveProgress } = useGame();

    const [phase, setPhase] = useState('intro'); // intro, build, challenge, complete
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [buildMethod, setBuildMethod] = useState(null); // pattern, random, manual
    const [challengeIndex, setChallengeIndex] = useState(0);
    const [challengeAnswers, setChallengeAnswers] = useState([]);
    const [builtPasswords, setBuiltPasswords] = useState([]);
    const [startTime] = useState(Date.now());
    const [showComplete, setShowComplete] = useState(false);

    // Analyze password strength
    useEffect(() => {
        if (password) {
            const result = zxcvbn(password);
            setStrength(result);
        } else {
            setStrength(null);
        }
    }, [password]);

    // Generate password based on method
    const generatePassword = useCallback((method) => {
        let newPassword = '';

        switch (method) {
            case 'pattern':
                // Word + Number + Symbol pattern
                const word1 = PATTERNS.words[Math.floor(Math.random() * PATTERNS.words.length)];
                const word2 = PATTERNS.words[Math.floor(Math.random() * PATTERNS.words.length)];
                const num = PATTERNS.numbers[Math.floor(Math.random() * PATTERNS.numbers.length)];
                const sym = PATTERNS.symbols[Math.floor(Math.random() * PATTERNS.symbols.length)];
                const sep = PATTERNS.separators[Math.floor(Math.random() * PATTERNS.separators.length)];
                newPassword = `${word1.charAt(0).toUpperCase()}${word1.slice(1)}${sep}${word2}${num}${sym}`;
                break;

            case 'random':
                // Fully random
                const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*';
                for (let i = 0; i < 16; i++) {
                    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                break;

            default:
                return;
        }

        setPassword(newPassword);
        setBuildMethod(method);
    }, []);

    // Get strength color
    const getStrengthColor = (score) => {
        const colors = ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#10B981'];
        return colors[score] || colors[0];
    };

    // Get strength label
    const getStrengthLabel = (score) => {
        const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
        return labels[score] || labels[0];
    };

    // Handle challenge answer
    const handleChallengeAnswer = (rating) => {
        const challenge = CHALLENGES[challengeIndex];
        const result = zxcvbn(challenge.password);
        const isCorrect = Math.abs(rating - result.score) <= 1; // Allow 1 point tolerance

        setChallengeAnswers([...challengeAnswers, {
            password: challenge.password,
            userRating: rating,
            actualStrength: result.score,
            correct: isCorrect
        }]);

        if (challengeIndex < CHALLENGES.length - 1) {
            setChallengeIndex(challengeIndex + 1);
        } else {
            handleComplete();
        }
    };

    // Save built password and continue
    const saveBuiltPassword = () => {
        if (strength && strength.score >= 3) {
            setBuiltPasswords([...builtPasswords, {
                password,
                strength: strength.score,
                method: buildMethod
            }]);
            setPassword('');
            setBuildMethod(null);

            if (builtPasswords.length >= 1) {
                setPhase('challenge');
            }
        }
    };

    // Complete the level
    const handleComplete = async () => {
        const challengeCorrect = challengeAnswers.filter(a => a.correct).length +
            (challengeIndex === CHALLENGES.length - 1 ? 1 : 0);
        const buildScore = builtPasswords.length > 0 ? builtPasswords[0].strength * 20 : 0;
        const challengeScore = (challengeCorrect / CHALLENGES.length) * 60;
        const score = Math.min(100, Math.round(buildScore + challengeScore));

        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        const risksAvoided = [];
        const mistakes = [];

        if (builtPasswords.some(p => p.strength >= 4)) {
            risksAvoided.push('Created a very strong password');
        }
        if (builtPasswords.some(p => p.strength >= 3)) {
            risksAvoided.push('Understood password strength indicators');
        }

        challengeAnswers.forEach(a => {
            if (!a.correct) {
                mistakes.push(`Misjudged strength of "${a.password}"`);
            }
        });

        const learningPoints = [
            'Password length is more important than complexity - 16+ characters recommended',
            'Passphrases (multiple random words) are both strong and memorable',
            'Avoid personal info, common words, and predictable patterns'
        ];

        await saveProgress({
            levelId: 2,
            levelName: 'Password Builder',
            score,
            mistakes,
            risksAvoided,
            learningPoints,
            timeSpent,
            completed: true
        });

        setShowComplete(true);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Level Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-3xl font-bold text-white mb-2">
                        Level 2: <span className="text-cyber-success">Password Builder</span>
                    </h1>
                    <p className="text-gray-400">
                        {phase === 'intro' && 'Learn to create unbreakable passwords'}
                        {phase === 'build' && 'Build a strong password'}
                        {phase === 'challenge' && 'Test your password judgment'}
                    </p>
                </motion.div>

                {/* Intro Phase */}
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            className="cyber-card text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <span className="text-6xl mb-6 block">🔐</span>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                The Art of Password Creation
                            </h2>
                            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
                                In this level, you'll learn to create passwords that are both secure AND memorable.
                                We'll use real-time strength analysis to guide you.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                                <div className="p-4 bg-cyber-dark/50 rounded-lg">
                                    <span className="text-2xl">📏</span>
                                    <p className="text-xs text-gray-400 mt-2">Length matters most</p>
                                </div>
                                <div className="p-4 bg-cyber-dark/50 rounded-lg">
                                    <span className="text-2xl">🎲</span>
                                    <p className="text-xs text-gray-400 mt-2">Randomness is key</p>
                                </div>
                                <div className="p-4 bg-cyber-dark/50 rounded-lg">
                                    <span className="text-2xl">🧠</span>
                                    <p className="text-xs text-gray-400 mt-2">Make it memorable</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPhase('build')}
                                className="cyber-btn px-8 py-4"
                            >
                                Start Building →
                            </button>
                        </motion.div>
                    )}

                    {/* Build Phase */}
                    {phase === 'build' && (
                        <motion.div
                            key="build"
                            className="cyber-card"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <h3 className="text-xl font-semibold text-white mb-6 text-center">
                                Create Your Password
                            </h3>

                            {/* Method Selection */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <button
                                    onClick={() => generatePassword('pattern')}
                                    className={`p-4 rounded-lg border-2 transition-all ${buildMethod === 'pattern'
                                            ? 'border-cyber-primary bg-cyber-primary/20'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">🧩</span>
                                    <span className="text-sm text-white">Pattern</span>
                                    <p className="text-xs text-gray-500 mt-1">Word + Numbers</p>
                                </button>
                                <button
                                    onClick={() => generatePassword('random')}
                                    className={`p-4 rounded-lg border-2 transition-all ${buildMethod === 'random'
                                            ? 'border-cyber-primary bg-cyber-primary/20'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">🎲</span>
                                    <span className="text-sm text-white">Random</span>
                                    <p className="text-xs text-gray-500 mt-1">Maximum security</p>
                                </button>
                                <button
                                    onClick={() => { setPassword(''); setBuildMethod('manual'); }}
                                    className={`p-4 rounded-lg border-2 transition-all ${buildMethod === 'manual'
                                            ? 'border-cyber-primary bg-cyber-primary/20'
                                            : 'border-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">✍️</span>
                                    <span className="text-sm text-white">Manual</span>
                                    <p className="text-xs text-gray-500 mt-1">Type your own</p>
                                </button>
                            </div>

                            {/* Password Input */}
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setBuildMethod('manual'); }}
                                        className="cyber-input pr-12 text-lg font-mono"
                                        placeholder="Enter or generate a password..."
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? '👁️' : '🙈'}
                                    </button>
                                </div>
                            </div>

                            {/* Strength Meter */}
                            {strength && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6"
                                >
                                    {/* Strength Bar */}
                                    <div className="flex gap-1 mb-3">
                                        {[0, 1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className="flex-1 h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: level <= strength.score
                                                        ? getStrengthColor(strength.score)
                                                        : '#374151'
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Strength Label */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span
                                            className="font-bold"
                                            style={{ color: getStrengthColor(strength.score) }}
                                        >
                                            {getStrengthLabel(strength.score)}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {password.length} characters
                                        </span>
                                    </div>

                                    {/* Feedback */}
                                    {strength.feedback.warning && (
                                        <div className="p-3 bg-cyber-warning/20 border border-cyber-warning/50 rounded-lg text-sm text-cyber-warning mb-3">
                                            ⚠️ {strength.feedback.warning}
                                        </div>
                                    )}

                                    {strength.feedback.suggestions.length > 0 && (
                                        <div className="p-3 bg-cyber-primary/10 border border-cyber-primary/30 rounded-lg">
                                            <p className="text-sm text-cyber-primary mb-2">💡 Suggestions:</p>
                                            <ul className="text-sm text-gray-400 space-y-1">
                                                {strength.feedback.suggestions.map((s, i) => (
                                                    <li key={i}>• {s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Crack Time */}
                                    <div className="mt-4 text-center p-3 bg-cyber-dark/50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Time to crack:</p>
                                        <p className="text-lg font-mono text-white">
                                            {strength.crack_times_display.offline_slow_hashing_1e4_per_second}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Save Button */}
                            <button
                                onClick={saveBuiltPassword}
                                disabled={!strength || strength.score < 3}
                                className={`w-full py-4 rounded-lg font-semibold transition-all ${strength && strength.score >= 3
                                        ? 'cyber-btn'
                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {!strength ? 'Create a password first' :
                                    strength.score < 3 ? 'Password not strong enough (need "Strong" or better)' :
                                        'Save & Continue →'}
                            </button>
                        </motion.div>
                    )}

                    {/* Challenge Phase */}
                    {phase === 'challenge' && !showComplete && (
                        <motion.div
                            key="challenge"
                            className="cyber-card"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="text-center mb-6">
                                <span className="text-4xl mb-4 block">🎯</span>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Rate This Password
                                </h3>
                                <p className="text-gray-400">
                                    Challenge {challengeIndex + 1} of {CHALLENGES.length}
                                </p>
                            </div>

                            {/* Password to Rate */}
                            <div className="p-6 bg-cyber-dark rounded-lg text-center mb-6">
                                <p className="font-mono text-2xl text-cyber-primary">
                                    {CHALLENGES[challengeIndex].password}
                                </p>
                            </div>

                            {/* Rating Buttons */}
                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {[0, 1, 2, 3, 4].map((score) => (
                                    <button
                                        key={score}
                                        onClick={() => handleChallengeAnswer(score)}
                                        className="p-4 rounded-lg border-2 border-gray-700 hover:border-cyber-primary transition-all"
                                        style={{ backgroundColor: `${getStrengthColor(score)}22` }}
                                    >
                                        <span className="block text-lg mb-1">{score + 1}</span>
                                        <span className="text-xs" style={{ color: getStrengthColor(score) }}>
                                            {getStrengthLabel(score)}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-xs text-gray-500">
                                Click to rate how strong you think this password is
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Level Complete */}
            {showComplete && (
                <LevelComplete
                    levelId={2}
                    levelName="Password Builder"
                    score={Math.min(100, Math.round(
                        (builtPasswords[0]?.strength || 0) * 20 +
                        (challengeAnswers.filter(a => a.correct).length / CHALLENGES.length) * 60
                    ))}
                    risksAvoided={[
                        builtPasswords.some(p => p.strength >= 3) && 'Created a strong password',
                        challengeAnswers.filter(a => a.correct).length > 2 && 'Good judgment on password strength'
                    ].filter(Boolean)}
                    mistakes={challengeAnswers.filter(a => !a.correct).map(a =>
                        `Misjudged "${a.password}" - was actually ${getStrengthLabel(a.actualStrength)}`
                    )}
                    learningPoints={[
                        'Password length is more important than complexity - 16+ characters recommended',
                        'Passphrases (multiple random words) are both strong and memorable',
                        'Avoid personal info, common words, and predictable patterns'
                    ]}
                    timeSpent={Math.round((Date.now() - startTime) / 1000)}
                    onReplay={() => {
                        setPhase('intro');
                        setPassword('');
                        setStrength(null);
                        setBuildMethod(null);
                        setChallengeIndex(0);
                        setChallengeAnswers([]);
                        setBuiltPasswords([]);
                        setShowComplete(false);
                    }}
                    onNextLevel={() => navigate('/levels/3')}
                />
            )}
        </div>
    );
}
