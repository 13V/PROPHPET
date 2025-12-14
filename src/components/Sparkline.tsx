'use client';

import { motion } from 'framer-motion';

interface SparklineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
    data,
    color = '#10B981', // Emerald-500 default
    width = 120,
    height = 40
}) => {
    // Use fixed 0-100 domain for probability charts
    const min = 0;
    const max = 100;
    const range = max - min;

    // Create SVG path
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        // Clamp value between 0-100 just in case
        const clampedVal = Math.max(0, Math.min(100, val));
        const normalizedY = (clampedVal - min) / range;
        const y = height - (normalizedY * height); // Invert Y for SVG
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${0},${height} ${points} ${width},${height}`;

    // Simple ID generation
    const id = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d={`M ${areaPoints} Z`}
                fill={`url(#${id})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.path
                d={`M ${points}`}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
            />
        </svg>
    );
};
