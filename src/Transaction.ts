import Wallet from "./Wallet";
import { sha256 } from 'js-sha256';

/**
 * Creates a transaction with a certain amount to a certain wallet
 */
export default class Transaction {
    from: Wallet;
    to: Wallet;
    amount: number;

    constructor(from: Wallet, to: Wallet, amount: number) {
        if (to === null) {
            throw new Error('Transaction has to go to a valid wallet instance');
        }
        if (amount < 0) {
            throw new Error('Transaction amount can not be negative');
        }

        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    /**
     * Calculate the hash of the current transaction using the sha256 algorithm
     */
    calculateHash(): string {
        let fromAddress: string;
        if (this.from === null) fromAddress = 'null';
        else fromAddress = this.from.address;

        return sha256(fromAddress + this.to.address + this.amount);
    }

    // signTransaction(siginingKey: string): void {
    //     const s = siginingKey;
    //     s.length;
    // }
}