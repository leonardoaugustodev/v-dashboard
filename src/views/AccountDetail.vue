<template>

  <div class="flex justify-between">
    <div class="w-full sm:w-1/1 xl:w-3/3">
      <div class="flex justify-between px-5 py-6 bg-white rounded-md shadow-sm">
        <div class="mx-5">
          <h4 class="text-2xl font-semibold text-gray-700">Account Name</h4>
          <div class="text-gray-500">Checking</div>
        </div>

        <div class="flex">
          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
            <div class="text-gray-500">Cleared</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">+</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
            <div class="text-gray-500">Uncleared</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">=</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">8,282</h4>
            <div class="text-gray-500">Total</div>
          </div>
        </div>


      </div>
    </div>
    <!-- <button @click="editingAccount = defaultAccount; showModal = true"
      class="px-4 py-2 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
      New account
    </button> -->
  </div>

  <TransactionTable :transactions="transactions" />


</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from "vue-router";
import { ITransaction } from '../schemas/transaction';

import TransactionTable from '../components/TransactionTable.vue';
// import { IAccount, useAccount } from "../hooks/useAccount";
// const { accountTableData } = useAccount();

const route = useRoute();
const accountId = route.params.id;

const transactions = ref<Array<ITransaction>>(
  [...Array(10).keys()].map((element, index) => ({
    id: `${index}`,
    date: new Date().toISOString(),
    account: {
      id: `${index}`,
      name: `Account ${index}`,
      type: 'Checking',
      on_budget: true,
      status: 'Open',
      balance: Math.random() * 100000
    },
    memo: `Random memo ${index}`,
    category: {
      id: `${index}`,
      name: `Category ${index}`,
      isActive: true,
    },
    inflow: Math.random() * 10000,
    outflow: Math.random() * 10000,
  })));
// const account = accountTableData.find(acc => acc.id == accountId);

</script>
