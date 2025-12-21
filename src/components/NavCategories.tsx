'use client';

import { motion } from 'framer-motion';
import { Newspaper, Coins, Trophy, Globe, Zap, CheckCircle2, Gamepad2 } from 'lucide-react';

const CATEGORIES = [
    { id: 'all', label: 'All Markets', icon: Zap },
    { id: 'crypto', label: 'Crypto', icon: Coins },
    { id: 'politics', label: 'Politics', icon: Globe },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'esports', label: 'Esports', icon: Gamepad2 },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
];

export const NavCategories = ({ active = 'all', onSelect }: { active?: string, onSelect?: (id: string) => void }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide py-2">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onSelect && onSelect(cat.id)}
                    className={`
                        relative flex items-center gap-2 px-6 py-2 border-2 text-[10px] font-black uppercase tracking-widest italic transition-all whitespace-nowrap overflow-hidden
                        ${active === cat.id
                            ? 'text-white bg-black border-black neo-shadow-sm'
                            : 'text-black bg-white border-black hover:bg-gray-50'
                        }
                    `}
                >
                    {active === cat.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600" />
                    )}
                    <cat.icon size={13} className={active === cat.id ? "text-orange-600" : "text-black"} />
                    {cat.label}
                </button>
            ))}
        </div>
    );
};
