import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IBudget } from '../schemas/budget';

export const useBudgetStore = defineStore('budget', {
  state: () => {
    return {
      budgets: ref<Array<IBudget>>(
        [...Array(3).keys()].map((element, index) => ({
          id: `${index}`,
          month: `${index + 6}`,
          year: '2022',
          rows: [...Array(3).keys()].map((element, idx) => ({
            id: `${idx}`,
            category: {
              id: `${idx}`,
              name: `Category ${idx}`,
              isActive: true,
              isParent: false
            },
            budgeted: Math.random() * 1000,
            activity: Math.random() * 1000,
            balance: Math.random() * 1000,
            
          })),
        }))
      ),
    };
  },
  getters: {
    currentBudget: (state) => state.budgets[0], 
  },
  actions: {},
});
