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
  getters: {},
  actions: {
    async loadCategories() {
      try {
        const allDocs = await db.allDocs({
          include_docs: true,
          startkey: 'category_',
          endkey: 'category_\ufff0',
        });

        const retrievedCategories = allDocs.rows.map((row) => {
          return <ICategory>(row.doc as unknown);
        });

        this.categories = [
          ...(<Array<ICategory>>([...retrievedCategories] as unknown)),
        ];
      } catch (err) {
        console.log(err);
      }
    },
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
          const categoryToInsert = { _id: generateId('category'), ...category };
          result = await db.post(categoryToInsert);

          const { id, rev } = result;
          category = {
            _id: id,
            _rev: rev,
            ...category,
          };

          this.categories.push(category);
        } else {
          category = await db.get(this.categories[index]._id);
        }

        return category;
      } catch (err) {
        console.log(err);
      }
    },
  },
});
