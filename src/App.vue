<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from './store/user';
import { IUser } from "./schemas/user";
import { useMainStore } from "./store/main";
const userStore = useUserStore();

const router = useRouter();

const defaultLayout = "default";

const { currentRoute } = useRouter();

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);

onMounted(() => {
  
})
</script>
