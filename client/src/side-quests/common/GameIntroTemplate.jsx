import { motion } from 'framer-motion';

const GameIntroTemplate = ({
    title,
    story,
    concept,
    objectives,
    controls,
    onStart,
    onSkip
}) => {
    return (
        <motion.div
            className="fixed inset-0 z-[60] bg-cyber-dark/95 backdrop-blur-xl flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="cyber-card max-w-2xl w-full border-cyber-primary/30 p-8 relative overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
            >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="font-cyber text-3xl font-bold text-cyber-primary mb-6 border-b border-cyber-primary/20 pb-4">
                        {title}
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className="mb-6">
                                <h3 className="text-cyber-secondary text-sm font-cyber uppercase tracking-wider mb-2">📖 Story</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">{story}</p>
                            </div>

                            <div className="mb-6 bg-cyber-primary/5 border-l-2 border-cyber-primary p-4 rounded-r-lg">
                                <h3 className="text-cyber-primary text-sm font-cyber uppercase tracking-wider mb-1">🧠 Cyber Concept</h3>
                                <p className="text-cyber-primary/90 text-sm font-medium italic">{concept}</p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-6">
                                <h3 className="text-cyber-secondary text-sm font-cyber uppercase tracking-wider mb-2">🎯 Objective</h3>
                                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                                    {objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                </ul>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-cyber-secondary text-sm font-cyber uppercase tracking-wider mb-2">🎮 Controls</h3>
                                <p className="text-gray-300 text-sm font-mono bg-black/40 p-2 rounded border border-white/5">
                                    {controls}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={onStart}
                            className="flex-1 cyber-btn bg-cyber-primary text-black font-bold py-3 text-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]"
                        >
                            START GAME
                        </button>
                        <button
                            onClick={onSkip}
                            className="px-6 text-gray-500 hover:text-white transition-colors text-sm"
                        >
                            Skip Info
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GameIntroTemplate;
