use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub authority: Pubkey,       // 32: Who can resolve this market
    pub question: String,        // 4 + len: The prediction question
    pub end_timestamp: i64,      // 8: When betting closes
    pub outcomes_count: u8,      // 1: Number of outcomes (2-8)
    pub total_pot: u64,          // 8: Total liquidity in base units
    pub outcome_totals: [u64; 8],// 64: Total bets per outcome (max 8)
    pub resolved: bool,          // 1: Is it over?
    pub winner_index: Option<u8>,// 2: Which outcome won (0-7)
    pub fees_distributed: bool,  // 1: Have fees been claimed?
    pub bump: u8,                // 1: PDA bump
}

#[account]
pub struct Vote {
    pub user: Pubkey,            // 32: Who placed the bet
    pub market: Pubkey,          // 32: Which market
    pub outcome_index: u8,       // 1: 0=Yes, 1=No
    pub amount: u64,             // 8: How much they staked
    pub claimed: bool,           // 1: Did they cash out?
    pub bump: u8,                // 1: PDA bump
}

impl Market {
    // Helper to estimate space (supports up to 8 outcomes)
    pub const SPACE: usize = 8 + 32 + (4 + 64) + 8 + 1 + 8 + 64 + 1 + 2 + 1 + 1;
    pub const MAX_OUTCOMES: usize = 8;
}

impl Vote {
    pub const SPACE: usize = 8 + 32 + 32 + 1 + 8 + 1 + 1;
}
