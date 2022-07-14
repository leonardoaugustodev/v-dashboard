<template>

  <div class="flex justify-between">
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

  <TransactionTable :transactions="transactions" :account-id="accountId" @add-transaction="handleTransactionAdded" />

</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import { ITransaction } from '../schemas/transaction';
import { IAccount } from '../schemas/account';
import { useAccountStore } from '../store/account';
import { useTransactionStore } from '../store/transaction';
import TransactionTable from '../components/TransactionTable.vue';
import { formatCurrency } from '../utils/currency';

const route = useRoute();
const accountId = <string>route.params.id;
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();
const transactions = ref<Array<ITransaction>>();
const account = ref<IAccount>();

onMounted(() => {
  account.value = accountStore.getAccount(accountId);
  getTransactions();
})

const getTransactions = () => {
  transactions.value = transactionStore.getTransactionsByAccountId(accountId);
}

const handleTransactionAdded = () => {
  getTransactions();
}

const summaryValues = computed(() => {

  const cleared = transactions.value?.filter(t => t.cleared);
  const uncleared = transactions.value?.filter(t => !t.cleared);

  const clearedTotal = cleared?.reduce((acc, cv) => {
    return acc + (cv.inflow - cv.outflow);
  }, 0);

  const unclearedTotal = uncleared?.reduce((acc, cv) => {
    return acc + (cv.inflow - cv.outflow);
  }, 0);


  return {
    cleared: clearedTotal || 0,
    uncleared: unclearedTotal || 0,
    total: (clearedTotal || 0) + (unclearedTotal || 0)
  }

});
</script>
