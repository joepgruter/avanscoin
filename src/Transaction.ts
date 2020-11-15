import Wallet from "./Wallet";
import { sha256 } from 'js-sha256';

export default class Transaction {
    from: Wallet;
    to: Wallet;
    amount: number;

    constructor(from: Wallet, to: Wallet, amount: number) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHash() {
        return sha256(this.from.address + this.to.address + this.amount);
    }

    signTransaction(siginingKey: string) {

    }
}