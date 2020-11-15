export default class Wallet {
    owner: string;
    address: string;

    constructor(owner: string) {
        this.owner = owner;
        this.address = [...Array(25)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    }
}