import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ITransaction } from '../schemas/transaction';

export const useTransactionStore = defineStore('transaction', {
  state: () => {
    return {
      transactions: ref<Array<ITransaction>>(
        [...Array(10).keys()].map((element, index) => ({
          id: `${index}`,
          date: new Date().toISOString(),
          account: {
            id: `${index}`,
            name: `Account ${index}`,
            type: 'Checking',
            on_budget: true,
            status: 'Open',
            balance: Math.random() * 100000,
          },
          memo: `Random memo ${index}`,
          category: {
            id: `${index}`,
            name: `Category ${index}`,
            isActive: true,
          },
          inflow: Math.random() * 10000,
          outflow: Math.random() * 10000,
        }))
      ),
    };
  },
  getters: {},
  actions: {},
});
