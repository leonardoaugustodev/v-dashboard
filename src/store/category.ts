import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ICategory } from '../schemas/category';

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: ref<Array<ICategory>>([
        {
          id: '0',
          name: 'Fixed spent',
          isActive: true,
        },
        {
          id: '1',
          name: 'Everyday spent',
          isActive: true,
        },
        {
          id: '3',
          name: 'Child category 1',
          parentId: '0',
          isActive: true,
        },
        {
          id: '4',
          name: 'Child category 2',
          parentId: '0',
          isActive: true,
        },
        {
          id: '5',
          name: 'Child category 3',
          parentId: '1',
          isActive: true,
        },
        {
          id: '6',
          name: 'Child category 4',
          parentId: '1',
          isActive: true,
        },
        {
          id: '7',
          name: 'Child category 5',
          parentId: '1',
          isActive: false,
        },
      ]),
    };
  },
  getters: {
  },
  actions: {
    newCategory(category: ICategory) {
      this.categories.push(category);
    },
  },
});
