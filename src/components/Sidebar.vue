<template>
  <div class="flex">
    <!-- Backdrop -->
    <div :class="isOpen ? 'block' : 'hidden'" @click="isOpen = false"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
    <!-- End Backdrop -->

    <div :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
      class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white shadow-md shadow-zinc-200 lg:translate-x-0 lg:static lg:inset-0">
      <div class="flex items-center justify-center mt-8">
        <div class="flex flex-col items-center justify-center">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="url(#grad1)"
            stroke-width="2">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="50%" y2="0%">
                <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
              </linearGradient>
            </defs>
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg> -->
          <span class="mx-2 text-3xl font-bold text-indigo-700 drop-shadow-sm">Moneylee</span>
          <div class="w-full h-px my-1 first-letter:border-0 border-b-1 bg-zinc-200 drop-shadow-md" />
          <span class="mx-2 text-xs font-bold text-zinc-500 drop-shadow-md">Personal Budget System</span>
        </div>
      </div>

      <nav class="mt-10">
        <router-link class="flex items-center px-6 py-2 mt-4 mx-4 duration-200 rounded-md"
          :class="[$route.name === 'Dashboard' ? activeClass : inactiveClass]" to="/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>

          <span class="mx-4">Dashboard</span>
        </router-link>

        <router-link class="flex items-center px-6 py-2 mt-4 mx-4 duration-200 rounded-md"
          :class="[$route.name === 'Budget' ? activeClass : inactiveClass]" to="/budget">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
              clip-rule="evenodd" />
          </svg>

          <span class="mx-4">Budget</span>
        </router-link>

        <router-link class="flex items-center px-6 py-2 mt-4 mx-4 duration-200 rounded-md"
          :class="[$route.name === 'Accounts' ? activeClass : inactiveClass]" to="/accounts">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>

          <span class="mx-4">Accounts</span>
        </router-link>

        <router-link v-for="account in accounts" :key="account._id"
          class="flex items-center px-6 pl-8 py-1 mt-1 mx-4 rounded-md duration-200  text-sm"
          :class="[$route.path === `/accounts/${account._id}` ? activeClass : inactiveClass]"
          :to="`/accounts/${account._id}`">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>

          <span class="mx-2">{{ account.name }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useSidebar } from "../hooks/useSidebar";
import { useAccountStore } from "../store/account";
const accounts = computed(() => {
  return useAccountStore().accounts;
})

const { isOpen } = useSidebar();
const activeClass = ref(
  "bg-indigo-100  text-zinc-900"
);
const inactiveClass = ref(
  "border-gray-900 text-zinc-500 hover:bg-zinc-300 hover:bg-opacity-25 hover:text-zinc-700"
);
</script>
