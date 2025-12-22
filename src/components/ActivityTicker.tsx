'use client';

import { motion } from 'framer-motion';
import { TrendingUp, User } from 'lucide-react';

const RECENT_BETS = [
    { user: '2KF9...Etm', action: 'EXECUTED YES', market: 'BTC > $100k', amount: '5,000 $PREDICT' },
    { user: 'riQL...FjW', action: 'EXECUTED YES', market: 'SOL to $500', amount: '25,000 $PREDICT', isWhale: true },
    { user: '8fGa...1a2', action: 'EXECUTED NO', market: 'ETH > $4k', amount: '2,500 $PREDICT' },
    { user: 'DbXz...21c', action: 'EXECUTED NO', market: 'S&P 500 ATH', amount: '100,000 $PREDICT', isWhale: true },
    { user: '1cRy...99d', action: 'OPENED POSITION', market: 'Memecoin Season', amount: '1,200 $PREDICT' },
    { user: '99Pq...11f', action: 'CREATED_MARKET', market: 'Mars Landing 2030', isNew: true },
    { user: 'Whal...ale', action: 'EXECUTED YES', market: 'Trump Election', amount: '1M $PREDICT', isWhale: true },
    { user: '44kB...8ab', action: 'EXECUTED YES', market: 'GTA 6 Release', amount: '8,000 $PREDICT' },
];

export const ActivityTicker = () => {
    return (
        <div className="w-full bg-white border-b-2 border-black overflow-hidden py-1.5 flex items-center">
            <div className="bg-black text-white text-[10px] font-black px-3 py-1 mx-4 border border-black flex items-center gap-2 tracking-[0.2em] uppercase shrink-0 italic">
                <div className="w-2 h-2 bg-orange-600 animate-pulse border border-white" />
                NETWORK_FEED
            </div>

            <div className="relative flex overflow-x-hidden flex-1">
                <motion.div
                    className="flex gap-16 whitespace-nowrap items-center"
                    animate={{ x: [0, -1200] }}
                    transition={{
                        repeat: Infinity,
                        duration: 35,
                        ease: "linear"
                    }}
                >
                    {[...RECENT_BETS, ...RECENT_BETS, ...RECENT_BETS].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-black text-black opacity-40">[{item.user}]</span>
                            </div>

                            <span className={`text-[11px] font-black uppercase tracking-tight italic ${item.isNew ? 'text-orange-600' :
                                item.action.includes('YES') ? 'text-black' : 'text-red-600'
                                }`}>
                                {item.action}
                            </span>

                            <span className="text-[11px] font-black text-black max-w-[180px] truncate uppercase tracking-tighter">
                                {item.market}
                            </span>

                            {item.amount && (
                                <span className={`text-[10px] font-mono font-black border border-black px-2 py-0.5 ${item.isWhale ? 'bg-black text-white' : 'bg-gray-50 text-black'
                                    }`}>
                                    {item.amount}
                                </span>
                            )}

                            {item.isWhale && (
                                <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 border border-black font-black italic animate-pulse">
                                    WHALE_SIGNAL_!!!
                                </span>
                            )}

                            {item.isNew && (
                                <span className="text-[10px] bg-black text-white px-2 py-0.5 border border-black font-black uppercase tracking-widest">
                                    NEW_INTEL
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
