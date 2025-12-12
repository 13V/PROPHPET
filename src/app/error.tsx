'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Mobile Global Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-950 text-white text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Something went wrong!</h2>
            <div className="bg-gray-900 p-4 rounded-lg border border-red-900/50 max-w-full overflow-auto text-left mb-6">
                <p className="text-gray-300 font-mono text-xs break-all">
                    {error.message || "Unknown Error"}
                </p>
                {error.stack && (
                    <pre className="mt-2 text-[10px] text-gray-500 overflow-x-auto">
                        {error.stack.slice(0, 500)}...
                    </pre>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-bold hover:bg-gray-700"
                >
                    Reload Page
                </button>
                <button
                    onClick={() => reset()}
                    className="px-4 py-2 bg-red-600 rounded-lg text-sm font-bold hover:bg-red-500"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
