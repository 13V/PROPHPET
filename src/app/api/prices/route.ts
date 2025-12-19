import { NextResponse } from 'next/server';

const SYMBOL_TO_BINANCE: Record<string, string> = {
    'BTC': 'BTCUSDT',
    'ETH': 'ETHUSDT',
    'SOL': 'SOLUSDT',
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    const pair = SYMBOL_TO_BINANCE[symbol.toUpperCase()];
    if (!pair) {
        return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
    }

    try {
        // Binance Public API: 1h intervals, 24 candles = 24h history
        const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1h&limit=24`;

        const res = await fetch(url, { next: { revalidate: 60 } }); // Cache for 1 min
        if (!res.ok) {
            throw new Error(`Binance API Error: ${res.status}`);
        }

        const data = await res.json();

        // Return raw data to keep the client logic flexible, or process it here.
        // Let's process it to ensure the client gets exactly what `getCoinGeckoSparkline` expects.
        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ sparkline: [], openPrice: null });
        }

        const sparkline = data.map((candle: any[]) => parseFloat(candle[4]));
        const openPrice = parseFloat(data[0][1]);

        return NextResponse.json({ sparkline, openPrice });

    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ sparkline: [], openPrice: null }, { status: 500 });
    }
}
