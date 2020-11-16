import { expect } from 'chai';
import AvansCoin from '../src/AvansCoin';
import Transaction from '../src/Transaction';
import Wallet from '../src/Wallet';

describe('AvansCoin', function () {
    it('Can create a new instance of itself', function () {
        const avansCoin = new AvansCoin(3, 50);
        expect(avansCoin.miningDifficulty).equal(3);
        expect(avansCoin.miningReward).equal(50);
    });
    it('Creates a genesis block on initialisation', function () {
        const avansCoin = new AvansCoin(3, 50);
        expect(avansCoin.chain[0].getPreviousBlockHash()).equal('Genesis Block');
    });
    it('Cannot create a genesis block if the chain is not empty', function () {
        const avansCoin = new AvansCoin(3, 50);
        expect(function(){
            avansCoin.createGenesisBlock();
        }).throws('Cannot create genesis block if chain is not empty');
    });
    it('Can return the last block in the chain', function () {
        const avansCoin = new AvansCoin(3, 50);
        expect(avansCoin.getLastBlock().getPreviousBlockHash()).equal('Genesis Block');
    });
    it('Can add a new transaction to the pending transaction array', function () {
        const avansCoin = new AvansCoin(3, 50);
        const wallet = new Wallet('testOwner');
        const transaction = new Transaction(null, wallet, 12);
        avansCoin.createTransaction(transaction);
        expect(avansCoin.getPendingTransactions()[0].to.address).equal(wallet.address);
    });
});