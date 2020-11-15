import { sha256 } from 'js-sha256';
import Transaction from "./Transaction";


export default class Block {
    private timestamp: Date;
    private transactions: Transaction[];
    private nonce: number;
    private blockHash: string;
    private previousBlockHash: string;

    constructor(transactions: Transaction[], nonce: number, previousBlockHash: string) {
        this.transactions = transactions;
        this.nonce = nonce;
        this.previousBlockHash = previousBlockHash;
        this.blockHash = this.calculateHash();
    }

    mineBlock(difficulty: number) {
        console.log(`Mining new block...`);

        while(this.blockHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.blockHash = this.calculateHash();
            this.nonce++;
        }
        
        this.timestamp = new Date();

        console.log(`New block mined: ${this.blockHash}`);
    }

    calculateHash(): string {
        return sha256(this.timestamp + this.previousBlockHash + JSON.stringify(this.transactions) + this.nonce);
    }

    getBlockHash(): string {
        return this.blockHash;
    }

    getPreviousBlockHash(): string {
        return this.previousBlockHash;
    }

    getTransactions(): Array<Transaction> {
        return this.transactions;
    }

    toString(): string {
        return `Block - ${this.timestamp.toUTCString()} - Hash: ${this.blockHash} - Previous Hash: ${this.previousBlockHash} - Transactions: ${JSON.stringify(this.transactions)}`;
    }
}
