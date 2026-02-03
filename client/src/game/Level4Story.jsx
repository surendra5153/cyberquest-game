import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import LevelComplete from '../components/LevelComplete';

/**
 * Level 4 - Story Mode: Digital Dilemma
 * Interactive story about cyberbullying and online safety
 */

// Story scenes data
const STORY = {
    id: 'digital_dilemma',
    title: 'Digital Dilemma',
    character: {
        name: 'Maya',
        avatar: '👩‍🎓',
        age: 15,
        description: 'High school student, new to social media'
    },
    scenes: [
        {
            id: 'intro',
            background: 'school',
            dialogue: [
                { speaker: 'narrator', text: 'Maya just got her first smartphone and created social media accounts. She\'s excited to connect with friends...' },
                { speaker: 'Maya', text: 'Finally! I can\'t wait to share photos and chat with everyone!' }
            ],
            nextScene: 'first_post'
        },
        {
            id: 'first_post',
            background: 'bedroom',
            dialogue: [
                { speaker: 'narrator', text: 'Maya posts a selfie from her bedroom. She gets lots of likes!' },
                { speaker: 'Maya', text: 'Wow, 50 likes already! This is so fun!' },
                { speaker: 'notification', text: '📱 New message from unknown user: "Hey! Cute pic. What school do you go to?"' }
            ],
            choices: [
                {
                    text: 'Reply with school name and details',
                    outcome: 'bad',
                    consequence: 'sharing_info',
                    feedback: 'Sharing personal details with strangers is dangerous!'
                },
                {
                    text: 'Ignore the message - they\'re a stranger',
                    outcome: 'good',
                    consequence: 'safe_choice',
                    feedback: 'Smart! Never share personal info with strangers online.'
                },
                {
                    text: 'Block the unknown user',
                    outcome: 'best',
                    consequence: 'blocked',
                    feedback: 'Excellent! Blocking unknown accounts is the safest option.'
                }
            ],
            nextScene: 'group_chat'
        },
        {
            id: 'group_chat',
            background: 'phone',
            dialogue: [
                { speaker: 'narrator', text: 'A few weeks later, Maya is added to a class group chat...' },
                { speaker: 'classmate', text: 'Did you guys see what Emma wore today? 😂' },
                { speaker: 'classmate2', text: 'OMG yes! So embarrassing. Someone should post that photo...' },
                { speaker: 'Maya', text: '(thinking) That doesn\'t seem right... Emma would be really hurt.' }
            ],
            choices: [
                {
                    text: 'Stay quiet - it\'s not my problem',
                    outcome: 'bad',
                    consequence: 'bystander',
                    feedback: 'Being silent makes you part of the problem. Bullying thrives when bystanders do nothing.'
                },
                {
                    text: 'Defend Emma: "That\'s cyberbullying. Not cool."',
                    outcome: 'best',
                    consequence: 'stood_up',
                    feedback: 'Brave choice! Standing up against cyberbullying can stop it from escalating.'
                },
                {
                    text: 'Leave the group chat',
                    outcome: 'okay',
                    consequence: 'left_group',
                    feedback: 'Leaving removes you from the situation, but doesn\'t help Emma.'
                }
            ],
            nextScene: 'scam_message'
        },
        {
            id: 'scam_message',
            background: 'phone',
            dialogue: [
                { speaker: 'narrator', text: 'One day, Maya receives an exciting DM...' },
                { speaker: 'dm', text: '🎉 "Congratulations! You\'ve been selected for a $500 gift card giveaway! Click here to claim: bit.ly/fr33stuff"' },
                { speaker: 'Maya', text: 'Whoa! $500?! That would be amazing...' }
            ],
            choices: [
                {
                    text: 'Click the link immediately!',
                    outcome: 'bad',
                    consequence: 'clicked_scam',
                    feedback: 'This is a scam! Random prize messages are always fake and can steal your info.'
                },
                {
                    text: 'Research - seems too good to be true',
                    outcome: 'best',
                    consequence: 'researched',
                    feedback: 'Great instinct! "Too good to be true" offers are almost always scams.'
                },
                {
                    text: 'Ask a parent or teacher about it',
                    outcome: 'good',
                    consequence: 'asked_adult',
                    feedback: 'Smart! When in doubt, asking a trusted adult is always a good choice.'
                }
            ],
            nextScene: 'password_incident'
        },
        {
            id: 'password_incident',
            background: 'school',
            dialogue: [
                { speaker: 'narrator', text: 'At school, Maya\'s friend asks for a favor...' },
                { speaker: 'Friend', text: 'Hey Maya, can I borrow your phone? I need to check something real quick.' },
                { speaker: 'Maya', text: 'Sure, but...' },
                { speaker: 'Friend', text: 'Actually, can you just tell me your Instagram password? I want to prank someone from your account. It\'ll be funny!' }
            ],
            choices: [
                {
                    text: 'Share password - they\'re my friend!',
                    outcome: 'bad',
                    consequence: 'shared_password',
                    feedback: 'Never share passwords, even with friends. Accounts can be misused or compromised.'
                },
                {
                    text: '"No way. My password is private."',
                    outcome: 'best',
                    consequence: 'protected_password',
                    feedback: 'Perfect! Passwords should never be shared with anyone - not even close friends.'
                },
                {
                    text: 'Make an excuse and say no',
                    outcome: 'good',
                    consequence: 'avoided',
                    feedback: 'Good choice to say no, though being direct about password safety is even better.'
                }
            ],
            nextScene: 'ending'
        },
        {
            id: 'ending',
            background: 'sunset',
            dialogue: [
                { speaker: 'narrator', text: 'Maya has learned important lessons about staying safe online...' },
                { speaker: 'Maya', text: 'Being online is fun, but I need to be smart about it. Privacy matters, and I should always trust my instincts!' }
            ],
            isEnding: true
        }
    ]
};

export default function Level4Story() {
    const navigate = useNavigate();
    const { saveProgress } = useGame();

    const [currentSceneId, setCurrentSceneId] = useState('intro');
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [choices, setChoices] = useState([]);
    const [showChoice, setShowChoice] = useState(false);
    const [choiceFeedback, setChoiceFeedback] = useState(null);
    const [showComplete, setShowComplete] = useState(false);
    const [startTime] = useState(Date.now());

    const currentScene = STORY.scenes.find(s => s.id === currentSceneId);
    const currentDialogue = currentScene?.dialogue[dialogueIndex];

    // Get background gradient
    const getBackground = (bg) => {
        const backgrounds = {
            school: 'linear-gradient(135deg, #1e3a5f, #0a1929)',
            bedroom: 'linear-gradient(135deg, #2d1f47, #1a0f2e)',
            phone: 'linear-gradient(135deg, #1a1a2e, #0a0a0f)',
            sunset: 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)'
        };
        return backgrounds[bg] || backgrounds.phone;
    };

    // Handle dialogue advancement
    const advanceDialogue = () => {
        if (dialogueIndex < currentScene.dialogue.length - 1) {
            setDialogueIndex(dialogueIndex + 1);
        } else if (currentScene.choices) {
            setShowChoice(true);
        } else if (currentScene.isEnding) {
            handleComplete();
        } else if (currentScene.nextScene) {
            moveToScene(currentScene.nextScene);
        }
    };

    // Move to next scene
    const moveToScene = (sceneId) => {
        setCurrentSceneId(sceneId);
        setDialogueIndex(0);
        setShowChoice(false);
        setChoiceFeedback(null);
    };

    // Handle choice selection
    const handleChoice = (choice) => {
        setChoices([...choices, {
            sceneId: currentSceneId,
            choice: choice.text,
            outcome: choice.outcome
        }]);

        setChoiceFeedback({
            text: choice.feedback,
            outcome: choice.outcome
        });
    };

    // Continue after feedback
    const continueAfterFeedback = () => {
        if (currentScene.nextScene) {
            moveToScene(currentScene.nextScene);
        } else if (currentScene.isEnding) {
            handleComplete();
        }
    };

    // Complete the level
    const handleComplete = async () => {
        const outcomes = choices.map(c => c.outcome);
        const bestChoices = outcomes.filter(o => o === 'best').length;
        const goodChoices = outcomes.filter(o => o === 'good').length;
        const badChoices = outcomes.filter(o => o === 'bad').length;

        const score = Math.round(
            ((bestChoices * 100 + goodChoices * 75 + (choices.length - bestChoices - goodChoices - badChoices) * 50) /
                (choices.length || 1))
        );

        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        const risksAvoided = choices
            .filter(c => c.outcome === 'best' || c.outcome === 'good')
            .map(c => `Made safe choice: ${c.choice.substring(0, 30)}...`);

        const mistakes = choices
            .filter(c => c.outcome === 'bad')
            .map(c => `Risky choice: ${c.choice.substring(0, 30)}...`);

        const learningPoints = [
            'Never share personal information or passwords with strangers or friends',
            'Stand up against cyberbullying - your voice matters',
            'If something seems too good to be true, it probably is a scam'
        ];

        await saveProgress({
            levelId: 4,
            levelName: 'Story: Digital Dilemma',
            score,
            mistakes,
            risksAvoided,
            learningPoints,
            timeSpent,
            completed: true
        });

        setShowComplete(true);
    };

    // Get speaker style
    const getSpeakerStyle = (speaker) => {
        const styles = {
            narrator: { color: '#94a3b8', italic: true },
            Maya: { color: '#f472b6', name: '👩‍🎓 Maya' },
            classmate: { color: '#60a5fa', name: '🧑 Classmate' },
            classmate2: { color: '#34d399', name: '👧 Classmate' },
            notification: { color: '#fbbf24', name: '📱 Notification' },
            dm: { color: '#f87171', name: '📩 DM' },
            Friend: { color: '#a78bfa', name: '🤝 Friend' }
        };
        return styles[speaker] || { color: '#e2e8f0', name: speaker };
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Level Header */}
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-2xl font-bold text-white mb-1">
                        Level 4: <span className="text-cyber-secondary">Digital Dilemma</span>
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Help Maya navigate online challenges
                    </p>
                </motion.div>

                {/* Story Card */}
                <motion.div
                    className="cyber-card min-h-[400px] flex flex-col"
                    style={{ background: getBackground(currentScene?.background) }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Character Avatar & Scene */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-black/30 rounded-lg">
                        <span className="text-5xl">{STORY.character.avatar}</span>
                        <div>
                            <h3 className="font-semibold text-white">{STORY.character.name}</h3>
                            <p className="text-sm text-gray-400">Age {STORY.character.age}</p>
                        </div>
                    </div>

                    {/* Dialogue Box */}
                    <div className="flex-1 flex flex-col justify-end">
                        <AnimatePresence mode="wait">
                            {!choiceFeedback ? (
                                <motion.div
                                    key={`${currentSceneId}-${dialogueIndex}`}
                                    className="p-6 bg-cyber-darker/90 rounded-lg backdrop-blur-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {/* Speaker */}
                                    {currentDialogue && (
                                        <>
                                            <div
                                                className="text-sm font-semibold mb-2"
                                                style={{ color: getSpeakerStyle(currentDialogue.speaker).color }}
                                            >
                                                {getSpeakerStyle(currentDialogue.speaker).name || 'Narrator'}
                                            </div>

                                            {/* Text */}
                                            <p
                                                className={`text-lg ${currentDialogue.speaker === 'narrator' ? 'italic text-gray-400' : 'text-white'}`}
                                            >
                                                {currentDialogue.text}
                                            </p>
                                        </>
                                    )}

                                    {/* Continue or Choices */}
                                    {!showChoice ? (
                                        <button
                                            onClick={advanceDialogue}
                                            className="mt-4 text-cyber-primary hover:underline text-sm"
                                        >
                                            Continue ▶
                                        </button>
                                    ) : (
                                        <div className="mt-6 space-y-3">
                                            <p className="text-sm text-gray-400 mb-4">What should Maya do?</p>
                                            {currentScene.choices.map((choice, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    onClick={() => handleChoice(choice)}
                                                    className="w-full p-4 text-left rounded-lg border-2 border-gray-600 hover:border-cyber-secondary bg-cyber-dark/50 transition-all"
                                                    whileHover={{ scale: 1.02, borderColor: '#8b5cf6' }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="text-white">{choice.text}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                /* Feedback */
                                <motion.div
                                    key="feedback"
                                    className={`p-6 rounded-lg ${choiceFeedback.outcome === 'best' ? 'bg-cyber-success/30 border border-cyber-success' :
                                            choiceFeedback.outcome === 'good' ? 'bg-cyber-primary/30 border border-cyber-primary' :
                                                choiceFeedback.outcome === 'okay' ? 'bg-cyber-accent/30 border border-cyber-accent' :
                                                    'bg-cyber-danger/30 border border-cyber-danger'
                                        }`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-4xl">
                                            {choiceFeedback.outcome === 'best' ? '⭐' :
                                                choiceFeedback.outcome === 'good' ? '✓' :
                                                    choiceFeedback.outcome === 'okay' ? '🤔' : '⚠️'}
                                        </span>
                                        <div>
                                            <h4 className={`font-bold mb-2 ${choiceFeedback.outcome === 'best' ? 'text-cyber-success' :
                                                    choiceFeedback.outcome === 'good' ? 'text-cyber-primary' :
                                                        choiceFeedback.outcome === 'okay' ? 'text-cyber-accent' :
                                                            'text-cyber-danger'
                                                }`}>
                                                {choiceFeedback.outcome === 'best' ? 'Excellent Choice!' :
                                                    choiceFeedback.outcome === 'good' ? 'Good Choice!' :
                                                        choiceFeedback.outcome === 'okay' ? 'Okay Choice' :
                                                            'Risky Choice!'}
                                            </h4>
                                            <p className="text-white">{choiceFeedback.text}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={continueAfterFeedback}
                                        className="mt-4 cyber-btn py-2 px-6"
                                    >
                                        Continue Story →
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Progress Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                    {STORY.scenes.filter(s => !s.isEnding).map((scene, idx) => (
                        <div
                            key={scene.id}
                            className={`w-3 h-3 rounded-full transition-all ${scene.id === currentSceneId ? 'bg-cyber-secondary scale-125' :
                                    STORY.scenes.findIndex(s => s.id === currentSceneId) > idx ? 'bg-cyber-success' :
                                        'bg-gray-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Level Complete */}
            {showComplete && (
                <LevelComplete
                    levelId={4}
                    levelName="Story: Digital Dilemma"
                    score={Math.round(
                        (choices.filter(c => c.outcome === 'best' || c.outcome === 'good').length /
                            Math.max(1, choices.length)) * 100
                    )}
                    risksAvoided={choices.filter(c => c.outcome === 'best').map(c =>
                        `Great choice: ${c.choice.substring(0, 30)}...`
                    )}
                    mistakes={choices.filter(c => c.outcome === 'bad').map(c =>
                        `Risky: ${c.choice.substring(0, 30)}...`
                    )}
                    learningPoints={[
                        'Never share personal information or passwords with strangers or friends',
                        'Stand up against cyberbullying - your voice matters',
                        'If something seems too good to be true, it probably is a scam'
                    ]}
                    timeSpent={Math.round((Date.now() - startTime) / 1000)}
                    onReplay={() => {
                        setCurrentSceneId('intro');
                        setDialogueIndex(0);
                        setChoices([]);
                        setShowChoice(false);
                        setChoiceFeedback(null);
                        setShowComplete(false);
                    }}
                    onNextLevel={() => navigate('/dashboard')}
                />
            )}
        </div>
    );
}
