'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BackgroundProps {
    activeCategory: string;
}

const CATEGORY_COLORS: Record<string, string[]> = {
    all: ['#a855f7', '#3b82f6', '#ec4899'],
    crypto: ['#06b6d4', '#3b82f6', '#0891b2'],
    politics: ['#ef4444', '#3b82f6', '#991b1b'],
    sports: ['#f59e0b', '#ea580c', '#d97706'],
    esports: ['#ec4899', '#db2777', '#be185d'],
    news: ['#10b981', '#059669', '#047857'],
};

export const Background = ({ activeCategory }: BackgroundProps) => {
    return (
        <div className="fixed inset-0 pointer-events-none -z-30 bg-white">
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};
