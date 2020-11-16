import { expect } from 'chai';
import AvansCoin from '../src/AvansCoin';
import Transaction from '../src/Transaction';
import Wallet from '../src/Wallet';

describe('AvansCoin', function () {

    context('constructor()', function () {
        it('Can create a new instance of itself', function () {
            const avansCoin = new AvansCoin(3, 50);
            expect(avansCoin.miningDifficulty).equal(3);
            expect(avansCoin.miningReward).equal(50);
        });
        it('Creates a genesis block on initialisation', function () {
            const avansCoin = new AvansCoin(3, 50);
            expect(avansCoin.chain[0].getPreviousBlockHash()).equal('Genesis Block');
        });
    });

    context('createGenesisBlock()', function () {
        it('Cannot create a genesis block if the chain is not empty', function () {
            const avansCoin = new AvansCoin(3, 50);
            expect(function () {
                avansCoin.createGenesisBlock();
            }).throws('Cannot create genesis block if chain is not empty');
        });
    });

    context('getLastBlock()', function () {
        it('Can return the last block in the chain', function () {
            const avansCoin = new AvansCoin(3, 50);
            expect(avansCoin.getLastBlock().getPreviousBlockHash()).equal('Genesis Block');
        });
    });

    context('minePendingTransactions()', function () {
        it('Can mine a new block and add it to the chain', function () {
            const avansCoin = new AvansCoin(3, 50);
            const rewardWallet = new Wallet('testOwner');
            avansCoin.minePendingTransactions(rewardWallet);
            expect(avansCoin.chain.length).equal(2);
        });
        it('Ads a new reward transaction to the pending transactions to the wallet of the last mined block', function () {
            const avansCoin = new AvansCoin(3, 50);
            const rewardWallet = new Wallet('testOwner');
            avansCoin.minePendingTransactions(rewardWallet);
            expect(avansCoin.getPendingTransactions()[0].to.address).equal(rewardWallet.address);
        });
    });

    context('createTransaction()', function () {
        it('Can add a transaction to the pending transactions array', function () {
            const avansCoin = new AvansCoin(3, 50);
            const wallet1 = new Wallet('testOwner 1');
            const wallet2 = new Wallet('testOwner 2');
            const transaction = new Transaction(wallet1, wallet2, 1);

            // Mine two new blocks on behalf of testOwner 1 to make sure balance is sufficient
            avansCoin.minePendingTransactions(wallet1);
            avansCoin.minePendingTransactions(wallet1);

            avansCoin.createTransaction(transaction);

            expect(avansCoin.getPendingTransactions()[1].to.address).equal(wallet2.address);
        });
        it('Can reject a transaction if the wallet balance is insufficient', function () {
            const avansCoin = new AvansCoin(3, 50);
            const wallet1 = new Wallet('testOwner 1');
            const wallet2 = new Wallet('testOwner 2');
            const transaction = new Transaction(wallet1, wallet2, 1);

            expect(function () {
                avansCoin.createTransaction(transaction);
            }).throw('Balance not sufficient for transaction');
        });
    });

    context('getWalletTransactions()', function() {
        it('Returns an empty array if the given wallet has no transactions in the chain', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            expect(avansCoin.getWalletTransactions(wallet).length).equal(0);
        });
        it('Returns an empty array if the given wallet has no transactions in the chain but has transactions in the pending transactions array', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);

            expect(avansCoin.getWalletTransactions(wallet).length).equal(0);
        });
        it('Returns an array of transactions is the given wallet has mined transactions in the chain', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);
            avansCoin.minePendingTransactions(wallet);

            expect(avansCoin.getWalletTransactions(wallet).length).equal(1);
        });
    });
    
    context('getWalletBalance()', function() {
        it('Returns 0 if the given wallet has no transactions in the chain', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            expect(avansCoin.getWalletBalance(wallet)).equal(0);
        });
        it('Returns 0 if the given wallet has no transactions in the chain but has transactions in the pending transactions array', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);

            expect(avansCoin.getWalletBalance(wallet)).equal(0);
        });
        it('Returns 50 if the given wallet has one reward transaction mined to the chain', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);
            avansCoin.minePendingTransactions(wallet);

            expect(avansCoin.getWalletBalance(wallet)).equal(50);
        });
        it('Returns 90 if the given wallet has 2 reward transaction and 1 outgoing transaction of 10 coins mined to the chain', function() {
            const avansCoin = new AvansCoin(3, 50);
            const wallet1 = new Wallet('testOwner 1');
            const wallet2 = new Wallet('testOwner 2');
            const transaction = new Transaction(wallet1, wallet2, 10);

            avansCoin.minePendingTransactions(wallet1);
            avansCoin.minePendingTransactions(wallet1);
            
            avansCoin.createTransaction(transaction);
            
            avansCoin.minePendingTransactions(wallet1);

            expect(avansCoin.getWalletBalance(wallet1)).equal(90);
        });
    });

    context('getTotalAmountMined()', function() {
        it('Returns 0 if no blocks have been mined', function(){
            const avansCoin = new AvansCoin(3, 50);
            expect(avansCoin.getTotalAmountMined()).equal(0);
        });
        it('Returns 50 if the first reward transaction has been', function(){
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);
            avansCoin.minePendingTransactions(wallet);

            expect(avansCoin.getTotalAmountMined()).equal(50);
        });
    });

    context('isChainValid()', function(){
        it('Returns true if the chain only contains the genesis block', function(){
            const avansCoin = new AvansCoin(3, 50);
            expect(avansCoin.isChainValid()).equal(true);
        });
        it('Returns true if the chain contains 3 valid blocks', function(){
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);
            avansCoin.minePendingTransactions(wallet);
            
            expect(avansCoin.isChainValid()).equal(true);
        });
        it('Returns true if the the hash of a block has been changed', function(){
            const avansCoin = new AvansCoin(3, 50);
            const wallet = new Wallet('testOwner');

            avansCoin.minePendingTransactions(wallet);
            avansCoin.minePendingTransactions(wallet);

            avansCoin.chain[1].mineBlock(4);

            expect(avansCoin.isChainValid()).equal(false);
        });
    });
});