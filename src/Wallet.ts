export default class Wallet {
    owner: string;
    address: string;

    /**
     * Creates a wallet tied to a name with an unique address
     * @param owner Name of the wallet owner
     */
    constructor(owner: string) {
        this.owner = owner;
        this.address = [...Array(25)].map(()=>(~~(Math.random()*36)).toString(36)).join('');
    }
}