import { defineStore } from 'pinia';
import { IAccount } from '../schemas/account';
import { generateId } from '../utils/hash';
import { useTransactionStore } from './transaction';

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
    saveAccount(account: IAccount) {
      if (account._id) {
        const index = this.accounts.findIndex((acc) => acc._id === account._id);

        this.accounts.splice(index, 1, {
          ...this.accounts[index],
          ...account,
        });
      } else {
        this.accounts.push({
          _id: generateId('account'),
          ...account,
        });
      }
    },
  },
  persist: true,
});
