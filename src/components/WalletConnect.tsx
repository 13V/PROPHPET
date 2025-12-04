'use client';
import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to avoid hydration errors
const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false }
);

export const WalletConnect: FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="z-50 relative">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-all !rounded-lg !font-bold" />
        </div>
    );
};
