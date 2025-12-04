'use client';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, Clock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { saveVote, getVote, getVoteCounts } from '@/utils/voteStorage';
import { hasMinimumTokens } from '@/utils/tokenGating';

interface PredictionCardProps {
    id: number;
    question: string;
    category: string;
    deadline: string;
    yesVotes: number;
    noVotes: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
    id,
    question,
    category,
    deadline,
    yesVotes: initialYes,
    noVotes: initialNo,
}) => {
    const { publicKey, connected } = useWallet();
    const [yesVotes, setYesVotes] = useState(initialYes);
    const [noVotes, setNoVotes] = useState(initialNo);
    const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
    const [hasTokens, setHasTokens] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Simple countdown logic for demo purposes
        // In a real app, parse the deadline string or use a timestamp
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setUTCHours(23, 59, 59, 999);

            const diff = endOfDay.getTime() - now.getTime();

            if (diff <= 0) return 'Ended';

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            return `${hours}h ${minutes}m`;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const checkTokenBalance = useCallback(async () => {
        if (!publicKey) return;

        setIsChecking(true);
        const hasMin = await hasMinimumTokens(publicKey.toString());
        setHasTokens(hasMin);
        setIsChecking(false);
    }, [publicKey]);

    // Load existing vote and vote counts on mount
    useEffect(() => {
        if (publicKey) {
            const existingVote = getVote(id, publicKey.toString());
            if (existingVote) {
                setVoted(existingVote.choice);
            }

            // Check token balance
            checkTokenBalance();
        }

        // Load vote counts from localStorage
        const counts = getVoteCounts(id);
        setYesVotes(initialYes + counts.yes);
        setNoVotes(initialNo + counts.no);
    }, [publicKey, id, initialYes, initialNo, checkTokenBalance]);

    const handleVote = async (choice: 'yes' | 'no') => {
        if (!connected || !publicKey) {
            alert('Please connect your wallet first!');
            return;
        }

        if (voted) return; // Already voted

        if (!hasTokens) {
            alert('You need to hold $OMEN tokens to vote!');
            return;
        }

        // Save vote
        const vote = {
            predictionId: id,
            choice,
            walletAddress: publicKey.toString(),
            timestamp: Date.now(),
        };

        saveVote(vote);

        // Update local state
        if (choice === 'yes') {
            setYesVotes(prev => prev + 1);
        } else {
            setNoVotes(prev => prev + 1);
        }
        setVoted(choice);
    };

    const totalVotes = yesVotes + noVotes;
    const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 50;
    const noPercentage = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 50;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/90 to-gray-950/90 p-6 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
        >
            {/* Category Badge */}
            <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 border border-purple-500/20">
                    {category}
                </span>
                <div className="flex items-center gap-1 text-xs text-purple-300 bg-purple-900/20 px-2 py-1 rounded-md border border-purple-500/20">
                    <Clock size={12} />
                    <span>Ends in: {timeLeft}</span>
                </div>
            </div>

            {/* Question */}
            <h3 className="mb-4 text-lg font-bold text-white leading-tight">
                {question}
            </h3>

            {/* Vote Progress Bar */}
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                <div className="flex h-full">
                    <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${yesPercentage}%` }}
                        className="bg-gradient-to-r from-green-500 to-green-400"
                    />
                    <motion.div
                        initial={{ width: '50%' }}
                        animate={{ width: `${noPercentage}%` }}
                        className="bg-gradient-to-r from-red-400 to-red-500"
                    />
                </div>
            </div>

            {/* Vote Stats */}
            <div className="mb-4 flex justify-between text-sm">
                <span className="text-green-400 flex items-center gap-1">
                    <TrendingUp size={16} />
                    {yesPercentage.toFixed(0)}% YES
                </span>
                <span className="text-gray-500">{totalVotes} votes</span>
                <span className="text-red-400 flex items-center gap-1">
                    <TrendingDown size={16} />
                    {noPercentage.toFixed(0)}% NO
                </span>
            </div>

            {/* Wallet Not Connected Warning */}
            {!connected && (
                <div className="mb-3 flex items-center gap-2 rounded-lg bg-yellow-900/20 border border-yellow-500/30 px-3 py-2 text-xs text-yellow-400">
                    <Wallet size={14} />
                    <span>Connect wallet to vote</span>
                </div>
            )}

            {/* Vote Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={() => handleVote('yes')}
                    disabled={!connected || voted !== null || isChecking}
                    className={`flex-1 rounded-lg py-3 font-bold transition-all ${voted === 'yes'
                        ? 'bg-green-500 text-white'
                        : voted === 'no'
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : !connected
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-green-900/30 text-green-400 hover:bg-green-900/50 hover:scale-105'
                        }`}
                >
                    {voted === 'yes' ? '✓ VOTED YES' : 'YES'}
                </button>
                <button
                    onClick={() => handleVote('no')}
                    disabled={!connected || voted !== null || isChecking}
                    className={`flex-1 rounded-lg py-3 font-bold transition-all ${voted === 'no'
                        ? 'bg-red-500 text-white'
                        : voted === 'yes'
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : !connected
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:scale-105'
                        }`}
                >
                    {voted === 'no' ? '✓ VOTED NO' : 'NO'}
                </button>
            </div>
        </motion.div>
    );
};
