import { sha256 } from 'js-sha256';
import Transaction from "./Transaction";

/**
 * Creates a Block that holds an array of transactions that can be mined
 */
export default class Block {
    private timestamp: Date;
    private transactions: Transaction[];
    private nonce: number;
    private blockHash = 'null';
    private previousBlockHash: string;

    constructor(transactions: Transaction[], nonce: number, previousBlockHash: string) {
        this.transactions = transactions;
        this.nonce = nonce;
        this.previousBlockHash = previousBlockHash;

        // Calculate the hash here if this block is the genesis block
        if(previousBlockHash === 'Genesis Block') this.blockHash = this.calculateHash();
    }

    /**
     * Brute force calculate the hash of the current block until the set amount of zeroes has been found
     * @param difficulty Number of zeroes required at the start of the hash
     */
    mineBlock(difficulty: number): void {
        console.log(`Mining new block...`);

        while(this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.blockHash = this.calculateHash();
            this.nonce++;
        }
        
        this.timestamp = new Date();

        console.log(`New block mined: ${this.blockHash}`);
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
        if(this.blockHash !== 'null') return this.blockHash;
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

    getTimestamp(): Date {
        return this.timestamp;
    }

    toString(): string {
        return `Block - ${this.timestamp.toUTCString()} - Hash: ${this.blockHash} - Previous Hash: ${this.previousBlockHash} - Transactions: ${JSON.stringify(this.transactions)}`;
    }
}
