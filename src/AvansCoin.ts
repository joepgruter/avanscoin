import Block from './Block';
import Transaction from './Transaction';
import Wallet from './Wallet';

export default class AvansCoin {
    chain: Array<Block> = [];
    pendingTransactions: Array<Transaction> = [];
    miningReward: number;
    miningDifficulty: number;

    private targetMiningTimeMs = 10000;
    private averageMiningTimeMs = 0;
    private mineTimesSinceRecheck: Array<number> = [];
    private difficultyRecheckBufferSize = 3;

    /**
     * Blockchain implementation that creates a chain of blocks that hold transactions. These block can be mined at a certain difficulty for a mining reward.
     * @param targetMiningTimeMs Target amount of ms to mine one block
     * @param miningDifficulty Initial mining difficulty
     * @param miningReward Amount of coins to be rewarded for minging one block
     */
    constructor(targetMiningTimeMs: number, miningDifficulty: number, miningReward: number) {
        this.targetMiningTimeMs = targetMiningTimeMs;
        this.miningDifficulty = miningDifficulty;
        this.miningReward = miningReward;
        const genesisBlock = this.createGenesisBlock();
        this.chain.push(genesisBlock);
    }

    /**
     * Creates the first block in the chain
     */
    createGenesisBlock(): Block {
        if (this.chain.length === 0) {
            const genesisBlock = new Block([], -1, "Genesis Block");
            genesisBlock.calculateHash();
            return genesisBlock;
        } else {
            throw new Error('Cannot create genesis block if chain is not empty');
        }
    }

    /**
     * Returns the last mined block in the chain
     */
    getLastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Mine the pending transactions to a new block in the chain for the set reward amount
     * @param rewardWallet Wallet that the mining reward is sent to
     */
    minePendingTransactions(rewardWallet: Wallet): void {
        console.log(`Mining new block...`);

        // Create new block containing current pending transactions
        const newBlock = new Block(this.pendingTransactions, this.getLastBlock().getBlockHash());
        
        // Start mining the created block
        newBlock.mineBlock(this.miningDifficulty);

        // Add the block to the chain when mining is done
        this.chain.push(newBlock);
        console.log(`Mining took ${Math.floor((newBlock.getMineTimeMs() / 1000) * 1000) / 1000}s on difficulty ${this.miningDifficulty}`);

        // Add the mining time to the array of the last 50 mined blocks
        if (this.mineTimesSinceRecheck.length < 50) {
            this.mineTimesSinceRecheck.push(newBlock.getMineTimeMs());
        } else {
            this.mineTimesSinceRecheck.shift();
            this.mineTimesSinceRecheck.push(newBlock.getMineTimeMs());
        }

        // Update average mining time
        this.averageMiningTimeMs = this.mineTimesSinceRecheck.reduce((a, b) => a + b) / this.mineTimesSinceRecheck.length - 1;
        console.log(`Average mining time is now ${Math.floor((this.averageMiningTimeMs / 1000) * 1000) / 1000}s over the last ${this.mineTimesSinceRecheck.length} blocks`);

        // Check if the mining difficulty matches the target mining time after the last 10 blocks
        if (this.mineTimesSinceRecheck.length >= this.difficultyRecheckBufferSize) {

            // Get the percentage of the average mining time vs the targeted mining time
            const offsetPercentage = this.averageMiningTimeMs / this.targetMiningTimeMs;
            console.log(`Offsetpercentage: ${offsetPercentage}`);

            if (offsetPercentage > 1.5) {
                console.log(`Mining seems too difficult (${Math.floor((this.averageMiningTimeMs / 1000) * 1000) / 1000}s vs targeted ${this.targetMiningTimeMs / 1000}s), decreasing difficulty from ${this.miningDifficulty} to ${this.miningDifficulty - 1}`);
                
                // Decrease mining difficulty with 1
                this.miningDifficulty--;

                // Reset the average counter
                this.mineTimesSinceRecheck = [];
            } else if (offsetPercentage < 0.5) {
                console.log(`Mining seems too easy (${Math.floor((this.averageMiningTimeMs / 1000) * 1000) / 1000}s vs targeted ${this.targetMiningTimeMs / 1000}s), increasing difficulty from ${this.miningDifficulty} to ${this.miningDifficulty + 1}`);
                
                // Increase mining difficulty with 1
                this.miningDifficulty++;

                // Reset the average counter
                this.mineTimesSinceRecheck = [];
            } else {
                console.log(`Difficulty does not need to change`);                
            }
        }

        // Add minging reward transaction to the pending transactions array
        this.pendingTransactions = [
            new Transaction(null, rewardWallet, this.miningReward)
        ];
        console.log();
    }

    /**
     * Returns an array of transactions that have not been mined yet
     */
    getPendingTransactions(): Array<Transaction> {
        return this.pendingTransactions;
    }

    /**
     * Create a new transaction and add it to the array of pending transactions
     * @param transaction Transaction to be created
     */
    createTransaction(transaction: Transaction): void {
        if (this.getWalletBalance(transaction.from) > transaction.amount) {
            this.pendingTransactions.push(transaction);
        } else {
            throw new Error('Balance not sufficient for transaction');
        }
    }

    /**
     * Walk through the chain to fetch all incoming and outgoing transactions from a given wallet
     * @param wallet Wallet to fetch the transactions from
     */
    getWalletTransactions(wallet: Wallet): Array<Transaction> {
        const transactions = [];

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from?.address === wallet.address || transaction.to.address === wallet.address) {
                    transactions.push(transaction);
                }
            }
        }

        return transactions;
    }

    /**
     * Walk through the chain to calculate the balance for a certain wallet by calculating all it's transactions
     * @param wallet Wallet to calculate balance for
     */
    getWalletBalance(wallet: Wallet): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from?.address === wallet.address) {
                    balance -= transaction.amount;
                }
                if (transaction.to.address === wallet.address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Calculate the total amount of coins mined since the creation of the chain
     */
    getTotalAmountMined(): number {
        let total = 0;

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from === null) {
                    total += transaction.amount;
                }
            }
        }

        return total;
    }

    /**
     * Checks if the chain is still valid by checking the hashes of each block
     */
    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate block hash to check if the set hash value is still valid
            if (currentBlock.getBlockHash() !== currentBlock.calculateHash()) {
                console.error(`Actual block hash value not equal to set block hash value`, currentBlock, currentBlock.calculateHash());
                return false;
            }

            // Check if the set previous block hash is equal to the actual previous block
            if (currentBlock.getPreviousBlockHash() !== previousBlock.getBlockHash()) {
                console.error(`Actual previous block hash value not equal to set previous block value`, currentBlock, previousBlock);
                return false;
            }
        }

        return true;
    }
}