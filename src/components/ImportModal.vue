<template>

  <div :class="`modal z-50 fixed w-full  h-full top-0 left-0 flex items-center justify-center`" @keyup.esc="closeModal">
    <div @click="closeModal" class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

    <div class="z-50 mx-auto overflow-y-auto max-height bg-white rounded shadow-lg modal-container">
      <div
        class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
        <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 18 18">
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <div class="px-6 py-4 text-left modal-content">
        <!--Title-->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">Import</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <div class=" overflow-y-scroll max-height">
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">Select your
            OFX or CSV file</label>
          <input @change="readFile($event)"
            class="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input" type="file">

          <table v-if="showNewTransactions" class="min-full">
            <thead>
              <tr>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Date
                </th>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Account
                </th>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Memo
                </th>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Category
                </th>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Inflow
                </th>
                <th
                  class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Outflow
                </th>
              </tr>
            </thead>
            <tbody class="h-32 overflow-y-scroll">
              <TransactionNew v-for="transaction in transactions" :key="transaction._id" :transaction="transaction"
                :accountId="accountId" :hideSaveButton="true" />
            </tbody>
          </table>
        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button @click="handleCancel"
            class="mx-2 px-4 py-2 text-sm font-medium tracking-wide text-red-500 rounded-md hover:text-red-700 focus:outline-none">
            Cancel
          </button>
          <button v-if="showImportButton" @click="handleImport"
            class="px-4 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import moment from 'moment';
import TransactionNew from './TransactionNew.vue';
import { generateId } from '../utils/hash';
import { ITransaction } from '../schemas/transaction';
import { useTransactionStore } from '../store/transaction';
import { useUserStore } from '../store/user';
import { upsert } from '../use/useTransaction';
import axios from 'axios';

const emit = defineEmits(['close', 'import'])
const { accountId } = defineProps<{
  accountId: string
}>()
const file = ref();
const content = ref()
const showNewTransactions = ref(false);
const showImportButton = ref(false);
const transactions = ref<Array<ITransaction>>([]);

const readFile = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  if (file) {
    if (file.name.includes(".csv")) {
      reader.onload = (res) => {
        content.value = res?.target?.result;
      };
      reader.onerror = (err) => console.log(err);
      reader.readAsText(file);
    }

    else {
      reader.onload = (res) => {
        // console.log(res.target?.result);
        parseOfx(res.target?.result);
      };
      reader.onerror = (err) => console.log(err);
      reader.readAsText(file);
    }

  }
}
const handleImport = async () => {
  await upsert(transactions.value);
  emit('import');
}

const closeModal = () => {
  emit('close');
}

const handleCancel = () => {
  closeModal();
}

const parseOfx = async (data: any) => {

  const result = await axios.post(`${import.meta.env.VITE_FUNCTIONS_URL}/parseOfx`, data, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });

  transactions.value = result.data.map((t: ITransaction) => {
    return {
      ...t,
      accountId,
      categoryId: ''
    }
  });
  showNewTransactions.value = true;
  showImportButton.value = true;
}


</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}

.max-height {
  max-height: 90%;
}
</style>
