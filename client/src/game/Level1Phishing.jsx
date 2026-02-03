import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import LevelComplete from '../components/LevelComplete';

/**
 * Level 1 - Phishing Detection
 * Students identify real vs fake login pages
 */

// Phishing scenarios data
const SCENARIOS = [
    {
        id: 1,
        type: 'login_page',
        title: 'Bank Login Page',
        isPhishing: true,
        url: 'https://secure-bankofamerica.login-verify.com/signin',
        realUrl: 'https://www.bankofamerica.com/signin',
        indicators: [
            { type: 'url', text: 'Suspicious domain: "login-verify.com" is not the real bank domain', found: false },
            { type: 'subdomain', text: 'Fake subdomain trying to look legitimate', found: false },
            { type: 'urgency', text: 'Creates false sense of urgency', found: false }
        ],
        image: 'bank',
        content: {
            logo: '🏦',
            title: 'Bank of America',
            subtitle: 'URGENT: Verify your account immediately to avoid suspension!',
            hasHttps: true,
            hasLock: true
        }
    },
    {
        id: 2,
        type: 'login_page',
        title: 'Social Media Login',
        isPhishing: false,
        url: 'https://www.instagram.com/accounts/login/',
        indicators: [],
        image: 'instagram',
        content: {
            logo: '📷',
            title: 'Instagram',
            subtitle: 'Log in to see photos and videos from friends',
            hasHttps: true,
            hasLock: true
        }
    },
    {
        id: 3,
        type: 'login_page',
        title: 'Email Login',
        isPhishing: true,
        url: 'https://google.com.account-verify.net/mail/login',
        realUrl: 'https://accounts.google.com/signin',
        indicators: [
            { type: 'url', text: 'Domain is "account-verify.net", not google.com', found: false },
            { type: 'trick', text: '"google.com" is just a subdomain trick', found: false }
        ],
        image: 'gmail',
        content: {
            logo: '📧',
            title: 'Google',
            subtitle: 'Sign in to continue to Gmail',
            hasHttps: true,
            hasLock: true,
            extraButton: 'Verify Now - Account at Risk!'
        }
    },
    {
        id: 4,
        type: 'login_page',
        title: 'Streaming Service',
        isPhishing: true,
        url: 'http://netflix.com.free-movies.xyz/login',
        realUrl: 'https://www.netflix.com/login',
        indicators: [
            { type: 'http', text: 'No HTTPS - connection is not secure', found: false },
            { type: 'url', text: 'Fake domain "free-movies.xyz"', found: false },
            { type: 'offer', text: 'Too good to be true offers', found: false }
        ],
        image: 'netflix',
        content: {
            logo: '🎬',
            title: 'Netflix',
            subtitle: 'FREE Premium Access! Login now to claim!',
            hasHttps: false,
            hasLock: false
        }
    },
    {
        id: 5,
        type: 'login_page',
        title: 'School Portal',
        isPhishing: false,
        url: 'https://portal.school.edu/login',
        indicators: [],
        image: 'school',
        content: {
            logo: '🏫',
            title: 'Student Portal',
            subtitle: 'Enter your school credentials to access resources',
            hasHttps: true,
            hasLock: true
        }
    }
];

export default function Level1Phishing() {
    const navigate = useNavigate();
    const { saveProgress } = useGame();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showComplete, setShowComplete] = useState(false);
    const [startTime] = useState(Date.now());

    const currentScenario = SCENARIOS[currentIndex];
    const isLastScenario = currentIndex === SCENARIOS.length - 1;

    // Handle answer selection
    const handleAnswer = (isPhishing) => {
        setSelectedAnswer(isPhishing);
        setShowFeedback(true);

        const isCorrect = isPhishing === currentScenario.isPhishing;
        setAnswers([...answers, {
            scenarioId: currentScenario.id,
            correct: isCorrect,
            scenario: currentScenario
        }]);
    };

    // Move to next scenario
    const handleNext = () => {
        setShowFeedback(false);
        setSelectedAnswer(null);

        if (isLastScenario) {
            handleComplete();
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Complete the level
    const handleComplete = async () => {
        const correctAnswers = answers.filter(a => a.correct).length +
            (selectedAnswer === currentScenario.isPhishing ? 1 : 0);
        const totalQuestions = SCENARIOS.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        // Calculate risks avoided and mistakes
        const risksAvoided = [];
        const mistakes = [];

        answers.concat([{
            scenarioId: currentScenario.id,
            correct: selectedAnswer === currentScenario.isPhishing,
            scenario: currentScenario
        }]).forEach(answer => {
            if (answer.correct && answer.scenario.isPhishing) {
                risksAvoided.push(`Identified phishing attempt: ${answer.scenario.title}`);
            } else if (!answer.correct) {
                if (answer.scenario.isPhishing) {
                    mistakes.push(`Missed phishing attempt: ${answer.scenario.title}`);
                } else {
                    mistakes.push(`Incorrectly flagged legitimate site: ${answer.scenario.title}`);
                }
            }
        });

        const learningPoints = [
            'Always check the URL carefully - look for misspellings and fake domains',
            'HTTPS and lock icons can be faked - domain is more important',
            'Be suspicious of urgent messages and too-good-to-be-true offers'
        ];

        await saveProgress({
            levelId: 1,
            levelName: 'Phishing Detection',
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
            <div className="max-w-4xl mx-auto">
                {/* Level Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-3xl font-bold text-white mb-2">
                        Level 1: <span className="text-cyber-primary">Phishing Detection</span>
                    </h1>
                    <p className="text-gray-400">
                        Can you spot the fake login pages?
                    </p>

                    {/* Progress */}
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {SCENARIOS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-3 h-3 rounded-full transition-all ${idx < currentIndex ? 'bg-cyber-success' :
                                        idx === currentIndex ? 'bg-cyber-primary animate-pulse' :
                                            'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Scenario Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentScenario.id}
                        className="cyber-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                    >
                        {/* URL Bar */}
                        <div className="mb-6 p-3 bg-cyber-dark rounded-lg border border-gray-700">
                            <div className="flex items-center gap-2">
                                {currentScenario.content.hasLock ? (
                                    <span className="text-cyber-success">🔒</span>
                                ) : (
                                    <span className="text-cyber-danger">⚠️</span>
                                )}
                                <span className={`text-sm font-mono flex-1 ${currentScenario.isPhishing ? 'text-gray-300' : 'text-cyber-success'
                                    }`}>
                                    {currentScenario.url}
                                </span>
                            </div>
                        </div>

                        {/* Login Page Preview */}
                        <div className="bg-white rounded-lg p-8 mb-6 text-center">
                            <div className="text-6xl mb-4">{currentScenario.content.logo}</div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {currentScenario.content.title}
                            </h2>
                            <p className="text-gray-600 mb-6">{currentScenario.content.subtitle}</p>

                            {/* Fake login form */}
                            <div className="max-w-sm mx-auto space-y-3">
                                <input
                                    type="text"
                                    placeholder="Email or username"
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    disabled
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    disabled
                                />
                                <button className="w-full p-3 bg-blue-600 text-white rounded-lg">
                                    Sign In
                                </button>
                                {currentScenario.content.extraButton && (
                                    <button className="w-full p-3 bg-red-600 text-white rounded-lg animate-pulse">
                                        {currentScenario.content.extraButton}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Question */}
                        {!showFeedback ? (
                            <div className="text-center">
                                <h3 className="text-xl font-semibold text-white mb-6">
                                    Is this a phishing attempt?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => handleAnswer(true)}
                                        className="cyber-btn-secondary px-8 py-4 bg-cyber-danger/20 border-cyber-danger text-cyber-danger hover:bg-cyber-danger hover:text-white"
                                    >
                                        🚨 PHISHING!
                                    </button>
                                    <button
                                        onClick={() => handleAnswer(false)}
                                        className="cyber-btn px-8 py-4 bg-cyber-success/20 border-cyber-success text-cyber-success hover:bg-cyber-success hover:text-white"
                                    >
                                        ✓ LEGITIMATE
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                {/* Feedback */}
                                <div className={`p-6 rounded-lg mb-6 ${selectedAnswer === currentScenario.isPhishing
                                        ? 'bg-cyber-success/20 border border-cyber-success'
                                        : 'bg-cyber-danger/20 border border-cyber-danger'
                                    }`}>
                                    <span className="text-4xl mb-2 block">
                                        {selectedAnswer === currentScenario.isPhishing ? '✅' : '❌'}
                                    </span>
                                    <h4 className={`text-xl font-bold mb-2 ${selectedAnswer === currentScenario.isPhishing ? 'text-cyber-success' : 'text-cyber-danger'
                                        }`}>
                                        {selectedAnswer === currentScenario.isPhishing ? 'Correct!' : 'Incorrect!'}
                                    </h4>
                                    <p className="text-gray-300">
                                        This is {currentScenario.isPhishing ? 'a PHISHING attempt' : 'a LEGITIMATE site'}.
                                    </p>
                                </div>

                                {/* Explanation for phishing sites */}
                                {currentScenario.isPhishing && (
                                    <div className="text-left mb-6 p-4 bg-cyber-primary/10 rounded-lg">
                                        <h5 className="font-semibold text-cyber-primary mb-2">Red Flags:</h5>
                                        <ul className="space-y-2">
                                            {currentScenario.indicators.map((indicator, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="text-cyber-danger">⚠️</span>
                                                    {indicator.text}
                                                </li>
                                            ))}
                                        </ul>
                                        {currentScenario.realUrl && (
                                            <p className="mt-3 text-sm text-gray-400">
                                                Real URL: <span className="text-cyber-success">{currentScenario.realUrl}</span>
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button
                                    onClick={handleNext}
                                    className="cyber-btn px-8 py-4"
                                >
                                    {isLastScenario ? 'Complete Level' : 'Next →'}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Level Complete Modal */}
            {showComplete && (
                <LevelComplete
                    levelId={1}
                    levelName="Phishing Detection"
                    score={Math.round((answers.filter(a => a.correct).length + (selectedAnswer === currentScenario.isPhishing ? 1 : 0)) / SCENARIOS.length * 100)}
                    risksAvoided={answers.filter(a => a.correct && a.scenario.isPhishing).map(a => `Identified: ${a.scenario.title}`)}
                    mistakes={answers.filter(a => !a.correct).map(a => a.scenario.isPhishing ? `Missed: ${a.scenario.title}` : `False positive: ${a.scenario.title}`)}
                    learningPoints={[
                        'Always check the URL carefully - look for misspellings and fake domains',
                        'HTTPS and lock icons can be faked - domain is more important',
                        'Be suspicious of urgent messages and too-good-to-be-true offers'
                    ]}
                    timeSpent={Math.round((Date.now() - startTime) / 1000)}
                    onReplay={() => {
                        setCurrentIndex(0);
                        setAnswers([]);
                        setShowFeedback(false);
                        setSelectedAnswer(null);
                        setShowComplete(false);
                    }}
                    onNextLevel={() => navigate('/levels/2')}
                />
            )}
        </div>
    );
}
