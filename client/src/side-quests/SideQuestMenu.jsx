import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SideQuestMenu = () => {
    const navigate = useNavigate();

    const games = [
        {
            id: 'pacman',
            title: 'Cyber Pac-Man',
            desc: 'Protect company data packets from hackers.',
            icon: '🟡',
            path: '/side-quests/pacman',
            color: '#FFD700'
        },
        {
            id: 'snake',
            title: 'Cyber Snake',
            desc: 'Collect security tokens and avoid malware nodes.',
            icon: '🐍',
            path: '/side-quests/snake',
            color: '#10B981'
        },
        {
            id: 'breaker',
            title: 'Firewall Breaker',
            desc: 'Defend the gateway against waves of malware blocks.',
            icon: '🧱',
            path: '/side-quests/breaker',
            color: '#3B82F6'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-cyber-dark">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-cyber text-4xl font-bold text-white mb-4">
                        Side <span className="text-cyber-primary">Quests</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Practice your skills and earn scores in these retro-themed cybersecurity challenges.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            className="cyber-card group cursor-pointer border-cyber-primary/20 hover:border-cyber-primary/60"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(game.path)}
                            whileHover={{ y: -5 }}
                        >
                            <div className="text-6xl mb-6 flex justify-center">{game.icon}</div>
                            <h3 className="font-cyber text-xl font-bold text-center mb-3 text-white group-hover:text-cyber-primary transition-colors">
                                {game.title}
                            </h3>
                            <p className="text-gray-400 text-center text-sm mb-6">
                                {game.desc}
                            </p>
                            <button className="w-full cyber-btn text-xs py-2">
                                Launch Side Quest
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="mt-16 bg-cyber-primary/5 border border-cyber-primary/20 rounded-xl p-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-cyber-primary font-cyber mb-2">Did You Know?</h3>
                    <p className="text-gray-400 text-sm">
                        Mini-games are fun, but they also simulate real-world security challenges like traffic filtering and data protection!
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SideQuestMenu;
