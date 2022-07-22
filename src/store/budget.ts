import { defineStore } from 'pinia';
import {
  doc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../database/firebase';
import { IBudget, IParentRow, IChildRow } from '../schemas/budget';
import { generateId } from '../utils/hash';
import { useCategoryStore } from './category';
import { useTransactionStore } from './transaction';
import * as budgetStore from './budget';
import moment from 'moment';

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
      const store = budgetStore.useBudgetStore();
      return store.build(state.currentMonth, state.currentYear);
    },
    previousBudget: (state): IBudget | undefined => {
      const currentDate = moment([state.currentYear, state.currentMonth, 1]);
      const lastMonth = currentDate.subtract(1, 'month');
      const store = budgetStore.useBudgetStore();
      console.log('PreviousBudget');
      return store.build(lastMonth.month(), lastMonth.year());
    },
  },
  actions: {
    async load() {
      const budgetDocs = await getDocs(collection(db, 'budgets'));
      this.budgets = [];
      budgetDocs.forEach((doc) => {
        this.budgets.push(<IBudget>doc.data());
      });

      const parentRowDocs = await getDocs(collection(db, 'parentBudgetRow'));
      this.parentRows = [];
      parentRowDocs.forEach((doc) => {
        this.parentRows.push(<IParentRow>doc.data());
      });

      const childRowDocs = await getDocs(collection(db, 'childBudgetRow'));
      this.childRows = [];
      childRowDocs.forEach((doc) => {
        this.childRows.push(<IChildRow>doc.data());
      });
    },
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
    async createNewBudget(budget: IBudget) {
      try {
        await setDoc(doc(db, 'budgets', budget._id), budget);
        this.budgets.push(budget);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    },
    async addParentRow(categoryId: string) {
      console.log('Parent Row Adding');
      try {
        if (this.currentBudget) {
          const parentRow: IParentRow = {
            _id: generateId('parentBudgetRow'),
            budgetId: this.currentBudget._id,
            categoryId,
            isCollapsed: false,
          };

          try {
            await setDoc(doc(db, 'parentBudgetRow', parentRow._id), parentRow);
            this.parentRows.push(parentRow);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addChildRow(parentId: string, categoryId: string) {
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

          try {
            await setDoc(doc(db, 'childBudgetRow', childRow._id), childRow);
            this.childRows.push(childRow);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    async updateChildRow(childRow: IChildRow) {
      try {
        const index = this.childRows.findIndex(
          (row) => row._id === childRow._id
        );
        console.log(childRow);

        const mergedRow = {
          ...this.childRows[index],
          ...childRow,
        };

        try {
          await updateDoc(doc(db, 'childBudgetRow', mergedRow._id), mergedRow);
          this.childRows.splice(index, 1, mergedRow);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      } catch (err) {
        console.error(err);
      }
    },
    cloneBudget(newMonth?: number, newYear?: number) {
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
    async deleteRow(row: IParentRow | IChildRow) {
      if (row._id.startsWith('childBudgetRow_')) {
        const index = this.childRows.findIndex((c) => c._id === row._id);

        try {
          await deleteDoc(doc(db, 'childBudgetRow', row._id));
          this.childRows.splice(index, 1);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      } else {
        const index = this.parentRows.findIndex((c) => c._id === row._id);

        try {
          const childrenRows = this.childRows
            .filter((r) => r.parentId === row._id)
            .forEach(async (r: IChildRow) => {
              await deleteDoc(doc(db, 'childBudgetRow', r._id));
              const index = this.childRows.findIndex((c) => c._id === row._id);
              this.childRows.splice(index, 1);
            });

          await deleteDoc(doc(db, 'parentBudgetRow', row._id));
          this.parentRows.splice(index, 1);
        } catch (e) {
          console.error('Error adding document: ', e);
        }
      }
    }, 
    build(month: number, year: number) {
      console.log('Building Budget', month, year);
      const categoryStore = useCategoryStore();
      const transactionStore = useTransactionStore();

      const foundBudget = this.budgets.find(
        (b) => b.month === month && b.year === year
      );

      if (foundBudget) {
        
        let income = 0;
        let budgeted = 0;
        let available = 0;

        foundBudget.transactions = transactionStore.getTransactionsByMonth(
          month,
          year
        );

        income = foundBudget.transactions.reduce((acc, cv) => {
          return acc + cv.inflow;
        }, 0);

        budgeted = this.childRows
          .filter((r) => {
            return r.budgetId === foundBudget._id;
          })
          .reduce((acc, cv) => acc + (cv.budgeted || 0), 0);

        available = income - budgeted;

        foundBudget.rows = <Array<IParentRow>>this.parentRows.map((pRow) => {
          const children = this.childRows.flatMap((cRow) => {
            if (
              cRow.parentId === pRow._id &&
              cRow.budgetId === foundBudget._id
            ) {
              let activity = 0;
              let balance = 0;
              if (foundBudget.transactions?.length) {
                const categoryTransactions = foundBudget.transactions.filter(
                  (t) => {
                    return t.categoryId === cRow.categoryId;
                  }
                );

                console.log(cRow.categoryId, categoryTransactions);

                activity = categoryTransactions.reduce(
                  (acc, cv) => acc + (cv.inflow - cv.outflow),
                  0
                );

                balance = (cRow.budgeted || 0) + activity;
              }

              const category = categoryStore.getCategory(cRow.categoryId);
              return {
                ...cRow,
                category,
                activity: Math.abs(activity || 0),
                balance,
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

        // Last Month calculation
        let notBudgetLastMonth = 0; // difference between all incomes and all budgetes in the child rows
        let overspentLastMonth = 0; // difference between budgeted and outflows from last month

        const currentDate = moment([year, month, 1]);
        const lastMonthDate = moment(currentDate).subtract(1, 'month');

        const pastBudgetsIds = this.budgets.filter(b => {
          const pastBudgetDate = moment([b.year, b.month, 1]);
          return currentDate.isAfter(pastBudgetDate, 'month');
        }).map(b => b._id);

        const lastMonthBudgetId = this.budgets.find(b => {
          const budgetDate = moment([b.year, b.month, 1]);
          return budgetDate.month() === lastMonthDate.month() && budgetDate.year() === lastMonthDate.year()
        })?._id;

        const pastChildRows = this.childRows.filter(row => {
          return pastBudgetsIds.includes(row.budgetId);
        });

        const pastMonthsBudgeted = pastChildRows.reduce((acc, cv) => acc + (cv.budgeted || 0), 0);

        const lastMonthChildRows = pastChildRows.filter(row => {
          console.log(lastMonthBudgetId, row.budgetId);
          return row.budgetId === lastMonthBudgetId;
        });

        const lastMonthBudgeted = lastMonthChildRows.reduce((acc, cv) => acc + (cv.budgeted || 0), 0);

        const pastTransactions = transactionStore.transactions.filter(t => {
          return moment(t.date).isBefore(currentDate);
        });
        
        const lastMonthOutflow = pastTransactions.filter(t => {
          const transactionDate = moment(t.date);
          return transactionDate.isSame(lastMonthDate, 'year') && transactionDate.isSame(lastMonthDate, 'month')
        }).reduce((acc, cv) => acc + cv.outflow, 0);
        
        const pastIncomes = pastTransactions.reduce((acc, cv) => acc + cv.inflow, 0);
        const pastOutflows = pastTransactions.reduce((acc, cv) => acc + cv.outflow, 0);

        notBudgetLastMonth = pastIncomes - pastMonthsBudgeted;
        overspentLastMonth =  pastMonthsBudgeted - pastOutflows;

        return {
          ...foundBudget,
          income,
          budgeted,
          available,
          notBudgetLastMonth,
          overspentLastMonth
        };
      } else {
      }
    },
  },
});
