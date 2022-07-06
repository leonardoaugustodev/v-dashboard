import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { db } from './database';

import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';

const app = createApp(App);
const pinia = createPinia();

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

app.use(router);
app.use(pinia);

app.mount('#app');


app.config.globalProperties.appName = 'Moneylee';
app.config.globalProperties.$router = router;
app.config.globalProperties.$db = db;
