import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const active = searchParams.get('active') || 'true';
    const closed = searchParams.get('closed') || 'false';
    const sortBy = searchParams.get('order') || 'liquidity';
    const ascending = searchParams.get('ascending') || 'false';
    const tag = searchParams.get('tag_slug');
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');

    try {
        let targetUrl = `https://gamma-api.polymarket.com/events?active=${active}&closed=${closed}&order=${sortBy}&ascending=${ascending}&limit=${limit}&offset=${offset}`;

        if (tag) targetUrl += `&tag_slug=${tag}`;

        if (id) {
            targetUrl = `https://gamma-api.polymarket.com/events?id=${id}`;
        } else if (ids) {
            const idList = ids.split(',');
            const query = idList.map(i => `id=${i.trim()}`).join('&');
            targetUrl = `https://gamma-api.polymarket.com/events?${query}`;
        }

        console.log(`[API RELAY] -> ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error(`Polymarket API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('[API] Error fetching markets:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
