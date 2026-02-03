import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const GameContext = createContext(null);

/**
 * GameProvider Component
 * Manages game state, progress, and badges
 */
export function GameProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [progress, setProgress] = useState([]);
    const [badges, setBadges] = useState([]);
    const [allBadges, setAllBadges] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(null);

    /**
     * Fetch user's progress
     */
    const fetchProgress = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/game/progress`);
            setProgress(res.data.data);
        } catch (err) {
            console.error('Failed to fetch progress:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    /**
     * Fetch user's badges
     */
    const fetchBadges = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const res = await axios.get(`${API_URL}/game/badges`);
            setBadges(res.data.data);
            setAllBadges(res.data.allBadges || {});
        } catch (err) {
            console.error('Failed to fetch badges:', err);
        }
    }, [isAuthenticated]);

    /**
     * Save level progress
     */
    const saveProgress = async (levelData) => {
        try {
            const res = await axios.post(`${API_URL}/game/progress`, levelData);

            // Update local progress
            const updatedProgress = res.data.data.progress;
            setProgress(prev => {
                const index = prev.findIndex(p => p.levelId === updatedProgress.levelId);
                if (index >= 0) {
                    const newProgress = [...prev];
                    newProgress[index] = updatedProgress;
                    return newProgress;
                }
                return [...prev, updatedProgress];
            });

            // Update badges if new ones were earned
            const newBadges = res.data.data.newBadges || [];
            if (newBadges.length > 0) {
                setBadges(prev => [...newBadges, ...prev]);
            }

            return { success: true, newBadges };
        } catch (err) {
            console.error('Failed to save progress:', err);
            return { success: false, error: err.message };
        }
    };

    /**
     * Get progress for a specific level
     */
    const getLevelProgress = (levelId) => {
        return progress.find(p => p.levelId === levelId) || null;
    };

    /**
     * Check if a level is unlocked
     * Level 1 is always unlocked, others require previous level completion
     */
    const isLevelUnlocked = (levelId) => {
        if (levelId === 1) return true;
        const previousProgress = progress.find(p => p.levelId === levelId - 1);
        return previousProgress?.completed || false;
    };

    /**
     * Calculate overall stats
     */
    const getStats = () => {
        const completedLevels = progress.filter(p => p.completed).length;
        const totalScore = progress.reduce((sum, p) => sum + (p.highScore || 0), 0);
        const averageScore = completedLevels > 0 ? Math.round(totalScore / completedLevels) : 0;
        const totalTime = progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

        return {
            completedLevels,
            totalLevels: 4,
            totalScore,
            averageScore,
            totalTime,
            totalBadges: badges.length
        };
    };

    const value = {
        progress,
        badges,
        allBadges,
        loading,
        currentLevel,
        setCurrentLevel,
        fetchProgress,
        fetchBadges,
        saveProgress,
        getLevelProgress,
        isLevelUnlocked,
        getStats
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

/**
 * Hook to use game context
 */
export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}

export default GameContext;
