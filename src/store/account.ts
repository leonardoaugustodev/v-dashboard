import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../database/firebase';
import { defineStore } from 'pinia';
import { IAccount } from '../schemas/account';
import { generateId } from '../utils/hash';
import { useTransactionStore } from './transaction';
import { useUserStore } from './user';

export const useAccountStore = defineStore('account', {
  state: () => {
    return {
      accountTypes: [
        {
          label: 'Checking',
          value: 'Checking',
        },

        { label: 'Credit Card', value: 'Credit Card' },
        {
          label: 'Saving',
          value: 'Saving',
        },
        {
          label: 'Mortgage',
          value: 'Mortgage',
        },
        {
          label: 'Cash',
          value: 'Cash',
        },
        {
          label: 'Investiment',
          value: 'Investiment',
        },
        {
          label: 'Other',
          value: 'Other',
        },
      ],
      accounts: <Array<IAccount>>[],
    };
  },
  getters: {
    getAccount(state) {
      return (accountId: string) =>
        state.accounts.find((c) => c._id === accountId);
    },
    getAccountsPicklist(state) {
      return state.accounts.flatMap((acc) => {
        if (acc.status === 'Active') {
          return {
            label: acc.name,
            value: acc._id,
          };
        }
        return [];
      });
    },
    getSummaryValues() {
      return (accountId: string) => {
        const transactionStore = useTransactionStore();

        const transactions =
          transactionStore.getTransactionsByAccountId(accountId);
        const cleared = transactions?.filter((t) => t.cleared);
        const uncleared = transactions?.filter((t) => !t.cleared);

        const clearedTotal = cleared?.reduce((acc, cv) => {
          return acc + (cv.inflow - cv.outflow);
        }, 0);

        const unclearedTotal = uncleared?.reduce((acc, cv) => {
          return acc + (cv.inflow - cv.outflow);
        }, 0);

        return {
          cleared: clearedTotal || 0,
          uncleared: unclearedTotal || 0,
          total: (clearedTotal || 0) + (unclearedTotal || 0),
        };
      };
    },
  },
  actions: {
    async load() {
      const userStore = useUserStore();
      const accountDocs = await getDocs(
        query(
          collection(db, 'accounts'),
          where('userId', '==', userStore.user.uid)
        )
      );
      this.accounts = [];
      accountDocs.forEach((doc) => {
        this.accounts.push(<IAccount>doc.data());
      });
    },
    async save(account: IAccount) {
      const userStore = useUserStore();
      if (account._id) {
        const index = this.accounts.findIndex((acc) => acc._id === account._id);

        const mergedAccount = {
          ...this.accounts[index],
          ...account,
        };

        await updateDoc(doc(db, 'accounts', mergedAccount._id), mergedAccount);

        this.accounts.splice(index, 1, mergedAccount);
      } else {
        try {
          const newAccount = {
            _id: generateId('account'),
            userId: userStore.user.uid,
            ...account,
          };

          await setDoc(doc(db, 'accounts', newAccount._id), newAccount);

          this.accounts.push(newAccount);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      }
    },
    async delete(accountId: string) {
      const index = this.accounts.findIndex((c) => c._id === accountId);

      try {
        const account = this.accounts[index];
        await deleteDoc(doc(db, 'accounts', accountId));
        this.accounts.splice(index, 1);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    },
  },
});
