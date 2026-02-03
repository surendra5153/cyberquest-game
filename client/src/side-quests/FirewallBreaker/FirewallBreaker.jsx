import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameIntroTemplate from '../common/GameIntroTemplate';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 35;

const FirewallBreaker = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('INTRO');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);

    // Game Objects Refs
    const paddleX = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
    const ball = useRef({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30, dx: 4, dy: -4 });
    const bricks = useRef([]);

    const introData = {
        title: "Firewall Breaker: Gateway Defense",
        story: "Your network is under attack! Malware blocks are trying to bypass your security gateway. Use the Firewall Pulse to shatter the incoming threats before they breach the system.",
        concept: "Firewalls act as a barrier between your internal network and outgoing/incoming traffic from the internet.",
        objectives: [
            "Destroy all malware blocks (Bricks).",
            "Prevent the Firewall Pulse (Ball) from falling.",
            "Special blocks (Ransomware) might need multiple hits!"
        ],
        controls: "Move Mouse or use Left/Right Arrow keys to control the Security Gateway."
    };

    const initBricks = useCallback(() => {
        const b = [];
        for (let c = 0; c < BRICK_COLS; c++) {
            b[c] = [];
            for (let r = 0; r < BRICK_ROWS; r++) {
                // Malware types: 1 = normal, 2 = Ransomware (needs 2 hits)
                const type = Math.random() > 0.8 ? 2 : 1;
                b[c][r] = { x: 0, y: 0, status: type, initialStatus: type };
            }
        }
        bricks.current = b;
    }, []);

    const startGame = () => {
        initBricks();
        setScore(0);
        setLives(3);
        ball.current = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 30, dx: 4, dy: -4 };
        setGameState('PLAYING');
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddleX.current = relativeX - PADDLE_WIDTH / 2;
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') paddleX.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleX.current + 20);
            if (e.key === 'ArrowLeft') paddleX.current = Math.max(0, paddleX.current - 20);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const gameLoop = useCallback(() => {
        if (gameState !== 'PLAYING') return;

        const b = ball.current;
        const bs = bricks.current;

        // Collision: Walls
        if (b.x + b.dx > CANVAS_WIDTH - BALL_RADIUS || b.x + b.dx < BALL_RADIUS) b.dx = -b.dx;
        if (b.y + b.dy < BALL_RADIUS) b.dy = -b.dy;
        else if (b.y + b.dy > CANVAS_HEIGHT - BALL_RADIUS) {
            if (b.x > paddleX.current && b.x < paddleX.current + PADDLE_WIDTH) {
                // Hit paddle: change angle based on hit location
                const hitPoint = (b.x - (paddleX.current + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
                b.dx = hitPoint * 5;
                b.dy = -b.dy;
            } else {
                setLives(l => {
                    if (l <= 1) {
                        setGameState('OVER');
                        return 0;
                    }
                    b.x = CANVAS_WIDTH / 2;
                    b.y = CANVAS_HEIGHT - 30;
                    b.dx = 4;
                    b.dy = -4;
                    return l - 1;
                });
            }
        }

        // Collision: Bricks
        let allDestroyed = true;
        for (let c = 0; c < BRICK_COLS; c++) {
            if (!bs[c]) continue;
            for (let r = 0; r < BRICK_ROWS; r++) {
                const brick = bs[c][r];
                if (!brick || brick.status <= 0) continue;

                allDestroyed = false;
                const brickWidth = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLS - 1))) / BRICK_COLS;
                const bx = (c * (brickWidth + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                const by = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;

                if (b.x > bx && b.x < bx + brickWidth && b.y > by && b.y < by + BRICK_HEIGHT) {
                    b.dy = -b.dy;
                    brick.status -= 1;
                    if (brick.status === 0) setScore(s => s + (brick.initialStatus === 2 ? 50 : 20));
                }
            }
        }

        if (allDestroyed) setGameState('WON');

        b.x += b.dx;
        b.y += b.dy;

        // Draw
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Paddle
        const gradient = ctx.createLinearGradient(paddleX.current, 0, paddleX.current + PADDLE_WIDTH, 0);
        gradient.addColorStop(0, '#00f2fe');
        gradient.addColorStop(1, '#4facfe');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4facfe';
        ctx.fillRect(paddleX.current, CANVAS_HEIGHT - PADDLE_HEIGHT - 5, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.shadowBlur = 0;

        // Ball
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();

        // Bricks
        for (let c = 0; c < BRICK_COLS; c++) {
            for (let r = 0; r < BRICK_ROWS; r++) {
                const brick = bs[c][r];
                if (brick.status > 0) {
                    const brickWidth = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - (BRICK_PADDING * (BRICK_COLS - 1))) / BRICK_COLS;
                    const bx = (c * (brickWidth + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                    const by = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;

                    ctx.fillStyle = brick.status === 2 ? '#B91C1C' : '#334155';
                    ctx.strokeStyle = brick.status === 2 ? '#EF4444' : '#64748b';
                    ctx.lineWidth = 2;
                    ctx.fillRect(bx, by, brickWidth, BRICK_HEIGHT);
                    ctx.strokeRect(bx, by, brickWidth, BRICK_HEIGHT);

                    // Add glitch effect for "Ransomware"
                    if (brick.status === 2 && Math.random() > 0.95) {
                        ctx.fillStyle = "rgba(255,255,255,0.2)";
                        ctx.fillRect(bx, by, brickWidth, 2);
                    }
                }
            }
        }
        // requestAnimationFrame is now handled by the separate useEffect below
    }, [gameState]);

    useEffect(() => {
        let frameId;
        const runLoop = () => {
            if (gameState === 'PLAYING') {
                gameLoop();
                frameId = requestAnimationFrame(runLoop);
            }
        };

        if (gameState === 'PLAYING') {
            frameId = requestAnimationFrame(runLoop);
        }

        return () => {
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, [gameState, gameLoop]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cyber-dark flex flex-col items-center">
            {gameState === 'INTRO' && (
                <GameIntroTemplate {...introData} onStart={startGame} onSkip={() => setGameState('PLAYING')} />
            )}

            <div className="max-w-3xl w-full px-4 text-center">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/side-quests')} className="text-gray-400 hover:text-white">← Exit</button>
                    <div className="flex gap-8 items-center">
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={`text-xl ${i < lives ? 'opacity-100' : 'opacity-20 filter grayscale'}`}>🛡️</span>
                            ))}
                        </div>
                        <div className="text-cyber-primary font-cyber text-2xl">SCORE: {score}</div>
                    </div>
                </div>

                <div className="relative bg-black/60 border-2 border-cyber-primary/20 rounded-xl overflow-hidden shadow-2xl cursor-none">
                    <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="max-w-full h-auto mx-auto" />

                    {(gameState === 'OVER' || gameState === 'WON') && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8">
                            <h2 className={gameState === 'WON' ? 'text-cyber-primary text-5xl font-cyber mb-4 animate-pulse' : 'text-cyber-danger text-5xl font-cyber mb-4'}>
                                {gameState === 'WON' ? 'SECURITY RESTORED' : 'GATEWAY BREACHED'}
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                {gameState === 'WON'
                                    ? "All malware blocks have been successfully blocked by your firewall gateway."
                                    : "Malware bypassed your firewall pulse. The network has been compromised."}
                            </p>
                            <div className="flex gap-6">
                                <button onClick={startGame} className="cyber-btn px-8">REINIT GATEWAY</button>
                                <button onClick={() => navigate('/side-quests')} className="text-gray-500 hover:text-white transition-colors">BACK TO MENU</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-4 text-left">
                    <div className="flex-1 cyber-card p-4 border-cyber-primary/5">
                        <h5 className="text-[10px] text-cyber-secondary uppercase mb-1">Threat Report:</h5>
                        <p className="text-xs text-gray-400">Ransomware blocks are marked in <span className="text-cyber-danger">RED</span> and require multiple firewall pulses to break.</p>
                    </div>
                    <div className="flex-1 cyber-card p-4 border-cyber-primary/5">
                        <h5 className="text-[10px] text-cyber-secondary uppercase mb-1">Status:</h5>
                        <p className="text-xs text-gray-400">{lives > 1 ? "System integrity stable." : "Integrity low - One breach left!"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FirewallBreaker;
