import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import LevelComplete from '../components/LevelComplete';

/**
 * Level 3 - Cyber Rush
 * 30-second timed challenge with quick decisions
 */

// Challenge types and data
const CHALLENGES = [
    // Password challenges
    {
        type: 'password',
        question: 'Which password is SAFEST?',
        options: [
            { text: 'Password123!', correct: false },
            { text: 'Tr0ub4dor&3', correct: false },
            { text: 'purple-monkey-dishwasher-42', correct: true },
            { text: 'admin2024', correct: false }
        ],
        explanation: 'Long passphrases are strongest and easiest to remember'
    },
    {
        type: 'password',
        question: 'Which password should you AVOID?',
        options: [
            { text: 'J@ck$on2005', correct: true },
            { text: 'Quantum-Flux-99!', correct: false },
            { text: 'tiger.castle.moon.7', correct: false },
            { text: 'xK9#mP2$vL5@', correct: false }
        ],
        explanation: 'Avoid passwords with personal info like names or birth years'
    },
    // Friend request challenges
    {
        type: 'social',
        question: 'A stranger sends you a friend request with "Hey! Remember me from summer camp?" You never went to summer camp. What do you do?',
        options: [
            { text: 'Accept - they might know you', correct: false },
            { text: 'Reject - this is suspicious', correct: true },
            { text: 'Ask friends if they know them', correct: false },
            { text: 'Accept and ask who they are', correct: false }
        ],
        explanation: 'Scammers create fake shared memories to gain trust'
    },
    {
        type: 'social',
        question: 'Profile: 2 friends in common, account created yesterday, no photos. Accept request?',
        options: [
            { text: 'Yes, 2 mutual friends', correct: false },
            { text: 'No, account is too new', correct: true }
        ],
        explanation: 'New accounts with few details are often fake'
    },
    // Scam message challenges
    {
        type: 'scam',
        question: '"You won a $500 gift card! Click here to claim: bit.ly/fr33g1ft"',
        options: [
            { text: '🎉 CLAIM PRIZE', correct: false },
            { text: '🚫 SCAM - Ignore', correct: true }
        ],
        explanation: 'Random prize messages are always scams'
    },
    {
        type: 'scam',
        question: '"Your Netflix account is suspended! Update payment: netfl1x-secure.com"',
        options: [
            { text: '💳 Update Payment', correct: false },
            { text: '🚫 SCAM - Ignore', correct: true }
        ],
        explanation: 'Check URLs carefully - this is not netflix.com'
    },
    {
        type: 'scam',
        question: '"Hi! This is your teacher. Send me your homework to this email: mrsmith.homework@gmail.com"',
        options: [
            { text: '📧 Send Homework', correct: false },
            { text: '❓ Verify in person first', correct: true }
        ],
        explanation: 'Always verify unusual requests through official channels'
    },
    // Phishing challenges
    {
        type: 'phishing',
        question: 'Which URL is REAL for Instagram?',
        options: [
            { text: 'instagram.login-page.com', correct: false },
            { text: 'www.instagram.com', correct: true },
            { text: 'lnstagram.com', correct: false },
            { text: 'instagram.account-verify.net', correct: false }
        ],
        explanation: 'Only trust the official domain'
    },
    // Quick thinking
    {
        type: 'quick',
        question: 'Someone asks for your password to "fix your account". You should:',
        options: [
            { text: 'Give it - they\'re helping', correct: false },
            { text: 'Never share passwords', correct: true }
        ],
        explanation: 'Legitimate services NEVER ask for your password'
    },
    {
        type: 'quick',
        question: 'You get an email saying "Your bank account will be closed in 24 hours!" You should:',
        options: [
            { text: 'Click the link immediately', correct: false },
            { text: 'Call your bank directly', correct: true }
        ],
        explanation: 'Scammers create urgency. Always verify through official channels'
    }
];

const GAME_DURATION = 30; // seconds
const BONUS_TIME_PER_CORRECT = 2; // bonus seconds for correct answers

export default function Level3CyberRush() {
    const navigate = useNavigate();
    const { saveProgress } = useGame();

    const [gameState, setGameState] = useState('ready'); // ready, playing, complete
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [challengeQueue, setChallengeQueue] = useState([]);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showFeedback, setShowFeedback] = useState(null);
    const [answers, setAnswers] = useState([]);
    const startTimeRef = useRef(null);
    const timerRef = useRef(null);

    // Shuffle and prepare challenges
    const prepareGame = useCallback(() => {
        const shuffled = [...CHALLENGES].sort(() => Math.random() - 0.5);
        setChallengeQueue(shuffled);
        setCurrentChallenge(shuffled[0]);
    }, []);

    // Start the game
    const startGame = () => {
        setGameState('playing');
        setTimeLeft(GAME_DURATION);
        setScore(0);
        setStreak(0);
        setMultiplier(1);
        setAnsweredCount(0);
        setCorrectCount(0);
        setAnswers([]);
        prepareGame();
        startTimeRef.current = Date.now();
    };

    // Timer logic
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(t => Math.max(0, t - 0.1));
            }, 100);
        } else if (timeLeft <= 0 && gameState === 'playing') {
            handleGameEnd();
        }

        return () => clearTimeout(timerRef.current);
    }, [gameState, timeLeft]);

    // Handle answer
    const handleAnswer = (option) => {
        if (showFeedback) return;

        const isCorrect = option.correct;

        // Calculate points
        let points = 0;
        if (isCorrect) {
            points = 100 * multiplier;
            setStreak(s => s + 1);
            if ((streak + 1) % 3 === 0) {
                setMultiplier(m => Math.min(4, m + 0.5));
            }
            setCorrectCount(c => c + 1);
            setTimeLeft(t => Math.min(GAME_DURATION, t + BONUS_TIME_PER_CORRECT));
        } else {
            setStreak(0);
            setMultiplier(1);
        }

        setScore(s => s + points);
        setAnsweredCount(c => c + 1);
        setAnswers([...answers, {
            challenge: currentChallenge,
            selected: option,
            correct: isCorrect
        }]);

        // Show feedback briefly
        setShowFeedback({
            correct: isCorrect,
            explanation: currentChallenge.explanation,
            points
        });

        // Move to next challenge after short delay
        setTimeout(() => {
            setShowFeedback(null);
            const nextIndex = (challengeQueue.indexOf(currentChallenge) + 1) % challengeQueue.length;
            setCurrentChallenge(challengeQueue[nextIndex]);
        }, 800);
    };

    // End game
    const handleGameEnd = async () => {
        setGameState('complete');

        const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
        const finalScore = Math.round((correctCount / Math.max(1, answeredCount)) * 100);

        const risksAvoided = answers
            .filter(a => a.correct)
            .map(a => `Quickly identified: ${a.challenge.type} threat`);

        const mistakes = answers
            .filter(a => !a.correct)
            .map(a => `Missed ${a.challenge.type}: ${a.challenge.question.substring(0, 50)}...`);

        const learningPoints = [
            'Quick decisions are often needed online - trust your instincts',
            'If something feels wrong, it probably is - slow down',
            'Scammers create urgency to prevent you from thinking clearly'
        ];

        await saveProgress({
            levelId: 3,
            levelName: 'Cyber Rush',
            score: finalScore,
            mistakes,
            risksAvoided,
            learningPoints,
            timeSpent,
            completed: true
        });
    };

    // Get challenge type icon
    const getChallengeIcon = (type) => {
        const icons = {
            password: '🔐',
            social: '👥',
            scam: '💰',
            phishing: '🎣',
            quick: '⚡'
        };
        return icons[type] || '❓';
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Ready State */}
                {gameState === 'ready' && (
                    <motion.div
                        className="cyber-card text-center py-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <motion.div
                            className="text-8xl mb-6"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            ⚡
                        </motion.div>
                        <h1 className="font-cyber text-4xl font-bold text-cyber-accent mb-4">
                            CYBER RUSH
                        </h1>
                        <p className="text-xl text-gray-300 mb-2">
                            30 Seconds. Quick Decisions. Maximum Points.
                        </p>
                        <p className="text-gray-500 mb-8">
                            Answer cybersecurity challenges as fast as you can!
                        </p>

                        <div className="flex justify-center gap-8 mb-8">
                            <div className="text-center">
                                <span className="text-3xl block mb-2">⏱️</span>
                                <span className="text-sm text-gray-400">30 seconds</span>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl block mb-2">🔥</span>
                                <span className="text-sm text-gray-400">Build streaks</span>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl block mb-2">✨</span>
                                <span className="text-sm text-gray-400">Earn multipliers</span>
                            </div>
                        </div>

                        <button
                            onClick={startGame}
                            className="cyber-btn text-xl px-12 py-5 animate-pulse-glow"
                        >
                            START RUSH!
                        </button>
                    </motion.div>
                )}

                {/* Playing State */}
                {gameState === 'playing' && currentChallenge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* HUD */}
                        <div className="flex items-center justify-between mb-6">
                            {/* Timer */}
                            <div className="flex items-center gap-2">
                                <span className={`text-4xl font-cyber font-bold ${timeLeft < 10 ? 'text-cyber-danger animate-pulse' : 'text-cyber-primary'
                                    }`}>
                                    {timeLeft.toFixed(1)}s
                                </span>
                            </div>

                            {/* Score & Multiplier */}
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <span className="text-2xl font-cyber font-bold text-cyber-accent">{score}</span>
                                    <span className="text-xs text-gray-500 block">POINTS</span>
                                </div>
                                {multiplier > 1 && (
                                    <motion.div
                                        className="px-4 py-2 bg-cyber-accent/20 border border-cyber-accent rounded-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <span className="text-cyber-accent font-bold">{multiplier}x</span>
                                    </motion.div>
                                )}
                                {streak >= 3 && (
                                    <motion.div
                                        className="flex items-center gap-1 text-cyber-danger"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <span>🔥</span>
                                        <span className="font-bold">{streak}</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Timer Bar */}
                        <div className="h-2 bg-cyber-dark rounded-full mb-6 overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyber-primary to-cyber-accent"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Challenge Card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentChallenge.question}
                                className="cyber-card relative overflow-hidden"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Challenge Type Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="text-2xl">{getChallengeIcon(currentChallenge.type)}</span>
                                </div>

                                {/* Question */}
                                <div className="mb-6">
                                    <p className="text-xl text-white font-medium">
                                        {currentChallenge.question}
                                    </p>
                                </div>

                                {/* Options */}
                                <div className={`grid gap-3 ${currentChallenge.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
                                    }`}>
                                    {currentChallenge.options.map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => handleAnswer(option)}
                                            disabled={showFeedback !== null}
                                            className={`p-4 rounded-lg border-2 text-left transition-all ${showFeedback
                                                    ? option.correct
                                                        ? 'border-cyber-success bg-cyber-success/20'
                                                        : 'border-gray-700 opacity-50'
                                                    : 'border-gray-700 hover:border-cyber-primary hover:bg-cyber-primary/10'
                                                }`}
                                            whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                                            whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                                        >
                                            <span className="text-white">{option.text}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Feedback Overlay */}
                                <AnimatePresence>
                                    {showFeedback && (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{
                                                background: showFeedback.correct
                                                    ? 'rgba(16, 185, 129, 0.9)'
                                                    : 'rgba(239, 68, 68, 0.9)'
                                            }}
                                        >
                                            <div className="text-center text-white">
                                                <span className="text-5xl block mb-2">
                                                    {showFeedback.correct ? '✓' : '✗'}
                                                </span>
                                                {showFeedback.points > 0 && (
                                                    <span className="text-2xl font-cyber">+{showFeedback.points}</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Complete State */}
                {gameState === 'complete' && (
                    <LevelComplete
                        levelId={3}
                        levelName="Cyber Rush"
                        score={Math.round((correctCount / Math.max(1, answeredCount)) * 100)}
                        risksAvoided={answers.filter(a => a.correct).slice(0, 3).map(a =>
                            `Quick decision: ${a.challenge.type}`
                        )}
                        mistakes={answers.filter(a => !a.correct).slice(0, 3).map(a =>
                            `Missed: ${a.challenge.question.substring(0, 40)}...`
                        )}
                        learningPoints={[
                            'Quick decisions are often needed online - trust your instincts',
                            'If something feels wrong, it probably is - slow down',
                            'Scammers create urgency to prevent you from thinking clearly'
                        ]}
                        timeSpent={Math.round((Date.now() - startTimeRef.current) / 1000)}
                        newBadges={[]}
                        onReplay={() => setGameState('ready')}
                        onNextLevel={() => navigate('/levels/4')}
                    />
                )}
            </div>
        </div>
    );
}
