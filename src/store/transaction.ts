import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../database/firebase';
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
        state.transactions
          .filter((c) => c.accountId === accountId)
          .map((t) => {
            if (t.accountId) {
              t.account = accountStore.getAccount(t.accountId);
            }

            if (t.categoryId) {
              t.category = categoryStore.getCategory(t.categoryId);
            }

            return t;
          });
    },
  },
  actions: {
    async load() {
      const transactionDocs = await getDocs(collection(db, 'transactions'));
      this.transactions = [];
      transactionDocs.forEach((doc) => {
        this.transactions.push(<ITransaction>doc.data());
      });
    },
    async save(transaction: ITransaction) {
      if (transaction._id) {
        const index = this.transactions.findIndex(
          (acc) => acc._id === transaction._id
        );
        const mergedTransaction = {
          ...this.transactions[index],
          ...transaction,
        };
        await updateDoc(
          doc(db, 'transactions', mergedTransaction._id),
          mergedTransaction
        );

        this.transactions.splice(index, 1, mergedTransaction);
      } else {
        const newTransaction = {
          _id: generateId('transaction'),
          ...transaction,
        };
        await setDoc(doc(db, 'transactions', newTransaction._id), newTransaction);

        this.transactions.push(newTransaction);
      }
    },
    clear(transactionId: string, clearOrUnclear: boolean) {
      const transaction = this.transactions.find(
        (t) => t._id === transactionId
      );
      if (transaction) {
        transaction.cleared = clearOrUnclear;
      }
    },
    async delete(transactionId: string) {
      const index = this.transactions.findIndex((c) => c._id === transactionId);

      try {
        await deleteDoc(doc(db, 'transactions', transactionId));
        this.transactions.splice(index, 1);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    },
  },
  // persist: true,
});
