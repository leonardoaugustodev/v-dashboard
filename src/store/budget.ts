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
          rows: [
            {
              id: '0',
              category: {
                id: '0',
                name: 'Parent 1',
                isActive: true,
                isParent: true,
              },
              children: [
                {
                  id: '1',
                  category: {
                    id: '0',
                    name: 'Child 1',
                    isActive: true,
                    isParent: false,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
                {
                  id: '2',
                  category: {
                    id: 1,
                    name: 'Child 2',
                    isActive: true,
                    isParent: false,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
              ],
            },
            {
              id: '1',
              category: {
                id: '4',
                name: 'Parent 2',
                isActive: true,
                isParent: true,
              },
              children: [
                {
                  id: '54',
                  category: {
                    id: '34',
                    name: 'Child 3',
                    isActive: true,
                    isParent: false,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
                {
                  id: '65',
                  category: {
                    id: '344',
                    name: 'Child 4',
                    isActive: true,
                    isParent: false,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
              ],
            },
          ],
        }))
      ),
    };
  },
  getters: {
    currentBudget: (state) => state.budgets[0],
  },
  actions: {},
});
