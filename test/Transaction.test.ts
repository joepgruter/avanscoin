import { expect } from 'chai';
import Transaction from '../src/Transaction';
import Wallet from '../src/Wallet';

describe('Transaction', function () {
    it('Can create a new instance of itself', function () {
        const wallet1 = new Wallet('testOwner 1');
        const wallet2 = new Wallet('testOwner 2');
        const transaction = new Transaction(wallet1, wallet2, 1);
        expect(transaction.from.owner).equal('testOwner 1');
        expect(transaction.to.owner).equal('testOwner 2');
    });
    it('Can create a transaction from a wallet with value null', function () {
        const wallet = new Wallet('testOwner');
        const transaction = new Transaction(null, wallet, 1);
        expect(transaction.to.owner).equal('testOwner');
    });
    it('Can not create a transaction to a wallet with value null', function () {
        const wallet = new Wallet('testOwner');
        expect(function () {
            new Transaction(wallet, null, 1);
        }).to.throw('Transaction has to go to a valid wallet instance');
    });
    it('Can not create a transaction with a negative amount', function () {
        const wallet = new Wallet('testOwner');
        expect(function () {
            new Transaction(null, wallet, -1);
        }).to.throw('Transaction amount can not be negative');
    });
    it('Can calculate the hash of a transaction from a null wallet', function () {
        const wallet = new Wallet('testOwner');
        const transaction = new Transaction(null, wallet, 1);
        expect(transaction.calculateHash().length).equal(64);
    });
    it('Can calculate the hash of a transaction from a regular wallet', function () {
        const wallet1 = new Wallet('testOwner 1');
        const wallet2 = new Wallet('testOwner 2');
        const transaction = new Transaction(wallet1, wallet2, 0);
        expect(transaction.calculateHash().length).equal(64);
    });
});