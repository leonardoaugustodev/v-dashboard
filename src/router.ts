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

export default router;
