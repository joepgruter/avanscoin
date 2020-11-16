import { expect } from 'chai';
import Block from '../src/Block';
import Transaction from '../src/Transaction';
import Wallet from '../src/Wallet';

describe('Block', function() {
    it('Can create a new instance of itself', function() {
        const block = new Block([], 0, 'test');
        expect(block.getPreviousBlockHash()).equal('test');
    });
    it('Can can be mined', function() {
        const block = new Block([], 0, 'test');
        block.mineBlock(2);
        expect(block.getTimestamp()).not.equal(undefined);
    });
    it('Mining difficulty of 3 results in hash starting with 3 zeroes', function() {
        const block = new Block([], 0, 'test');
        block.mineBlock(3);
        expect(block.getBlockHash().substring(0, 3)).equal('000');
    });
    it('Mining difficulty of 5 results in hash starting with 5 zeroes', function() {
        const block = new Block([], 0, 'test');
        block.mineBlock(5);
        expect(block.getBlockHash().substring(0, 5)).equal('00000');
    });
    it('Throws an error on getBlockHash() if block has not yet been mined', function() {
        const block = new Block([], 0, 'test');

        expect(function(){
            block.getBlockHash();
        }).to.throw('Cannot get block hash, block has not been mined');
    });
    it('Can return the block hash value if the block has been mined', function() {
        const block = new Block([], 0, 'test');
        block.mineBlock(3);
        expect(block.getBlockHash()).to.not.equal('null');
    });
    it('Can return an array of the transactions stored in the block', function() {
        const wallet1 = new Wallet('testOwner');
        const transactions = [
            new Transaction(null, wallet1, 12),
            new Transaction(null, wallet1, 43)
        ]
        const block = new Block(transactions, 0, 'test');
        expect(block.getTransactions()[0].amount).to.equal(12);
    });
    it('Calculates the hash automatically if the block is the genesis block', function() {
        const block = new Block([], 0, 'Genesis Block');
        expect(block.getBlockHash()).to.not.equal('null');
    });
});