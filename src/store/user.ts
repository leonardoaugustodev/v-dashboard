import { defineStore } from 'pinia';
import { IUser } from '../schemas/user';

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
      this.user = { ...user };
    },
    logout(){
      this.user = <IUser>{};
    }
  },
});
