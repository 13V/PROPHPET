'use client';
import { motion } from 'framer-motion';
import { Check, Rocket, Target, Trophy, Zap } from 'lucide-react';

export const Roadmap = () => {
    const phases = [
        {
            phase: 'Phase 1',
            title: 'Launch',
            status: 'completed',
            icon: Rocket,
            items: [
                'Prediction dApp MVP ✓',
                'Wallet integration ✓',
                '10 active predictions ✓',
                'Community building ✓',
            ],
        },
        {
            phase: 'Phase 2',
            title: 'Token Launch',
            status: 'current',
            icon: Zap,
            items: [
                'Fair launch on Pump.fun',
                'Liquidity locked for 1 year',
                'Token gating for voting',
                'Marketing campaign',
            ],
        },
        {
            phase: 'Phase 3',
            title: 'Rewards System',
            status: 'upcoming',
            icon: Trophy,
            items: [
                'Leaderboard implementation',
                'Reward distribution for winners',
                'Staking mechanism',
                'NFT badges for top predictors',
            ],
        },
        {
            phase: 'Phase 4',
            title: 'DAO Governance',
            status: 'upcoming',
            icon: Target,
            items: [
                'Community voting on predictions',
                'Proposal system',
                'Treasury management',
                'Multi-chain expansion',
            ],
        },
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-gray-950 to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        Roadmap
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our vision for building the ultimate prediction platform.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-transparent hidden md:block" />

                    {/* Phases */}
                    <div className="space-y-12">
                        {phases.map((phase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Content */}
                                <div className="flex-1">
                                    <div
                                        className={`bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-8 border ${phase.status === 'completed'
                                                ? 'border-green-500/50'
                                                : phase.status === 'current'
                                                    ? 'border-purple-500'
                                                    : 'border-gray-800'
                                            } ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                                    >
                                        <div className="flex items-center gap-3 mb-4 justify-start md:justify-end">
                                            <span className="text-sm font-bold text-purple-400">{phase.phase}</span>
                                            {phase.status === 'completed' && (
                                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                                    Completed
                                                </span>
                                            )}
                                            {phase.status === 'current' && (
                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 animate-pulse">
                                                    In Progress
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-4">{phase.title}</h3>
                                        <ul className="space-y-2">
                                            {phase.items.map((item, i) => (
                                                <li key={i} className="text-gray-400 flex items-center gap-2 justify-start md:justify-end">
                                                    {phase.status === 'completed' ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                                    )}
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-gray-950 z-10">
                                    <phase.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Spacer */}
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
