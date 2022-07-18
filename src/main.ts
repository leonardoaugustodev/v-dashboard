import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { db } from "./database/firebase";

import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';
import { useBudgetStore } from './store/budget';
import { useCategoryStore } from './store/category';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

app.use(router);
app.use(pinia);

app.mount('#app');

app.config.globalProperties.appName = 'Moneylee';
app.config.globalProperties.$router = router;
app.config.globalProperties.$db = db;


// Retrieve categories from database
const categoryStore = useCategoryStore();
categoryStore.loadCategories();

// Retrieve the budget and rows from database
const budgetStore = useBudgetStore();
budgetStore.loadBudgets();