import AvansCoin from "./AvansCoin";
import Wallet from "./Wallet";

const avansCoin = new AvansCoin(10000, 4, 50);

const joep = new Wallet('Joep');

while(true) {
    avansCoin.minePendingTransactions(joep);
}
