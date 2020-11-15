import Block from './Block';
import Transaction from './Transaction';
import Wallet from './Wallet';

export default class AvansCoin {
    chain: Array<Block> = [];
    miningDifficulty: number;
    miningReward: number;
    pendingTransactions: Array<Transaction> = [];

    constructor(miningDifficulty: number, miningReward: number) {
        this.miningDifficulty = miningDifficulty;
        this.miningReward = miningReward;
        const genesisBlock = this.createGenesisBlock();
        this.chain.push(genesisBlock);
    }

    createGenesisBlock(): Block {
        if (this.chain.length === 0) {
            const genesisBlock = new Block([], -1, "Genesis Block");
            return genesisBlock;
        } else {
            console.error('Cannot create genesis block if chain is not empty', this.chain.length);
        }
    }

    getLastBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(rewardWallet: Wallet) {
        const newBlock = new Block(this.pendingTransactions, 0, this.getLastBlock().getBlockHash());
        newBlock.mineBlock(this.miningDifficulty);
        this.chain.push(newBlock);

        this.pendingTransactions = [
            new Transaction(null, rewardWallet, this.miningReward)
        ];
    }

    createTransaction(transaction: Transaction) {
        if(this.getWalletBalance(transaction.from) > transaction.amount) {
            this.pendingTransactions.push(transaction);
        } else {
            console.error(`Not enough coins in wallet for transaction`);            
        }
    }

    getWalletTransactions(wallet: Wallet): Array<Transaction> {
        const transactions = [];

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from?.address === wallet.address || transaction.to.address === wallet.address) {
                    transactions.push(transaction);
                }
            }
        }

        return transactions;
    }

    getWalletBalance(wallet: Wallet): number {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from?.address === wallet.address) {
                    balance -= transaction.amount;
                }
                if (transaction.to.address === wallet.address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    getTotalAmountMined(): number {
        let total = 0;

        for (const block of this.chain) {
            for (const transaction of block.getTransactions()) {
                if (transaction.from === null) {
                    total += transaction.amount;
                }
            }
        }

        return total;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Recalculate block hash to check if the set hash value is still valid
            if (currentBlock.getBlockHash() !== currentBlock.calculateHash()) {
                console.error(`Actual block hash value not equal to set block hash value`, currentBlock, currentBlock.calculateHash());
                return false;
            }

            // Check if the set previous block hash is equal to the actual previous block
            if (currentBlock.getPreviousBlockHash() !== previousBlock.getBlockHash()) {
                console.error(`Actual previous block hash value not equal to set previous block value`, currentBlock, previousBlock);
                return false;
            }
        }

        return true;
    }

    toString(): string {
        let res = '';

        this.chain.forEach(block => {
            res = res + `${block.toString()}\n`;
        });

        return res;
    }
}