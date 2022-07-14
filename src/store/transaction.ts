import { defineStore } from 'pinia';
import { ITransaction } from '../schemas/transaction';
import { generateId } from '../utils/hash';
import { useAccountStore } from './account';
import { useCategoryStore } from './category';

export const useTransactionStore = defineStore('transaction', {
  state: () => {
    return {
      transactions: <Array<ITransaction>>[],
    };
  },
  getters: {
    getTransactionsByAccountId(state) {
      const categoryStore = useCategoryStore();
      const accountStore = useAccountStore();

      return (accountId: string) =>
        state.transactions.filter((c) => c.accountId === accountId).map(t => {
          if(t.accountId){
            t.account = accountStore.getAccount(t.accountId);
          }

          if(t.categoryId){
            t.category = categoryStore.getCategory(t.categoryId);
          }

          return t;
        });
    },
  },
  actions: {
    save(transaction: ITransaction) {
      if (transaction._id) {
        const index = this.transactions.findIndex(
          (acc) => acc._id === transaction._id
        );

        this.transactions.splice(index, 1, {
          ...this.transactions[index],
          ...transaction,
        });
      } else {
        this.transactions.push({
          _id: generateId('transaction'),
          ...transaction,
        });
      }
    },
  },
  persist: true,
});
