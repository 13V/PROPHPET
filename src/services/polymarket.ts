import { dailyPredictions } from '@/data/predictions';

export interface PolymarketEvent {
    id: string;
    title: string;
    slug: string;
    markets: Array<{
        id: string;
        question: string;
        outcomes: string[]; // ["Yes", "No"]
        outcomePrices: string[]; // ["0.65", "0.35"]
        volume: string;
        liquidity: string;
        endDate: string;
    }>;
    volume: string;
    image?: string;
}

// Use internal API to bypass CORS
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchPolymarketTrending(limit = 50, offset = 0, sortBy = 'liquidity', ascending = false) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            // STRATEGY: Client-Side Fetch via Public CORS Proxy
            const gammaUrl = `https://gamma-api.polymarket.com/events?active=true&closed=false&order=${sortBy}&ascending=${ascending}&limit=${limit}&offset=${offset}`;
            let response;
            let usedSource = 'Client-Proxy';

            try {
                // Priority 1: Client Proxy
                console.log('Fetching via corsproxy.io...');
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(gammaUrl)}`;
                response = await fetch(proxyUrl);
                if (!response.ok) throw new Error('Proxy 1 failed');
            } catch (proxyError) {
                console.warn('Proxy 1 failed, attempting fallback...', proxyError);

                // Priority 2: Alternative Proxy
                try {
                    usedSource = 'allorigins';
                    const proxyUrl2 = `https://api.allorigins.win/raw?url=${encodeURIComponent(gammaUrl)}`;
                    response = await fetch(proxyUrl2);
                    if (!response.ok) throw new Error('Proxy 2 failed');
                } catch (internalError) {
                    // Priority 3: Internal API (Likely blocked, but worth a shot)
                    usedSource = 'Internal-API';
                    console.log('Fallback to Internal API...');
                    const internalUrl = `/api/markets?limit=${limit}&offset=${offset}`;
                    response = await fetch(internalUrl);
                }
            }

            if (!response || !response.ok) {
                throw new Error(`All Fetch Methods Failed. Last status: ${response ? response.status : 'Network Error'}`);
            }

            const events: PolymarketEvent[] = await response.json();
            console.log(`Debug: Received ${events.length} raw events from ${usedSource}`);

            // Map to our internal format
            return events.map(event => {
                const market = event.markets[0]; // Take the first/primary market
                if (!market) return null;

                // Parse prices (Robust handling for API variations)
                let prices = market.outcomePrices;

                // If it's a string (JSON stringified), parse it first
                if (typeof prices === 'string') {
                    try {
                        prices = JSON.parse(prices);
                    } catch (e) {
                        console.warn('Failed to parse outcomePrices', prices);
                        prices = ["0.5", "0.5"];
                    }
                }

                const yesPrice = (prices && prices[0]) ? parseFloat(prices[0]) : 0.5;
                const noPrice = (prices && prices[1]) ? parseFloat(prices[1]) : 0.5;

                // Calculate votes from volume (rough approximation: $1 = 1 vote)
                const totalVolume = parseFloat(market.volume || event.volume || '0');
                const yesVotes = Math.floor(totalVolume * yesPrice);
                const noVotes = Math.floor(totalVolume * noPrice);

                // Parse outcomes (Robust handling)
                let outcomes = market.outcomes;
                if (typeof outcomes === 'string') {
                    try {
                        outcomes = JSON.parse(outcomes);
                    } catch (e) {
                        console.warn('Failed to parse outcomes', outcomes);
                        outcomes = ["YES", "NO"];
                    }
                }

                // Ensure it's an array
                if (!Array.isArray(outcomes) || outcomes.length === 0) {
                    outcomes = ["YES", "NO"];
                }

                // Heuristic: If Outcomes are generic "Yes, No" but Title contains " vs ", try to infer teams
                // This fixes the issue where Sports markets show "Yes/No" instead of Team Names
                if (outcomes.length === 2 && outcomes[0].toLowerCase() === 'yes' && outcomes[1].toLowerCase() === 'no') {
                    const titleV = event.title || event.slug || "";
                    if (titleV.includes(" vs ") || titleV.includes(" vs. ")) {
                        const parts = titleV.split(/ vs\.? /i);
                        if (parts.length === 2) {
                            // Clean up names (remove trailing punctuation etc)
                            const teamA = parts[0].trim();
                            const teamB = parts[1].trim();
                            if (teamA.length < 20 && teamB.length < 20) { // Safety check
                                outcomes = [teamA, teamB];
                            }
                        }
                    }
                }

                return {
                    id: parseInt(market.id) || parseInt(event.id) || Math.random() * 100000,
                    question: event.title,
                    category: classifyCategory(event.slug),
                    endDate: market.endDate,
                    outcomeLabels: outcomes,
                    timeLeft: formatDate(market.endDate),
                    yesVotes: yesVotes,
                    noVotes: noVotes,
                    totalVolume: totalVolume,
                    isHot: totalVolume > 100000, // Tag as hot if volume > $100k
                };
            }).filter(item => item !== null);

        } catch (error: any) {
            console.warn(`Polymarket fetch attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
            attempt++;

            if (attempt >= maxRetries) {
                console.error('All Polymarket fetch attempts failed.');
                return []; // Return empty array (no fake data)
            }

            // Backoff: 1s, 2s, 4s...
            await delay(1000 * Math.pow(2, attempt - 1));
        }
    }
    return [];
}

function classifyCategory(slug: string): 'CRYPTO' | 'POLITICS' | 'SPORTS' | 'NEWS' {
    const s = slug.toLowerCase();

    // 1. Politics (Highest Priority - Specific Names & Terms)
    if (s.includes('trump') || s.includes('biden') || s.includes('harris') || s.includes('election') || s.includes('republican') || s.includes('democrat') || s.includes('senate') || s.includes('house') || s.includes('president') || s.includes('nominee') || s.includes('cabinet') || s.includes('confirm') || s.includes('vote') || s.includes('policy') || s.includes('poll') || s.includes('approval') || s.includes('regulation') || s.includes('law') || s.includes('court') || s.includes('supreme') || s.includes('congress') || s.includes('parliament') || s.includes('minister') || s.includes('war') || s.includes('israel') || s.includes('ukraine') || s.includes('china') || s.includes('nato') || s.includes('un ') || s.includes('musk') || s.includes('rfk') || s.includes('vivek')) return 'POLITICS';

    // 2. Sports (Clubs, Leagues, Action words)
    if (s.includes('nfl') || s.includes('nba') || s.includes('soccer') || s.includes('league') || s.includes('cup') || s.includes('sport') || s.includes('fight') || s.includes('boxing') || s.includes('ufc') || s.includes('mma') || s.includes('formula') || s.includes('f1') || s.includes('champion') || s.includes('winner') || s.includes('score') || s.includes('vs') || s.includes('fc ') || s.includes('united') || s.includes('real madrid') || s.includes('barcelona') || s.includes('liverpool') || s.includes('city') || s.includes('chelsea') || s.includes('arsenal') || s.includes('goal') || s.includes('points') || s.includes('touchdown') || s.includes('over/under') || s.includes('handicap')) return 'SPORTS';

    // 3. Crypto (Coins, Tokens, Finance)
    if (s.includes('bitcoin') || s.includes('ethereum') || s.includes('solana') || s.includes('crypto') || s.includes('token') || s.includes('price') || s.includes('coin') || s.includes('market') || s.includes('etf') || s.includes('btc') || s.includes('eth') || s.includes('sol') || s.includes('memecoin') || s.includes('pepe') || s.includes('doge') || s.includes('bonk') || s.includes('wif') || s.includes('fed ') || s.includes('rates') || s.includes('inflation')) return 'CRYPTO';

    return 'NEWS'; // Default fallback
}

function formatDate(dateStr: string) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) return 'Today';
        return `${diffDays}d`;
    } catch {
        return 'Soon';
    }
}

// Check specific market for resolution
export async function fetchMarketResult(id: number): Promise<'yes' | 'no' | null> {
    try {
        // Only valid for real Polymarket IDs
        if (id < 10000) return null; // Skip snapshot/fake IDs

        const targetUrl = `/api/markets?id=${id}`;
        // Note: The API route needs to support single ID fetching or filtering. 
        // Current API route just passes query params, so this goes to Polymarket as &id=...
        // Polymarket Gamma API usually filters by ID if provided.

        const response = await fetch(targetUrl);
        if (!response.ok) return null;

        const events: PolymarketEvent[] = await response.json();
        const event = events.find(e => e.markets.some(m => m.id === id.toString()));

        if (!event) return null;

        const market = event.markets.find(m => m.id === id.toString());
        if (!market) return null;

        // Heuristic: Check prices if market is expired
        const now = new Date();
        const endDate = new Date(market.endDate);

        // If it's been over 2 hours since end date, check for price convergence
        if (now > endDate) {
            const yesPrice = parseFloat(market.outcomePrices[0]);
            const noPrice = parseFloat(market.outcomePrices[1]);

            if (yesPrice > 0.95) return 'yes';
            if (noPrice > 0.95) return 'no';
        }

        return null;

    } catch (e) {
        console.error("Oracle check failed:", e);
        return null;
    }
}

/**
 * Smart Fetcher: hunts for markets ending < 24h.
 * FALLBACK: If not enough daily markets are found, it fills the rest with standard trending markets.
 */
export async function fetchDailyMarkets(requiredCount = 50): Promise<any[]> {
    let collected: any[] = [];
    let offset = 0;
    const batchSize = 100;
    const maxPages = 50; // Scan up to 5000 items (User Requested Deep Scan)

    console.log(`Starting prioritized search for ${requiredCount} daily markets...`);

    try {
        for (let i = 0; i < maxPages; i++) {
            // Strategy: FETCH BY END DATE (Ascending) to find markets closing soon
            // Filter: Must have some volume > $1000 to be worth showing (Increased threshold for quality)
            const batch = await fetchPolymarketTrending(batchSize, offset, 'endDate', true);

            if (batch.length === 0) break; // End of data

            // Filter this batch
            const dailyInBatch = batch.filter(m => {
                // Must have significant volume (Avoids junk)
                if (m.totalVolume < 1000) return false;

                if (!m.endDate) return false;
                const end = new Date(m.endDate).getTime();
                const now = Date.now();
                const hoursLeft = (end - now) / (1000 * 60 * 60);

                // Must be ending in future, but within 24h
                return hoursLeft > 0 && hoursLeft <= 24;
            });

            // Add unique items
            for (const item of dailyInBatch) {
                if (!collected.find(c => c.id === item.id)) {
                    collected.push(item);
                }
            }

            console.log(`Page ${i + 1}: Found ${dailyInBatch.length} valid daily markets. Total: ${collected.length}/${requiredCount}`);

            if (collected.length >= requiredCount) break;

            offset += batchSize;
            await delay(150); // Polite rate limit
        }
    } catch (e) {
        console.warn("Error during strict scan loop:", e);
    }

    // --- FALLBACK MECHANISM ---
    if (collected.length < requiredCount) {
        console.warn(`Strict filter found only ${collected.length} markets. Filling with trending...`);
        try {
            // Fetch standard trending to fill the gaps
            const fallbackLimit = requiredCount - collected.length + 20; // Fetch a bit extra
            const trending = await fetchPolymarketTrending(fallbackLimit, 0);

            for (const item of trending) {
                if (collected.length >= requiredCount) break;
                if (!collected.find(c => c.id === item.id)) {
                    collected.push(item);
                }
            }
        } catch (e) {
            console.error("Fallback fetch failed:", e);
        }
    }

    // Sort by volume descending to ensure quality and consistency for all users
    return collected.sort((a, b) => b.totalVolume - a.totalVolume).slice(0, requiredCount);
}
