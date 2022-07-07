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
    };
  },
  getters: {
    currentBudget: (state) => {
      const categoryStore = useCategoryStore();
      const foundBudget = state.budgets.find(
        (b) => b.month === state.currentMonth && b.year === state.currentYear
      );

      if (foundBudget) {
        foundBudget.rows = foundBudget.rows.map((row) => {
          const category = categoryStore.categories.find(
            (cat) => cat._id === row.categoryId
          );

          if(row.children){
            row.children = row.children?.map(ch => {
              const category = categoryStore.categories.find(
                (cat) => cat._id === ch.categoryId
              );

              return {
                category,
                ...ch,
              };

            })
          }

          return {
            category,
            ...row,
          };
        });
      }

      return foundBudget;
    },
  },
  actions: {
    selectDate(month: number, year: number) {
      this.currentMonth = month;
      this.currentYear = year;
    },
    async loadBudgets() {
      try {
        const allDocs = await db.allDocs({
          include_docs: true,
          startkey: 'budget_',
          endkey: 'budget_\ufff0',
        });

        if (allDocs.rows.length) {
          const retrievedBudgets = allDocs.rows.map((row) => {
            return <IBudget>(row.doc as unknown);
          });

          this.budgets = [
            ...(<Array<IBudget>>([...retrievedBudgets] as unknown)),
          ];
        } else {
          this.createNewBudget();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async createNewBudget() {
      await db.post({
        _id: generateId('budget'),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        rows: [],
      });

      this.loadBudgets();
    },
    async addParentRow(categoryId: string) {
      try {
        // Retrieve budget
        const currentBudget = { ...this.currentBudget };

        if (currentBudget) {
          const parentRow: IParentRow = {
            _id: generateId('parentBudgetRow'),
            budgetId: currentBudget._id,
            categoryId,
            isCollapsed: false,
            children: [],
          };

          if(!currentBudget.rows) currentBudget.rows = [];

          currentBudget.rows.push(parentRow);

          // Post to db
          await db.put(currentBudget);

          this.loadBudgets();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addChildRow(parentId: string, categoryId: string) {
      try {
        // Retrieve budget
        const currentBudget = { ...this.currentBudget };
        const parentRow = currentBudget.rows?.find(row => row._id === parentId);
        

        if (currentBudget && parentRow) {
          const childRow: IChildRow = {
            _id: generateId('childBudgetRow'),
            parentId,
            categoryId,
            budgeted: 0,
            activity: 0,
            balance: 0
          };

          if(!parentRow.children) parentRow.children = [];

          parentRow.children.push(childRow);

          console.log(parentRow);

          // Post to db
          await db.put(currentBudget);

          this.loadBudgets();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
