'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900 via-gray-950 to-gray-950 flex flex-col items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8"
            >
                <Sparkles className="w-24 h-24 text-purple-500 mx-auto mb-6" />
                <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                    404
                </h1>
                <h2 className="text-3xl font-bold text-white mb-4">
                    Prediction Failed
                </h2>
                <p className="text-xl text-gray-400 max-w-md mx-auto mb-8">
                    We couldn't predict you'd end up here. This page doesn't exist in this timeline.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:scale-105 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Return to Timeline
                </Link>
            </motion.div>
        </div>
    );
}
