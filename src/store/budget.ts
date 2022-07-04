import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IBudget } from '../schemas/budget';

export const useBudgetStore = defineStore('budget', {
  state: () => {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      budgets: ref<Array<IBudget>>(
        [...Array(15).keys()].map((element, index) => ({
          id: `${index}`,
          month: index > 11 ? index - 12 : index,
          year: index > 11 ? 2023 : 2022,
          rows: [
            {
              id: '0',
              category: {
                id: '0',
                name: 'Fixed spent',
                isActive: true,
              },
              isCollapsed: true,
              children: [
                {
                  id: '1',
                  category: {
                    id: '3',
                    name: 'Child category 1',
                    parentId: 0,
                    isActive: true,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
                {
                  id: '2',
                  category: {
                    id: '4',
                    name: 'Child category 2',
                    parentId: 0,
                    isActive: true,
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
                id: '1',
                name: 'Everyday spent',
                isActive: true,
              },
              isCollapsed: false,
              children: [
                {
                  id: '54',
                  category: {
                    id: '5',
                    name: 'Child category 3',
                    parentId: 1,
                    isActive: true,
                  },
                  budgeted: Math.random() * 1000,
                  activity: Math.random() * 1000,
                  balance: Math.random() * 1000,
                },
                {
                  id: '65',
                  category: {
                    id: '6',
                    name: 'Child category 4',
                    parentId: 1,
                    isActive: true,
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
    currentBudget: (state) => {
      return (
        state.budgets.find(
          (b) => b.month === state.currentMonth && b.year === state.currentYear
        ) || state.budgets[0]
      );
    },
  },
  actions: {
    selectDate(month: number, year: number) {
      this.currentMonth = month;
      this.currentYear = year;
    },
  },
});
