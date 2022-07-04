import { defineStore } from 'pinia';

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
    };
  },
  getters: {},
  actions: {},
});
