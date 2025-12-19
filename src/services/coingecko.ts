/**
 * CoinGecko API Service (Switched to Internal Proxy for CORS/Limits)
 * Fetches historical price data using Next.js API route
 */

export async function getCoinGeckoSparkline(symbol: string): Promise<{ sparkline: number[]; openPrice: number | null }> {
    if (!symbol) return { sparkline: [], openPrice: null };

    try {
        const response = await fetch(`/api/prices?symbol=${symbol}`);
        if (!response.ok) {
            console.error(`[Proxy] API failure: ${response.status}`);
            return { sparkline: [], openPrice: null };
        }

        const data = await response.json();
        return data; // { sparkline, openPrice }
    } catch (error) {
        console.error('Error fetching market data from proxy:', error);
        return { sparkline: [], openPrice: null };
    }
}
