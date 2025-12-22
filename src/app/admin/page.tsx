'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletConnect } from '@/components/WalletConnect';
import { motion } from 'framer-motion';
import {
    Lock,
    Unlock,
    Download,
    TrendingUp,
    Users,
    DollarSign,
    CheckCircle,
    XCircle,
    Shield
} from 'lucide-react';
import { getAllVotes } from '@/utils/voteStorage';
import {
    closePrediction,
    getAllOutcomes,
    reopenPrediction,
    isPredictionClosed
} from '@/utils/predictionManagement';
import {
    calculateAllRewards,
    downloadRewardsCSV
} from '@/utils/rewardCalculation';
import {
    initializeProtocol,
    initializeMarketOnChain,
    getTreasuryVaultPDA,
    BETTING_MINT
} from '@/services/web3';
import { fetchPolymarketTrending } from '@/services/polymarket';
import { dailyPredictions } from '@/data/predictions';

// Admin wallet addresses
const ADMIN_WALLETS = [
    '2KF9SAvpU2h2ZhczzMLbgx7arkjG8QHCXbQ6XaDqtEtm', // User's Personal Phantom Wallet
    'riQLJeg8RLZkTCja6kPsHEnT2KwyL4maLPQ7f9JkFjW', // Dev/Treasury Wallet
];

const ADMIN_PASS = "PolyPredict2024!";

export default function AdminPage() {
    const { publicKey, connected } = useWallet();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);

    const [outcomes, setOutcomes] = useState<any[]>([]);
    const [allRewards, setAllRewards] = useState<any[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [polyEvents, setPolyEvents] = useState<any[]>([]);
    const [isLoadingPoly, setIsLoadingPoly] = useState(false);
    const [treasuryVault, setTreasuryVault] = useState<string>('');
    const [protocolStatus, setProtocolStatus] = useState<'loading' | 'uninitialized' | 'active'>('loading');

    useEffect(() => {
        if (publicKey) {
            const isAdminWallet = ADMIN_WALLETS.includes(publicKey.toString());
            setIsAdmin(isAdminWallet);
        } else {
            setIsAdmin(false);
            setIsAuthenticated(false);
        }
        loadData();
        loadPolymarket();
        checkProtocol();
    }, [publicKey]);

    const checkProtocol = async () => {
        try {
            const vault = await getTreasuryVaultPDA();
            setTreasuryVault(vault.toString());
            setProtocolStatus('active');
        } catch (e) {
            setProtocolStatus('uninitialized');
        }
    };

    const loadPolymarket = async () => {
        setIsLoadingPoly(true);
        try {
            const trending = await fetchPolymarketTrending(10);
            setPolyEvents(trending);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingPoly(false);
        }
    };

    const handleInitializeProtocol = async () => {
        if (!publicKey) return;
        try {
            const tx = await initializeProtocol(window.solana, BETTING_MINT);
            alert("Protocol Initialized! TX: " + tx);
            checkProtocol();
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const handleMirrorMarket = async (event: any) => {
        if (!publicKey) return;
        const confirmed = window.confirm(`Mirror "${event.question}" as a Daily market?`);
        if (!confirmed) return;

        try {
            const weights = event.totals.map((t: number) => {
                const total = event.totals.reduce((a: number, b: number) => a + b, 0);
                return Math.floor((t / total) * 1000);
            });
            const tx = await initializeMarketOnChain(
                window.solana,
                event.question,
                event.endTime,
                event.outcomes.length,
                1000000,
                weights
            );
            alert("Daily Market Mirrored! TX: " + tx);
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const loadData = () => {
        setOutcomes(getAllOutcomes());
        setAllRewards(calculateAllRewards(1000));
        setTotalVotes(getAllVotes().length);
    };

    const handleClosePrediction = (predictionId: number, outcome: 'yes' | 'no') => {
        if (window.confirm(`Close prediction with outcome: ${outcome.toUpperCase()}?`)) {
            closePrediction(predictionId, outcome, publicKey?.toString() || "");
            loadData();
        }
    };

    const handleReopenPrediction = (predictionId: number) => {
        if (window.confirm('Reopen this prediction?')) {
            reopenPrediction(predictionId);
            loadData();
        }
    };

    const totalRewardPool = allRewards.reduce((sum, r) => sum + r.totalRewardPool, 0);
    const totalWinners = allRewards.reduce((sum, r) => sum + r.totalWinners, 0);

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12 border-b-4 border-black pb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic">POLYPREDICT_ADMIN</h1>
                        <p className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest italic">PROTOCOL_AUTH_STATION // DAILY_FOCUS_ENABLED</p>
                    </div>
                    <WalletConnect />
                </div>

                {connected && isAdmin && !isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto my-20 p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white text-center"
                    >
                        <Lock className="w-12 h-12 text-orange-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">SECURE_AUTH_REQUIRED</h2>
                        <p className="text-[10px] font-mono text-black/40 uppercase mb-8">Verification signal needed for station access</p>

                        <div className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                                onKeyDown={(e) => e.key === 'Enter' && password === ADMIN_PASS && setIsAuthenticated(true)}
                                className={`w-full bg-gray-50 border-2 ${authError ? 'border-red-600' : 'border-black'} px-4 py-3 text-black font-black uppercase tracking-widest text-center focus:bg-orange-50 outline-none`}
                                placeholder="STATION_PASSPHRASE"
                            />
                            <button
                                onClick={() => {
                                    if (password === ADMIN_PASS) setIsAuthenticated(true);
                                    else setAuthError(true);
                                }}
                                className="w-full bg-black text-white font-black py-4 uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-colors shadow-[4px_4px_0px_0px_rgba(255,165,0,1)]"
                            >
                                REQUEST_ACCESS
                            </button>
                        </div>
                    </motion.div>
                )}

                {connected && isAdmin && isAuthenticated && (
                    <div className="space-y-12">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:grid-cols-4 md:gap-6">
                            {[
                                { label: 'VOTES', val: totalVotes, icon: Users },
                                { label: 'CLOSED', val: outcomes.length, icon: CheckCircle },
                                { label: 'POOL', val: `$${totalRewardPool >= 1000 ? (totalRewardPool / 1000).toFixed(1) + 'k' : totalRewardPool}`, icon: DollarSign },
                                { label: 'WINNERS', val: totalWinners, icon: TrendingUp }
                            ].map((stat, i) => (
                                <div key={i} className="border-4 border-black p-4 md:p-6 bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                                    <stat.icon className="w-5 h-5 mb-3 text-orange-600" />
                                    <div className="text-xl md:text-3xl font-black tracking-tighter">{stat.val}</div>
                                    <div className="text-[8px] md:text-[10px] font-mono font-bold text-black/40 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Protocol Management */}
                        <div className="border-4 border-black p-8 bg-gray-50">
                            <h2 className="text-2xl font-black uppercase italic mb-6 tracking-tighter flex items-center gap-3">
                                <Shield className="text-orange-600" /> PROTOCOL_OVERRIDE
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-mono font-bold text-black/40 uppercase">Treasury Vault PDA</label>
                                        <div className="text-xs font-mono font-black break-all bg-white border-2 border-black p-3">{treasuryVault || 'OFFLINE'}</div>
                                    </div>
                                    <button
                                        onClick={handleInitializeProtocol}
                                        className="w-full bg-black text-white py-5 md:py-4 font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-orange-600 transition-colors active:scale-95"
                                    >
                                        Initialize Global Protocol
                                    </button>
                                </div>
                                <div className="flex items-center text-[11px] font-mono font-bold text-black/60 uppercase p-4 border-2 border-dashed border-black/20">
                                    Initialization creates the central Treasury Vault. Required for global payout logic. Perform once per Mainnet deployment.
                                </div>
                            </div>
                        </div>

                        {/* Daily Oven: Polymarket */}
                        <div className="border-4 border-black p-8 bg-white">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">DAILY_MARKET_OVEN</h2>
                                    <p className="text-[10px] font-mono font-bold text-black/40 uppercase">LIVE_POLYM_FEED // FILTER: &lt;24H_EXPIRY</p>
                                </div>
                                <button onClick={loadPolymarket} className={`p-4 border-2 border-black hover:bg-orange-50 transition-colors ${isLoadingPoly ? 'animate-spin' : ''}`}>
                                    <TrendingUp size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {polyEvents.map((event) => {
                                    const hoursLeft = Math.max(0, (event.endTime * 1000 - Date.now()) / (1000 * 60 * 60));
                                    return (
                                        <div key={event.id} className="border-2 border-black p-5 relative overflow-hidden flex flex-col justify-between group">
                                            <div className="absolute top-0 right-0 px-3 py-1 bg-black text-white text-[8px] font-black uppercase italic">
                                                ENDS_IN: {hoursLeft.toFixed(1)}H
                                            </div>
                                            <div className="mb-4">
                                                <h4 className="font-black text-sm uppercase leading-tight pr-12">{event.question}</h4>
                                                <div className="flex gap-2 mt-3">
                                                    {event.outcomes.map((o: string, idx: number) => (
                                                        <span key={idx} className="text-[9px] font-mono font-bold px-2 py-0.5 border border-black/10">
                                                            {o}: {(event.totals[idx] / event.totals.reduce((a: number, b: number) => a + b, 0) * 100).toFixed(0)}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleMirrorMarket(event)}
                                                className="w-full py-4 md:py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors active:bg-orange-700"
                                            >
                                                MIRROR_DAILY_SIGNAL
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Prediction Management */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">PREDICTION_COMMAND_LOG</h2>
                            <div className="space-y-4">
                                {dailyPredictions.map((prediction) => {
                                    const isClosed = isPredictionClosed(prediction.id);
                                    return (
                                        <div key={prediction.id} className={`border-2 border-black p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${isClosed ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-mono font-black text-black/40 uppercase">ID_{prediction.id}</span>
                                                    {isClosed && <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase italic">RESOLVED</span>}
                                                </div>
                                                <h3 className="font-black text-sm uppercase leading-tight">{prediction.question}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:flex gap-3 md:gap-2">
                                                {!isClosed ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleClosePrediction(prediction.id, 'yes')}
                                                            className="px-4 py-4 md:py-2 border-2 border-black font-black text-[10px] uppercase hover:bg-green-50 active:bg-green-100"
                                                        >
                                                            YES
                                                        </button>
                                                        <button
                                                            onClick={() => handleClosePrediction(prediction.id, 'no')}
                                                            className="px-4 py-4 md:py-2 border-2 border-black font-black text-[10px] uppercase hover:bg-red-50 active:bg-red-100"
                                                        >
                                                            NO
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleReopenPrediction(prediction.id)}
                                                        className="col-span-2 px-4 py-4 md:py-2 border-2 border-black font-black text-[10px] uppercase hover:bg-orange-50"
                                                    >
                                                        REOPEN_SIG
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-12 text-center">
                            <button onClick={downloadRewardsCSV} className="text-[10px] font-mono font-black text-black/40 uppercase underline hover:text-black">EXPORT_MASTER_LOG_CSV</button>
                        </div>
                    </div>
                )}

                {(!connected || !isAdmin) && (
                    <div className="max-w-md mx-auto my-20 p-12 border-4 border-dashed border-black/20 text-center">
                        <Lock className="w-12 h-12 text-black/20 mx-auto mb-6" />
                        <h2 className="text-xl font-black uppercase italic text-black/40 tracking-tighter">UNAUTHORIZED_ACCESS</h2>
                        <p className="text-[10px] font-mono text-black/20 uppercase mt-2">Connect protocol authority wallet to engage console</p>
                    </div>
                )}
            </div>
        </div>
    );
}
