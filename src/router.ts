import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Dashboard from './views/Dashboard.vue';
import Forms from './views/Forms.vue';
import Tables from './views/Tables.vue';
import UIElements from './views/UIElements.vue';
import Login from './views/Login.vue';
import Modal from './views/Modal.vue';
import Card from './views/Card.vue';
import Blank from './views/Blank.vue';
import NotFound from './views/NotFound.vue';
import Budget from './views/Budget.vue';
import Accounts from './views/Accounts.vue';
import AccountDetail from './views/AccountDetail.vue';
import { useUserStore } from './store/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { layout: 'empty' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/budget',
    name: 'Budget',
    component: Budget,
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts,
  },
  {
    path: '/accounts/:id',
    name: 'AccountDetail',
    component: AccountDetail,
    strict: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

async function isLoggedIn(): Promise<boolean> {
  try {
    await new Promise((resolve, reject) =>
      onAuthStateChanged(
        getAuth(),
        async (user) => {
          if (user) {
            resolve(user);
          } else {
            reject('User is not logged in');
          }
        },
        (error) => reject(error)
      )
    );
    return true;
  } catch (error) {
    return false;
  }
}

router.beforeEach(async (to, from) => {
  if (!(await isLoggedIn()) && to.name !== 'Login') {
    return { name: 'Login' };
  }
});

export default router;
