import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ICategory } from '../schemas/category';
import { db } from '../database';

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
  getters: {},
  actions: {
    async getOrAddCategory(category: ICategory) {
      try {
        const { parentId } = category;
        let index;
        if (parentId) {
          index = this.categories.findIndex(
            (c) => c.name === category.name && c.parentId === parentId
          );
        } else {
          index = this.categories.findIndex((c) => c.name === category.name);
        }

        let result;
        if (index < 0) {
          result = await db.post(category);

          const { id, rev } = result;
          category = {
            id,
            rev,
            ...category,
          };

          this.categories.push(category);
        } else {
          category = await db.get(this.categories[index].id);
        }

        return category;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
