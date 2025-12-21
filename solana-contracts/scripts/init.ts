import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Polybet } from "../target/types/polybet";
import { PublicKey } from "@solana/web3.js";

async function main() {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Polybet as Program<Polybet>;

    console.log("Initializing Polybet Protocol Config...");

    // --- CONFIGURATION ---
    const devVault = provider.wallet.publicKey; // Dev fees go to the deployer by default
    const tokenMint = new PublicKey("6ZFUNyPDn1ycjhb3RbNAmtcVvwp6oL4Zn6GswnGupump"); // $PREDICT mint
    // ---------------------

    const [configPda] = await PublicKey.findProgramAddress(
        [Buffer.from("config")],
        program.programId
    );

    try {
        const tx = await program.methods
            .initializeConfig(devVault, tokenMint)
            .accounts({
                config: configPda,
                authority: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        console.log("Successfully initialized protocol config!");
        console.log("Transaction Signature:", tx);
        console.log("Config PDA:", configPda.toString());
        console.log("Dev Vault:", devVault.toString());
    } catch (e) {
        console.error("Initialization failed. It might already be initialized.");
        console.error(e);
    }
}

main().then(
    () => process.exit(0),
    (err) => {
        console.error(err);
        process.exit(1);
    }
);
