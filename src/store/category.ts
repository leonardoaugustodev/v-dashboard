import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ICategory } from '../schemas/category';
import { db } from '../database/firebase';
import { generateId } from '../utils/hash';
import { setDoc, doc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

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
        if (cat.isActive && cat.parentId) {
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
    async load() {
      const categoryDocs = await getDocs(collection(db, "categories"));
      this.categories = [];
      categoryDocs.forEach(doc => {
        this.categories.push(<ICategory>doc.data());
      });
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

        if (index < 0) {
          category = { _id: generateId('category'), ...category };

          try {
            await setDoc(doc(db, 'categories', category._id), category);
            this.categories.push(category);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        } else {
          category = this.categories[index];
        }

        return category;
      } catch (err) {
        console.log(err);
      }
    },
    async updateCategory(category: ICategory) {
      if (!category._id) return;

      const index = this.categories.findIndex((c) => c._id === category._id);

      const mergedCategory = {
        ...this.categories[index],
        ...category,
      };

      try {
        await updateDoc(
          doc(db, 'categories', mergedCategory._id),
          mergedCategory
        );
        this.categories[index] = mergedCategory;
      } catch (e) {
        console.error('Error updating document: ', e);
      }
    },
    async delete(categoryId: string) {
      const index = this.categories.findIndex((c) => c._id === categoryId);

      try {
        const category = this.categories[index];
        await deleteDoc(doc(db, 'categories', category._id));
        this.categories.splice(index, 1);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    },
  },
  // persist: true,
});
