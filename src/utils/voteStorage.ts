export interface Vote {
    predictionId: number;
    choice: 'yes' | 'no';
    walletAddress: string;
    timestamp: number;
}

const VOTES_KEY = 'omen_votes';

/**
 * Save a vote to localStorage
 */
export function saveVote(vote: Vote): void {
    const votes = getAllVotes();

    // Remove any existing vote for this prediction by this wallet
    const filteredVotes = votes.filter(
        v => !(v.predictionId === vote.predictionId && v.walletAddress === vote.walletAddress)
    );

    // Add new vote
    filteredVotes.push(vote);

    localStorage.setItem(VOTES_KEY, JSON.stringify(filteredVotes));
}

/**
 * Get all votes from localStorage
 */
export function getAllVotes(): Vote[] {
    if (typeof window === 'undefined') return [];

    const votesJson = localStorage.getItem(VOTES_KEY);
    if (!votesJson) return [];

    try {
        return JSON.parse(votesJson);
    } catch {
        return [];
    }
}

/**
 * Get a specific vote for a prediction by wallet
 */
export function getVote(predictionId: number, walletAddress: string): Vote | null {
    const votes = getAllVotes();
    return votes.find(
        v => v.predictionId === predictionId && v.walletAddress === walletAddress
    ) || null;
}

/**
 * Get vote counts for a prediction
 */
export function getVoteCounts(predictionId: number): { yes: number; no: number } {
    const votes = getAllVotes();
    const predictionVotes = votes.filter(v => v.predictionId === predictionId);

    return {
        yes: predictionVotes.filter(v => v.choice === 'yes').length,
        no: predictionVotes.filter(v => v.choice === 'no').length,
    };
}

/**
 * Clear all votes (for testing)
 */
export function clearAllVotes(): void {
    localStorage.removeItem(VOTES_KEY);
}
