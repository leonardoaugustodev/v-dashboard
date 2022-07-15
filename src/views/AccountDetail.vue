<template>

  <div class="flex justify-between mb-2">
    <div class="w-full sm:w-1/1 xl:w-3/3">
      <div class="flex justify-between px-5 py-6 bg-white rounded-md shadow-sm">
        <div class="mx-5">
          <h4 class="text-2xl font-semibold text-gray-700">{{ account?.name }}</h4>
          <div class="text-gray-500">{{ account?.type }}</div>
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

  <TransactionTable :account-id="accountId" @clear="reloadSummaryValues" />

</template>


<script setup lang="ts">
import { watch, reactive, ref } from 'vue';
import { useRoute } from "vue-router";
import { IAccount } from '../schemas/account';
import { useAccountStore } from '../store/account';
import TransactionTable from '../components/TransactionTable.vue';
import { formatCurrency } from '../utils/currency';
import { useTransactionStore } from '../store/transaction';

const route = useRoute();
const accountId = <string>route.params.id;
const accountStore = useAccountStore();
const summaryValues = ref(accountStore.getSummaryValues(accountId));
const account = ref<IAccount | any>(accountStore.getAccount(accountId));

const reloadSummaryValues = () => {
  summaryValues.value = accountStore.getSummaryValues(accountId);
}

</script>
