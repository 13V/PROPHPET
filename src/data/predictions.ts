export interface Prediction {
    id: number;
    question: string;
    category: string;
    deadline: string;
    yesVotes: number;
    noVotes: number;
}

export const dailyPredictions: Prediction[] = [
    {
        id: 1,
        question: "Will Bitcoin close above $98,000 today?",
        category: "BTC",
        deadline: "Today, 23:59 UTC",
        yesVotes: 1247,
        noVotes: 583,
    },
    {
        id: 2,
        question: "Will Ethereum break $3,900 today?",
        category: "ETH",
        deadline: "Today, 23:59 UTC",
        yesVotes: 892,
        noVotes: 654,
    },
    {
        id: 3,
        question: "Will Solana flip BNB in market cap today?",
        category: "SOL",
        deadline: "Today, 23:59 UTC",
        yesVotes: 743,
        noVotes: 891,
    },
    {
        id: 4,
        question: "Will DOGE pump >5% in the next 24h?",
        category: "MEME",
        deadline: "Tomorrow, 12:00 UTC",
        yesVotes: 1523,
        noVotes: 1102,
    },
    {
        id: 5,
        question: "Will PEPE reach a new local high today?",
        category: "MEME",
        deadline: "Today, 23:59 UTC",
        yesVotes: 2341,
        noVotes: 892,
    },
    {
        id: 6,
        question: "Will total crypto market cap hit $3.5T today?",
        category: "MARKET",
        deadline: "Today, 23:59 UTC",
        yesVotes: 1876,
        noVotes: 1234,
    },
];
