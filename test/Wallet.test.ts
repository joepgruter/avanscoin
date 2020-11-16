import { expect } from 'chai';
import Wallet from '../src/Wallet';

describe('Wallet', function () {
    it('Can create a new instance of itself', function () {
        const wallet1 = new Wallet('testOwner 1');
        expect(wallet1.owner).equal('testOwner 1');
    });
    it('Creates a unique address of 25 characters', function () {
        const wallet1 = new Wallet('testOwner 1');
        expect(wallet1.address).not.to.equal(undefined);
        expect(wallet1.address.length).to.equal(25);
    });
});