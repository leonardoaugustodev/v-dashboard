import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ICategory } from '../schemas/category';
import { db } from '../database';
import { generateId } from '../utils/hash';

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: ref<Array<ICategory>>([]),
    };
  },
  getters: {
    getCategory(state) {
      return (categoryId: string) =>
        state.categories.find((c) => c._id === categoryId);
    },
    getCategoriesPicklist(state) {
      return state.categories.flatMap((cat) => {
        if (cat.isActive && cat.parentId ) {
          return {
            label: cat.name,
            value: cat._id,
          };
        }
        return [];
      });
    },
  },
  actions: {
    getOrAddCategory(category: ICategory) {
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

        if (index < 0) {
          category = { _id: generateId('category'), ...category };
          this.categories.push(category);
        } else {
          category = this.categories[index];
        }

        return category;
      } catch (err) {
        console.log(err);
      }
    },
    updateCategory(category: ICategory) {
      if (!category._id) return;

      const index = this.categories.findIndex((c) => c._id === category._id);

      const mergedCategory = {
        ...this.categories[index],
        ...category,
      };

      this.categories[index] = mergedCategory;
    },
    deleteCategory(categoryId: string) {
      const index = this.categories.findIndex((c) => c._id === categoryId);

      this.categories.splice(index, 1);
    },
  },
  persist: true,
});
