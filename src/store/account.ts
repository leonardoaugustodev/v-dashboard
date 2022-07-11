import { defineStore } from 'pinia';
import { IAccount } from '../schemas/account';
import { generateId } from '../utils/hash';

export const useAccountStore = defineStore('account', {
  state: () => {
    return {
      accountTypes: [
        {
          label: 'Checking',
          value: 'checking',
        },

        { label: 'Credit', value: 'credit' },
        {
          label: 'Saving',
          value: 'saving',
        },
        {
          label: 'Mortgage',
          value: 'mortgage',
        },
        {
          label: 'Cash',
          value: 'cash',
        },
        {
          label: 'Investiment',
          value: 'investiment',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      accounts: <Array<IAccount>>[],
    };
  },
  getters: {},
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
  persist: true
});
