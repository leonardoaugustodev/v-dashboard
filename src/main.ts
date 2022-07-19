import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { db } from './database/firebase';
import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';
import { useBudgetStore } from './store/budget';
import { useCategoryStore } from './store/category';
import { useAccountStore } from './store/account';
import { useTransactionStore } from './store/transaction';

const app = createApp(App);
const pinia = createPinia();

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

app.use(router);
app.use(pinia);

app.config.globalProperties.appName = 'Moneylee';
app.config.globalProperties.$router = router;
app.config.globalProperties.$db = db;

// Retrieve categories from database
const categoryStore = useCategoryStore();
categoryStore.load();

// Retrieve the budget and rows from database
const budgetStore = useBudgetStore();
budgetStore.load();

// Retrieve accounts data from database
const accountStore = useAccountStore();
accountStore.load();

// Retrieve transactions data from database
const transactionStore = useTransactionStore();
transactionStore.load();

app.mount('#app');
