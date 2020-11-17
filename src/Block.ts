import { sha256 } from 'js-sha256';
import { performance } from 'perf_hooks';
import Transaction from "./Transaction";

/**
 * Creates a Block that holds an array of transactions that can be mined
 */
export default class Block {
    private timestamp: Date;
    private transactions: Transaction[];
    private nonce = 0;
    private blockHash = 'null';
    private previousBlockHash: string;
    /**
     * Amount of miliseconds the block took to mine
     */
    private mineTimeMs: number;

    /**
     * Creates a Block that holds an array of transactions that can be mined
     * @param transactions Array of transactions to be included in the block
     * @param previousBlockHash The hash of the last mined block on the chain
     */
    constructor(transactions: Transaction[], previousBlockHash: string) {
        this.transactions = transactions;
        this.previousBlockHash = previousBlockHash;

        // Calculate the hash here if this block is the genesis block
        if (previousBlockHash === 'Genesis Block') this.blockHash = this.calculateHash();
    }

    /**
     * Brute force calculate the hash of the current block until the set amount of zeroes has been found
     * @param difficulty Number of zeroes required at the start of the hash
     */
    mineBlock(difficulty: number): void {
        // Get current high resolution timestamp for measuring mining time
        const t0 = performance.now();

        while (this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.timestamp = new Date();
            this.nonce++;
            this.blockHash = this.calculateHash();
        }

        // Get current high resolution timestamp and calculate mining time
        const t1 = performance.now();
        this.mineTimeMs = t1 - t0;
    }

    /**
     * Calculate the hash value of the current block using the sha256 algorithm
     */
    calculateHash(): string {
        return sha256(this.timestamp + this.previousBlockHash + JSON.stringify(this.transactions) + this.nonce);
    }

    /**
     * Return the calculated hash of the current block
     */
    getBlockHash(): string {
        if (this.blockHash !== 'null') return this.blockHash;
        else throw new Error('Cannot get block hash, block has not been mined');
    }

    /**
     * Return the calculated hash of the previous block in the chain
     */
    getPreviousBlockHash(): string {
        return this.previousBlockHash;
    }

    /**
     * Return an array of the transactions that are registered in the current block
     */
    getTransactions(): Array<Transaction> {
        return this.transactions;
    }

    getMineTimeMs(): number {
        return this.mineTimeMs;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }
}
