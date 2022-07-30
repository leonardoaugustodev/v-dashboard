import { defineStore } from 'pinia';
import { useAccountStore } from './account';
import { useCategoryStore } from './category';
import { useTransactionStore } from './transaction';
import { useUserStore } from './user';

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore('main', {
  state: () => {
    return {};
  },
  getters: {},
  actions: {
    loadStores() {
      // useUserStore().$reset();
      useAccountStore().load();
      useCategoryStore().load();
      // useTransactionStore().$reset();
    },
    resetStores() {
      useUserStore().$reset();
      useCategoryStore().$reset();
      useAccountStore().$reset();
      useTransactionStore().$reset();
    },
  },
});
