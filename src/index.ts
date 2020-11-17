import AvansCoin from "./AvansCoin";
import Transaction from "./Transaction";
import Wallet from "./Wallet";

const avansCoin = new AvansCoin(4, 50);

const joep = new Wallet('Joep');

while(true) {
    avansCoin.minePendingTransactions(joep);
}


