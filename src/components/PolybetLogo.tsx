'use client';

import React from 'react';

export const PolybetLogo = ({ className = "h-8 w-8" }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" /> {/* purple-500 */}
                    <stop offset="100%" stopColor="#ec4899" /> {/* pink-600 */}
                </linearGradient>
            </defs>
            {/* Geometric P Construction */}
            <path
                d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinejoin="round"
            />
            {/* Internal Geometric Lines forming the P */}
            <path
                d="M50 5V45L90 25"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinejoin="round"
            />
            <path
                d="M10 25L50 45L50 85L10 65V25Z"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinejoin="round"
                fill="url(#logo-gradient)"
                fillOpacity="0.1"
            />
            <path
                d="M50 45L90 25V65L50 85"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinejoin="round"
            />
            <path
                d="M50 65L90 45"
                stroke="url(#logo-gradient)"
                strokeWidth="4"
                strokeLinejoin="round"
            />
        </svg>
    );
};
