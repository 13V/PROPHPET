# OMEN Admin Panel Guide

## Accessing the Admin Panel

1. **Navigate to**: `http://localhost:3000/admin` (or `https://your-site.vercel.app/admin`)
2. **Connect your admin wallet** (Phantom/Solflare)
3. **Verify access** - Only authorized wallets can access

## Setting Up Admin Access

### Add Your Admin Wallet

1. **Get your wallet address**:
   - Open Phantom/Solflare
   - Copy your wallet address

2. **Update admin list** in `src/app/admin/page.tsx`:
   ```typescript
   const ADMIN_WALLETS = [
     'YOUR_ACTUAL_WALLET_ADDRESS_HERE',
     // Add more admin wallets here
   ];
   ```

3. **Redeploy** if already deployed

---

## Managing Predictions

### Closing a Prediction

1. **Navigate to admin panel**
2. **Find the prediction** you want to close
3. **Click "Close YES"** or **"Close NO"** based on the actual outcome
4. **Confirm** the action

**Example:**
- Prediction: "Will Bitcoin hit $100,000 by end of December 2025?"
- If BTC reaches $100k → Click "Close YES"
- If BTC doesn't reach $100k → Click "Close NO"

### Reopening a Prediction

If you made a mistake:
1. **Find the closed prediction**
2. **Click "Reopen"**
3. **Confirm** the action
4. **Close again** with correct outcome

---

## Calculating Rewards

### How Rewards Work

1. **Reward Pool**: Each prediction has a reward pool (default: 1000 $OMEN)
2. **Winners**: Users who voted for the correct outcome
3. **Distribution**: Reward pool split equally among all winners

**Formula:**
```
Reward per winner = Total Reward Pool / Number of Winners
```

**Example:**
- Reward Pool: 1000 $OMEN
- Winners: 50 users voted YES (correct)
- Each winner gets: 1000 / 50 = 20 $OMEN

### Viewing Reward Data

The admin panel shows:
- **Total Winners** - Number of users who voted correctly
- **Reward per Winner** - Amount each winner receives
- **Total Reward Pool** - Total $OMEN to distribute

---

## Exporting Rewards for Distribution

### Step 1: Export CSV

1. **Click "Export Rewards CSV"** button
2. **File downloads** automatically: `omen-rewards-[timestamp].csv`

### Step 2: Review CSV

Open the CSV file:
```csv
Wallet Address,Reward Amount
ABC123...,45.50
DEF456...,20.00
GHI789...,65.25
```

### Step 3: Distribute Rewards

#### Option A: Manual Airdrop (Phantom)
1. Open Phantom wallet
2. Go to Send
3. For each wallet in CSV:
   - Paste wallet address
   - Enter reward amount
   - Send $OMEN tokens

#### Option B: Bulk Airdrop (Recommended)
Use a bulk sender tool:
- **Solana Bulk Sender**: https://bulksender.app/
- **Streamflow**: https://streamflow.finance/
- **Upload CSV** and execute bulk transfer

---

## Changing Reward Pool Amount

### Per Prediction

Edit in `src/utils/rewardCalculation.ts`:
```typescript
export function calculateRewards(
  predictionId: number,
  totalRewardPool: number = 1000 // Change this number
)
```

### Different Amounts Per Prediction

You can set custom amounts when calling the function:
```typescript
// 500 $OMEN for prediction #1
calculateRewards(1, 500);

// 2000 $OMEN for prediction #2
calculateRewards(2, 2000);
```

---

## Admin Panel Features

### Dashboard Stats
- **Total Votes** - All votes across all predictions
- **Closed Predictions** - Number of predictions with outcomes set
- **Total Winners** - All users who won across all predictions
- **$OMEN Rewards** - Total rewards to be distributed

### Prediction Management
- **Close Prediction** - Set outcome (YES or NO)
- **Reopen Prediction** - Undo a closure
- **View Winners** - See who won each prediction
- **Calculate Rewards** - Automatic calculation

### Export Features
- **Download CSV** - Get wallet addresses and amounts
- **Aggregated Rewards** - If a user won multiple predictions, amounts are combined

---

## Best Practices

### 1. Verify Outcomes
- **Double-check** the actual outcome before closing
- **Use reliable sources** (CoinGecko, CoinMarketCap)
- **Document** your decision

### 2. Timing
- **Close predictions** shortly after deadline passes
- **Announce** closures on social media
- **Distribute rewards** within 24-48 hours

### 3. Communication
- **Tweet** when closing predictions
- **Share** winner count and total rewards
- **Thank** participants

### 4. Record Keeping
- **Save CSV files** for each distribution
- **Track** total rewards distributed
- **Monitor** wallet balance

---

## Troubleshooting

### "Access Denied"
- Verify your wallet address is in `ADMIN_WALLETS` array
- Check for typos in wallet address
- Redeploy after updating

### Rewards Not Calculating
- Ensure prediction is closed first
- Check that votes exist for that prediction
- Verify localStorage has vote data

### CSV Not Downloading
- Check browser download settings
- Try different browser
- Verify popup blockers aren't blocking

---

## Security Notes

1. **Keep admin wallet secure** - Use hardware wallet if possible
2. **Don't share admin access** - Only trusted team members
3. **Verify transactions** - Always review before sending
4. **Backup data** - Export CSVs regularly

---

## Future Enhancements

### Phase 2 (With Backend)
- Automatic outcome detection via oracles
- Scheduled reward distribution
- Email notifications to winners
- Transaction history tracking

### Phase 3 (On-Chain)
- Smart contract reward distribution
- Automatic payouts
- On-chain voting
- Verifiable outcomes
