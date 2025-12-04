'use client';
import { motion } from 'framer-motion';
import { Users, Vote, TrendingUp, Zap } from 'lucide-react';

export const Stats = () => {
    const stats = [
        {
            icon: Users,
            value: 'Coming Soon',
            label: 'Community Members',
            color: 'text-blue-400',
        },
        {
            icon: Vote,
            value: '10',
            label: 'Live Predictions',
            color: 'text-purple-400',
        },
        {
            icon: TrendingUp,
            value: '100%',
            label: 'Fair Launch',
            color: 'text-green-400',
        },
        {
            icon: Zap,
            value: '1B',
            label: 'Total Supply',
            color: 'text-yellow-400',
        },
    ];

    return (
        <section className="py-16 px-6 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 border-y border-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                            <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
