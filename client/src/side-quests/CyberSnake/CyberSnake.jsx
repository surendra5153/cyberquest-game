import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameIntroTemplate from '../common/GameIntroTemplate';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const CyberSnake = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('INTRO'); // INTRO, PLAYING, OVER
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [token, setToken] = useState({ x: 5, y: 5 });
    const [malware, setMalware] = useState([]);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(150);

    // Intro Data
    const introData = {
        title: "Cyber Snake: Security Scanner",
        story: "You are an automated Security Scanner traversing the network. Your mission is to collect security tokens to strengthen your scan capability while avoiding malware nodes that can corrupt your process.",
        concept: "Security tokens help verify identity and prevent unauthorized access in a network.",
        objectives: [
            "Collect tokens (Security Tokens) to grow.",
            "Avoid malware nodes (Obstacles).",
            "Don't hit the wall or yourself."
        ],
        controls: "Arrow Keys / WASD to change direction."
    };

    const startGame = () => {
        setGameState('PLAYING');
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        setScore(0);
        setSpeed(150);
        setMalware([]);
        generateToken();
    };

    const generateToken = useCallback(() => {
        const newX = Math.floor(Math.random() * GRID_SIZE);
        const newY = Math.floor(Math.random() * GRID_SIZE);
        setToken({ x: newX, y: newY });
    }, []);

    const generateMalware = useCallback(() => {
        const newX = Math.floor(Math.random() * GRID_SIZE);
        const newY = Math.floor(Math.random() * GRID_SIZE);
        setMalware(prev => [...prev, { x: newX, y: newY }]);
    }, []);

    // Handle direction change
    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key.toLowerCase()) {
                case 'arrowup': case 'w': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
                case 'arrowdown': case 's': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
                case 'arrowleft': case 'a': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
                case 'arrowright': case 'd': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [direction]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const moveSnake = () => {
            setSnake(oldSnake => {
                const newHead = {
                    x: (oldSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
                    y: (oldSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
                };

                // Check collisions
                if (oldSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                    setGameState('OVER');
                    return oldSnake;
                }
                if (malware.some(m => m.x === newHead.x && m.y === newHead.y)) {
                    setGameState('OVER');
                    return oldSnake;
                }

                const newSnake = [newHead, ...oldSnake];

                // Check token
                if (newHead.x === token.x && newHead.y === token.y) {
                    setScore(s => s + 10);
                    setSpeed(s => Math.max(70, s - 2));
                    generateToken();
                    if (Math.random() > 0.7) generateMalware();
                } else {
                    newSnake.pop();
                }

                return newSnake;
            });
        };

        const interval = setInterval(moveSnake, speed);
        return () => clearInterval(interval);
    }, [gameState, direction, token, malware, speed, generateToken, generateMalware]);

    // Draw Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const box = canvas.width / GRID_SIZE;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Malware
        ctx.fillStyle = '#FF3B30';
        malware.forEach(m => ctx.fillRect(m.x * box, m.y * box, box - 2, box - 2));

        // Draw Token
        ctx.fillStyle = '#00F2FE';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00F2FE';
        ctx.fillRect(token.x * box, token.y * box, box - 2, box - 2);
        ctx.shadowBlur = 0;

        // Draw Snake
        ctx.fillStyle = '#10B981';
        snake.forEach((seg, i) => {
            if (i === 0) ctx.fillStyle = '#34D399'; // head
            else ctx.fillStyle = '#10B981';
            ctx.fillRect(seg.x * box, seg.y * box, box - 2, box - 2);
        });
    }, [snake, token, malware]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cyber-dark flex flex-col items-center">
            {gameState === 'INTRO' && (
                <GameIntroTemplate
                    {...introData}
                    onStart={startGame}
                    onSkip={() => setGameState('PLAYING')}
                />
            )}

            <div className="max-w-2xl w-full px-4">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/side-quests')} className="text-gray-400 hover:text-white">
                        ← Back to Menu
                    </button>
                    <div className="text-cyber-primary font-cyber text-2xl">
                        SCORE: {score}
                    </div>
                </div>

                <div className="relative aspect-square w-full bg-black/40 border-2 border-cyber-primary/20 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={600}
                        className="w-full h-full"
                    />

                    {gameState === 'OVER' && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                            <h2 className="text-cyber-danger font-cyber text-4xl font-bold mb-4">SYSTEM CORRUPTED</h2>
                            <p className="text-gray-300 mb-8 max-w-sm">
                                Your scan was interrupted by malware. Final coverage: <span className="text-cyber-primary font-bold">{score} units</span>.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={startGame} className="cyber-btn">REBOOT SCAN</button>
                                <button onClick={() => navigate('/side-quests')} className="text-gray-400 hover:text-white">EXIT</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 cyber-card bg-cyber-primary/5 p-6 border-cyber-primary/30">
                    <h4 className="text-cyber-primary font-cyber text-sm mb-2 uppercase">Cyber Lab Stats:</h4>
                    <p className="text-gray-300 text-sm">
                        Malware nodes detected: <span className="text-cyber-danger">{malware.length}</span>
                    </p>
                    <p className="text-gray-300 text-xs mt-4 opacity-50">
                        * Tokens verified identity. Each token increases your scanner length.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CyberSnake;
