import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameIntroTemplate from '../common/GameIntroTemplate';

const GRID_SIZE = 21; // Odd number for maze
const CELL_SIZE = 25;

// Simplistic Maze (1 = Wall, 0 = Path, 2 = Packet, 3 = Powerup)
const MAZE = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 2, 3, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const CyberPacman = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [gameState, setGameState] = useState('INTRO');
    const [player, setPlayer] = useState({ x: 10, y: 15 });
    const [ghosts, setGhosts] = useState([
        { x: 9, y: 9, dir: { x: 1, y: 0 }, color: '#FF0000' },
        { x: 11, y: 9, dir: { x: -1, y: 0 }, color: '#FFB8FF' }
    ]);
    const [packets, setPackets] = useState([]);
    const [powerups, setPowerups] = useState([]);
    const [score, setScore] = useState(0);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [encryptionTimer, setEncryptionTimer] = useState(0);
    const playerPosRef = useRef(player);

    // Keep ref updated for AI
    useEffect(() => {
        playerPosRef.current = player;
    }, [player]);

    const introData = {
        title: "Cyber Pac-Man: Data Protector",
        story: "As a Security Bot, you must collect company data packets scattered across the network. Be careful—hackers are prowling the corridors to intercept your data!",
        concept: "Data theft happens when hackers access unprotected systems. Encryption provides a temporary shield.",
        objectives: [
            "Collect all Data Packets (Dots).",
            "Avoid Hackers (Ghosts).",
            "Collect Encryption Shields (Power Pellets) to turn the tables!"
        ],
        controls: "WASD or Arrow Keys to move."
    };

    const initGame = useCallback(() => {
        const p = [];
        const pu = [];
        for (let y = 0; y < MAZE.length; y++) {
            for (let x = 0; x < MAZE[y].length; x++) {
                if (MAZE[y][x] === 2) p.push({ x, y });
                if (MAZE[y][x] === 3) pu.push({ x, y });
            }
        }
        setPackets(p);
        setPowerups(pu);
        setPlayer({ x: 10, y: 15 });
        setGhosts([
            { x: 9, y: 9, dir: { x: 1, y: 0 }, color: '#FF0000' },
            { x: 11, y: 9, dir: { x: -1, y: 0 }, color: '#FFB8FF' },
            { x: 10, y: 8, dir: { x: 0, y: 1 }, color: '#00FFFF' }
        ]);
        setScore(0);
        setIsEncrypted(false);
        setGameState('PLAYING');
    }, []);

    const moveEntity = (entity, dir) => {
        const nextX = entity.x + dir.x;
        const nextY = entity.y + dir.y;
        if (MAZE[nextY] && MAZE[nextY][nextX] !== 1) {
            return { x: nextX, y: nextY };
        }
        return entity;
    };

    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const handleInput = (e) => {
            let dir = { x: 0, y: 0 };
            switch (e.key.toLowerCase()) {
                case 'arrowup': case 'w': dir = { x: 0, y: -1 }; break;
                case 'arrowdown': case 's': dir = { x: 0, y: 1 }; break;
                case 'arrowleft': case 'a': dir = { x: -1, y: 0 }; break;
                case 'arrowright': case 'd': dir = { x: 1, y: 0 }; break;
                default: return;
            }
            setPlayer(p => moveEntity(p, dir));
        };

        window.addEventListener('keydown', handleInput);
        return () => window.removeEventListener('keydown', handleInput);
    }, [gameState]);

    // Game Loop
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        const interval = setInterval(() => {
            // Move Ghosts
            setGhosts(prev => prev.map(g => {
                const pPos = playerPosRef.current;
                let bestDir = g.dir;

                // Pursuit Logic: If not encrypted, find best direction towards player
                if (!isEncrypted) {
                    const possibleDirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                    let minDist = Infinity;

                    possibleDirs.forEach(d => {
                        const nx = g.x + d.x;
                        const ny = g.y + d.y;

                        // Don't reverse direction unless necessary (classic pacman ghost behavior)
                        if (d.x === -g.dir.x && d.y === -g.dir.y) return;

                        if (MAZE[ny] && MAZE[ny][nx] !== 1) {
                            const dist = Math.sqrt(Math.pow(nx - pPos.x, 2) + Math.pow(ny - pPos.y, 2));
                            if (dist < minDist) {
                                minDist = dist;
                                bestDir = d;
                            }
                        }
                    });
                }

                let next = moveEntity(g, bestDir);

                // If the selected direction leads to a wall, pick any available direction
                if (next.x === g.x && next.y === g.y) {
                    const availableDirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }].filter(d => {
                        const nx = g.x + d.x;
                        const ny = g.y + d.y;
                        return MAZE[ny] && MAZE[ny][nx] !== 1;
                    });
                    const randomDir = availableDirs[Math.floor(Math.random() * availableDirs.length)];
                    if (randomDir) {
                        bestDir = randomDir;
                        next = moveEntity(g, bestDir);
                    }
                }

                return { ...g, ...next, dir: bestDir };
            }));

            // Encryption Timer
            if (isEncrypted) {
                setEncryptionTimer(t => {
                    if (t <= 0) {
                        setIsEncrypted(false);
                        return 0;
                    }
                    return t - 100;
                });
            }
        }, 200);

        return () => clearInterval(interval);
    }, [gameState, isEncrypted]);

    // Collision Detection
    useEffect(() => {
        if (gameState !== 'PLAYING') return;

        // Packets
        setPackets(prev => {
            const remaining = prev.filter(p => p.x !== player.x || p.y !== player.y);
            if (remaining.length < prev.length) setScore(s => s + 10);
            if (remaining.length === 0) setGameState('WON');
            return remaining;
        });

        // Powerups
        setPowerups(prev => {
            const remaining = prev.filter(p => p.x !== player.x || p.y !== player.y);
            if (remaining.length < prev.length) {
                setIsEncrypted(true);
                setEncryptionTimer(5000);
                setScore(s => s + 50);
            }
            return remaining;
        });

        // Ghosts
        ghosts.forEach(g => {
            if (g.x === player.x && g.y === player.y) {
                if (isEncrypted) {
                    // Eat ghost? For simplicity, just teleport them back
                    setGhosts(prev => prev.map(ghost =>
                        (ghost === g) ? { ...ghost, x: 10, y: 9 } : ghost
                    ));
                    setScore(s => s + 100);
                } else {
                    setGameState('OVER');
                }
            }
        });
    }, [player, ghosts, isEncrypted]);

    // Render
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Walls
        ctx.fillStyle = '#1e293b';
        for (let y = 0; y < MAZE.length; y++) {
            for (let x = 0; x < MAZE[y].length; x++) {
                if (MAZE[y][x] === 1) {
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
                }
            }
        }

        // Packets
        ctx.fillStyle = '#00f2fe';
        packets.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + CELL_SIZE / 2, p.y * CELL_SIZE + CELL_SIZE / 2, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        // Powerups
        ctx.fillStyle = '#facc15';
        powerups.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + CELL_SIZE / 2, p.y * CELL_SIZE + CELL_SIZE / 2, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // Player
        ctx.fillStyle = isEncrypted ? '#34d399' : '#facc15';
        if (isEncrypted) ctx.shadowBlur = 10, ctx.shadowColor = '#34d399';
        ctx.beginPath();
        ctx.arc(player.x * CELL_SIZE + CELL_SIZE / 2, player.y * CELL_SIZE + CELL_SIZE / 2, 10, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(player.x * CELL_SIZE + CELL_SIZE / 2, player.y * CELL_SIZE + CELL_SIZE / 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ghosts
        ghosts.forEach(g => {
            ctx.fillStyle = isEncrypted ? '#3b82f6' : g.color;
            ctx.fillRect(g.x * CELL_SIZE + 4, g.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);
        });
    }, [player, ghosts, packets, powerups, isEncrypted]);

    return (
        <div className="min-h-screen pt-24 pb-12 bg-cyber-dark flex flex-col items-center">
            {gameState === 'INTRO' && (
                <GameIntroTemplate {...introData} onStart={initGame} onSkip={() => setGameState('PLAYING')} />
            )}

            <div className="max-w-2xl w-full px-4">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate('/side-quests')} className="text-gray-400 hover:text-white">← Back</button>
                    <div className="flex gap-8">
                        <div className="text-cyber-secondary font-cyber">ENCRYPTION: <span className={isEncrypted ? 'text-cyber-primary' : 'text-gray-600'}>{isEncrypted ? 'ACTIVE' : 'OFF'}</span></div>
                        <div className="text-cyber-primary font-cyber text-2xl">SCORE: {score}</div>
                    </div>
                </div>

                <div className="relative bg-black/60 border-4 border-cyber-primary/20 rounded-lg p-2 overflow-hidden shadow-2xl">
                    <canvas ref={canvasRef} width={CELL_SIZE * GRID_SIZE} height={CELL_SIZE * GRID_SIZE} className="mx-auto" />

                    {(gameState === 'OVER' || gameState === 'WON') && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-8">
                            <h2 className={gameState === 'WON' ? 'text-cyber-primary text-4xl font-cyber mb-4' : 'text-cyber-danger text-4xl font-cyber mb-4'}>
                                {gameState === 'WON' ? 'MISSION SUCCESS' : 'SYSTEM BREACHED'}
                            </h2>
                            <p className="text-gray-300 mb-8">{gameState === 'WON' ? 'You secured all data packets!' : 'A hacker intercepted your data.'}</p>
                            <div className="flex gap-4">
                                <button onClick={initGame} className="cyber-btn">RETRY</button>
                                <button onClick={() => navigate('/side-quests')} className="text-gray-500">QUIT</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="cyber-card p-4 border-cyber-primary/10">
                        <h4 className="text-xs text-cyber-secondary uppercase mb-1">Cyber Fact:</h4>
                        <p className="text-[10px] text-gray-400 italic">"Encryption scrambles data into a secret code that only the right key can open."</p>
                    </div>
                    <div className="cyber-card p-4 border-cyber-primary/10">
                        <h4 className="text-xs text-cyber-secondary uppercase mb-1">Hacker Status:</h4>
                        <p className="text-[10px] text-gray-400 italic">{isEncrypted ? "Hackers are vulnerable! Trace them now." : "Hackers are actively scanning for unprotected data."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CyberPacman;
