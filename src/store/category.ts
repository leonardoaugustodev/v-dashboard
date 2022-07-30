import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ICategory } from '../schemas/category';
import { db } from '../database/firebase';
import { generateId } from '../utils/hash';
import {
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  where,
  query,
} from 'firebase/firestore';
import { useUserStore } from './user';

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
      const userStore = useUserStore();
      const categoryDocs = await getDocs(
        query(
          collection(db, 'categories'),
          where('userId', '==', userStore.user.uid)
      ));
      this.categories = [];
      categoryDocs.forEach((doc) => {
        const category = doc.data();
        if (category.userId === userStore.user.uid) {
          this.categories.push(<ICategory>category);
        }
      });
    },
    async getOrAddCategory(category: ICategory) {
      const userStore = useUserStore();
      try {
        if (!category._id) {
          category = {
            ...category,
            _id: generateId('category'),
            userId: userStore.user.uid,
            isActive: true,
          };

          try {
            await setDoc(doc(db, 'categories', category._id), category);
            this.categories.push(category);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        } else {
          category =
            this.categories[
              this.categories.findIndex((c) => c._id === category._id)
            ];
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
