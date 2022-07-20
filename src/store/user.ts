import {
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../database/firebase';
import { defineStore } from 'pinia';
import { IUser } from '../schemas/user';
import { generateId } from '../utils/hash';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: <IUser>{}
    };
  },
  getters: {
    
  },
  actions: {
    async save(user: IUser) {
      this.user = user;
    },
  },
});
