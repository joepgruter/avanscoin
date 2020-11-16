import AvansCoin from "./AvansCoin";
import Transaction from "./Transaction";
import Wallet from "./Wallet";

const avansCoin = new AvansCoin(5, 50);

const joep = new Wallet('Joep');
const erdem = new Wallet('Erdem');

avansCoin.minePendingTransactions(joep);
avansCoin.minePendingTransactions(joep);
avansCoin.minePendingTransactions(erdem);
avansCoin.minePendingTransactions(erdem);

avansCoin.createTransaction(new Transaction(joep, erdem, 12));
avansCoin.createTransaction(new Transaction(erdem, joep, 2.15));

avansCoin.minePendingTransactions(joep);

console.log('Wallet balance for Joep: ', avansCoin.getWalletBalance(joep));
console.log('Wallet balance for Erdem: ', avansCoin.getWalletBalance(erdem));

console.log('Transactions for Joep: ', avansCoin.getWalletTransactions(joep));
console.log('Total amount of AvansCoins mined: ', avansCoin.getTotalAmountMined());

console.log(avansCoin);
