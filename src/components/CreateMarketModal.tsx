'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Calendar, Tag, Zap, Swords, Gavel, Newspaper, Tv } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';

interface CreateMarketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateMarketModal = ({ isOpen, onClose }: CreateMarketModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState('');
    const [category, setCategory] = useState('CRYPTO');
    const [endDate, setEndDate] = useState('');

    const getCategoryIcon = (cat: string) => {
        const c = cat.toLowerCase();
        if (c.includes('crypto')) return Zap;
        if (c.includes('sport')) return Swords;
        if (c.includes('politics')) return Gavel;
        if (c.includes('news')) return Newspaper;
        if (c.includes('pop') || c.includes('culture')) return Tv;
        return Tag;
    };

    const SelectorIcon = getCategoryIcon(category);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 1500)); // Simulate transmission
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast.success("Request Sent to Protocol Watchers! 📡");
            onClose();
        } catch (err: any) {
            toast.error("Signal Transmission Failed.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col"
                >
                    {/* Status Bar */}
                    <div className="bg-black text-[8px] font-mono text-white/40 px-3 py-1 flex justify-between uppercase font-bold">
                        <span>TERMINAL_SESSION: REQUEST_MARKET</span>
                        <span>STATUS: {isLoading ? 'TRANSMITTING...' : 'CONNECTED'}</span>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b-2 border-black">
                        <h2 className="text-xl font-black text-black flex items-center gap-2 uppercase tracking-tighter italic leading-none">
                            <Rocket className="text-orange-600" size={24} />
                            REQUEST_NEW_MARKET
                        </h2>
                        <button onClick={onClose} className="p-1 border border-black hover:bg-black hover:text-white transition-colors">
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-6">
                                <div className="w-10 h-10 border-4 border-black border-t-orange-600 animate-spin" />
                                <p className="text-black font-mono text-[10px] font-black uppercase tracking-widest">TRANSMITTING_SIGNAL...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRequest} className="space-y-6">
                                <div className="text-sm p-4 bg-gray-50 border-2 border-black text-black/60 font-mono uppercase leading-tight italic">
                                    <p>Submit a request to the Protocol Authority. Mirrored markets use Global Treasury liquidity.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest italic">PREDICTION_PROMPT</label>
                                    <textarea
                                        placeholder="E.G. WILL_SOLANA_HIT_ATH_BEFORE_2026?"
                                        className="w-full bg-white border-2 border-black px-4 py-3 text-black focus:bg-orange-50 focus:outline-none transition-colors font-black uppercase tracking-tighter text-sm h-24 resize-none"
                                        value={question}
                                        onChange={e => setQuestion(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest italic flex items-center gap-1">
                                            <SelectorIcon size={10} className="text-orange-600" /> CATEGORY
                                        </label>
                                        <select
                                            className="w-full bg-white border-2 border-black px-4 py-3 text-black font-black uppercase tracking-tighter text-sm focus:bg-orange-50 focus:outline-none cursor-pointer"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                        >
                                            <option value="CRYPTO">CRYPTO</option>
                                            <option value="SPORTS">SPORTS</option>
                                            <option value="POLITICS">POLITICS</option>
                                            <option value="POP">POP_CULTURE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[10px] font-black text-black/40 uppercase tracking-widest italic flex items-center gap-1">
                                            <Calendar size={10} /> EXPIRY_DATE
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full bg-white border-2 border-black px-4 py-3 text-black font-black uppercase tracking-tighter text-sm focus:bg-orange-50 focus:outline-none cursor-pointer"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full font-black py-4 border-2 border-black bg-orange-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all mt-4 uppercase tracking-widest text-xs italic"
                                >
                                    SUBMIT_SIGNAL_📡
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
