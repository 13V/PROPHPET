'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-black text-white p-6">
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Critical System Error</h2>
                    <p className="font-mono text-xs bg-gray-900 p-4 rounded mb-4 break-all border border-red-900">
                        {error.message}
                    </p>
                    <button onClick={() => reset()} className="bg-white text-black px-6 py-3 rounded-full font-bold">Try again</button>
                </div>
            </body>
        </html>
    );
}
