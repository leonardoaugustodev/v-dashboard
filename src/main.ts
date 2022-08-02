import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { createPinia } from 'pinia';
import { db } from './database/firebase';
import DashboardLayout from './components/DashboardLayout.vue';
import EmptyLayout from './components/EmptyLayout.vue';
import { useUserStore } from './store/user';
import { useAccountStore } from './store/account';
import { useMainStore } from './store/main';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { IUser } from './schemas/user';

const app = createApp(App);
const pinia = createPinia();

app.component('default-layout', DashboardLayout);
app.component('empty-layout', EmptyLayout);

app.use(router);
app.use(pinia);

app.config.globalProperties.appName = 'Moneylee';
app.config.globalProperties.$router = router;
app.config.globalProperties.$db = db;

app.mount('#app');

const auth = getAuth();
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.info('Loading App');
    await useUserStore().save(user as IUser);
    router.push('/dashboard');
    useMainStore().loadStores();
  } else {
    useMainStore().resetStores();
    router.push('/');
  }
});
