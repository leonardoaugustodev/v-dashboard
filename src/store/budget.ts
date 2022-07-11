import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '../database';
import { IBudget, IParentRow, IChildRow } from '../schemas/budget';
import { generateId } from '../utils/hash';
import { useCategoryStore } from './category';

export const useBudgetStore = defineStore('budget', {
  state: () => {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      budgets: <Array<IBudget>>[],
      parentRows: <Array<IParentRow>>[],
      childRows: <Array<IChildRow>>[],
    };
  },
  getters: {
    currentBudget: (state): IBudget | undefined => {
      const categoryStore = useCategoryStore();
      const foundBudget = state.budgets.find(
        (b) => b.month === state.currentMonth && b.year === state.currentYear
      );

      if (foundBudget) {
        foundBudget.rows = <Array<IParentRow>>state.parentRows.map((pRow) => {
          const children = state.childRows.flatMap((cRow) => {
            if (
              cRow.parentId === pRow._id &&
              cRow.budgetId === foundBudget._id
            ) {
              const category = categoryStore.getCategory(cRow.categoryId);
              return {
                ...cRow,
                category,
              };
            }
            return [];
          });

          const category = categoryStore.getCategory(pRow.categoryId);

          return {
            ...pRow,
            children,
            category,
          };
        });
        return foundBudget;
      }
    },
  },
  actions: {
    selectDate(month: number, year: number) {
      const foundBudget = this.budgets.find(
        (b) => b.month === month && b.year === year
      );

      if (!foundBudget) {
        this.cloneBudget(month, year);
      }

      this.currentMonth = month;
      this.currentYear = year;
    },
    createNewBudget(budget: IBudget) {
      this.budgets.push(budget);
    },
    addParentRow(categoryId: string) {
      console.log('Parent Row Adding');
      try {
        if (this.currentBudget) {
          const parentRow: IParentRow = {
            _id: generateId('parentBudgetRow'),
            budgetId: this.currentBudget._id,
            categoryId,
            isCollapsed: false,
          };

          this.parentRows.push(parentRow);
        }
      } catch (err) {
        console.log(err);
      }
    },
    addChildRow(parentId: string, categoryId: string) {
      try {
        const parentRow = this.parentRows.find((row) => row._id === parentId);

        if (this.currentBudget && parentRow) {
          const childRow: IChildRow = {
            _id: generateId('childBudgetRow'),
            budgetId: this.currentBudget._id,
            parentId: parentRow._id,
            categoryId,
            budgeted: 0,
            activity: 0,
            balance: 0,
          };

          this.childRows.push(childRow);
        }
      } catch (err) {
        console.log(err);
      }
    },
    updateChildRow(childRow: IChildRow) {
      try {

        const index = this.childRows.findIndex(row => row._id === childRow._id);
        console.log(childRow);

        const mergedRow = {
          ...this.childRows[index],
          ...childRow,
        };

        this.childRows.splice(index, 1, mergedRow); 

      } catch (err) {
        console.error(err);
      }
    },
    async cloneBudget(newMonth?: number, newYear?: number) {
      try {
        let rows: Array<IParentRow> = [];

        if (newMonth && newYear) {
          const previousBudget = this.budgets.find(
            (b) => b.month === newMonth - 1 && b.year === newYear - 1
          );

          if (previousBudget) {
            // rows = [...previousBudget.rows];
          }
        }

        const newBudget = {
          _id: generateId('budget'),
          month: newMonth || new Date().getMonth(),
          year: newYear || new Date().getFullYear(),
        };

        this.createNewBudget(newBudget);
      } catch (err) {
        console.log(err);
      }
    },
  },
  persist: true,
});
