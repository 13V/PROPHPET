'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const LaunchCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 7,
        hours: 12,
        minutes: 30,
        seconds: 45,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else if (days > 0) {
                    days--;
                    hours = 23;
                    minutes = 59;
                    seconds = 59;
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        { label: 'Days', value: timeLeft.days },
        { label: 'Hours', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Seconds', value: timeLeft.seconds },
    ];

    return (
        <section className="py-16 px-6 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold mb-2 text-white">🚀 Fair Launch Countdown</h2>
                    <p className="text-gray-400 mb-8">Get ready for the most anticipated memecoin launch!</p>

                    <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {timeUnits.map((unit, index) => (
                            <motion.div
                                key={unit.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl p-6 border border-purple-500/30"
                            >
                                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                                    {unit.value.toString().padStart(2, '0')}
                                </div>
                                <div className="text-gray-400 text-sm uppercase tracking-wider">{unit.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:scale-105 transition-all">
                            Set Reminder
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
