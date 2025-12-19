import { NextRequest, NextResponse } from 'next/server';

const SYMBOL_TO_BINANCE: Record<string, string> = {
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT',
    'SOL': 'SOLUSDT',
};

const SYMBOL_TO_KRAKEN: Record<string, string> = {
    'BTC': 'XBTUSD',
    'ETH': 'ETHUSD',
    'SOL': 'SOLUSD',
};

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    const s = symbol.toUpperCase();
    const binancePair = SYMBOL_TO_BINANCE[s];

    // Default empty
    let sparkline: number[] = [];
    let openPrice: number | null = null;

    // 1. Try Binance
    if (binancePair) {
        try {
            const url = `https://api.binance.com/api/v3/klines?symbol=${binancePair}&interval=1h&limit=24`;
            const res = await fetch(url, { next: { revalidate: 30 } }); // 30s cache

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    sparkline = data.map((c: any[]) => parseFloat(c[4])); // Close prices
                    openPrice = parseFloat(data[0][1]); // Open of the first candle (24h ago)
                    return NextResponse.json({ sparkline, openPrice });
                }
            }
        } catch (e) {
            console.error('Binance Proxy Error:', e);
        }
    }

    // 2. Fallback to Kraken
    const krakenPair = SYMBOL_TO_KRAKEN[s];
    if (krakenPair) {
        try {
            // Kraken API: interval=60 (1h)
            const url = `https://api.kraken.com/0/public/OHLC?pair=${krakenPair}&interval=60`;
            const res = await fetch(url, { next: { revalidate: 30 } });

            if (res.ok) {
                const json = await res.json();
                // Kraken returns { result: { PairName: [ [time, open, high, low, close, ...], ... ] } }
                const keys = Object.keys(json.result);
                if (keys.length > 0) {
                    const candles = json.result[keys[0]];
                    // Get last 24 candles
                    const recent = candles.slice(-24);

                    if (Array.isArray(recent) && recent.length > 0) {
                        sparkline = recent.map((c: any[]) => parseFloat(c[4])); // Close
                        openPrice = parseFloat(recent[0][1]); // Open of first in series
                        return NextResponse.json({ sparkline, openPrice });
                    }
                }
            }
        } catch (e) {
            console.error('Kraken Proxy Error:', e);
        }
    }

    return NextResponse.json({ sparkline: [], openPrice: null }, { status: 500 });
}
