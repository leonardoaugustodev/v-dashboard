<template>

  <ImportModal v-if="showImportModal" :account-id="accountId" @close="showImportModal = false" @import="reloadTransactions"/>

  <div class="flex justify-between mb-2">

    <div class="w-full sm:w-1/1 xl:w-3/3">
      <div class="flex justify-between px-5 py-6 bg-white rounded-md shadow-sm">
        <div class="mx-5">
          <h4 class="text-2xl font-semibold text-gray-700">{{ account?.name }}</h4>
          <div class="text-gray-500 flex justify-between items-center">
            {{ account?.type }}
            <button @click="openImportModal"
              class="text-sm ml-2 text-gray-300 hover:text-gray-800 p-2 hover:bg-gray-50 rounded-md flex justify-between items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
              <span class="ml-1">Import</span>
            </button>
          </div>
        </div>

        <div class="flex">
          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(summaryValues?.cleared) }}</h4>
            <div class="text-gray-500">Cleared</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">+</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(summaryValues?.uncleared) }}</h4>
            <div class="text-gray-500">Uncleared</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">=</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(summaryValues?.total) }}</h4>
            <div class="text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TransactionTable ref="transactionTable" :account-id="accountId" @update="reloadSummaryValues" />

</template>


<script setup lang="ts">
import { watch, reactive, ref } from 'vue';
import { useRoute } from "vue-router";
import { IAccount } from '../schemas/account';
import { useAccountStore } from '../store/account';
import TransactionTable from '../components/TransactionTable.vue';
import { formatCurrency } from '../utils/currency';
import { useTransactionStore } from '../store/transaction';
import ImportModal from '../components/ImportModal.vue';

const route = useRoute();
const accountId = <string>route.params.id;
const accountStore = useAccountStore();
const summaryValues = ref(accountStore.getSummaryValues(accountId));
const account = ref<IAccount | any>(accountStore.getAccount(accountId));
const showImportModal = ref(false);
const transactionTable = ref();
const reloadSummaryValues = () => {
  summaryValues.value = accountStore.getSummaryValues(accountId);
}

const openImportModal = () => {
  showImportModal.value = true;
}

const reloadTransactions = () => {
  showImportModal.value = false;
  transactionTable.value.reload();
}

</script>
