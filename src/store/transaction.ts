import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../database/firebase';
import { defineStore } from 'pinia';
import { ITransaction } from '../schemas/transaction';
import { generateId } from '../utils/hash';
import { useAccountStore } from './account';
import { useCategoryStore } from './category';
import moment from 'moment';
import { useUserStore } from './user';

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
    getTransactionsByMonth(state) {
      return (month: number, year: number) =>
        state.transactions.filter((t) => {
          const date = moment(t.date);
          return date.month() === month && date.year() === year;
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
      const userStore = useUserStore();
      const momentDate = moment(transaction.date);
      transaction = {
        ...transaction,
        day: momentDate.date(),
        month: momentDate.month(),
        year: momentDate.year(),
      };

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
          userId: userStore.user.uid,
          ...transaction,
        };
        await setDoc(
          doc(db, 'transactions', newTransaction._id),
          newTransaction
        );

        this.transactions.push(newTransaction);
      }
    },
    async bulkSave(transactions: ITransaction[]) {
      try {
        const batch = writeBatch(db);

        transactions.forEach((t) => {
          const ref = doc(db, 'transactions', t._id);
          batch.update(ref, { ...t });
        });

        await batch.commit();
      } catch (error) {}
    },
    async clear(transactionId: string, clearOrUnclear: boolean) {
      const transaction = this.transactions.find(
        (t) => t._id === transactionId
      );
      if (transaction) {
        try {
          transaction.cleared = clearOrUnclear;

          await updateDoc(
            doc(db, 'transactions', transaction._id),
            transaction
          );
        } catch (e) {
          console.error('Error adding document: ', e);
        }
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
