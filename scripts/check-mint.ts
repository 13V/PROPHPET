import { Connection, PublicKey } from "@solana/web3.js";

const RPC_URL = "https://responsive-serene-mountain.solana-mainnet.quiknode.pro/3bbbfd1c58e3e0392db876741a554ba776af21d7/";
const MINT_ADDRESS = new PublicKey("4kTwv7sEEhdp9CZnw3B9h639HZwVygMmmxi6uuFLpump");

async function check() {
    const connection = new Connection(RPC_URL, "confirmed");
    const accountInfo = await connection.getAccountInfo(MINT_ADDRESS);
    if (accountInfo) {
        console.log("OWNER_PROGRAM:", accountInfo.owner.toBase58());
    } else {
        console.log("ACCOUNT_NOT_FOUND");
    }
}

check();
