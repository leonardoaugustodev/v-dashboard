<template>

  <div :class="`modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`" @keyup.esc="closeModal">
    <div @click="closeModal" class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

    <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container max-w-fit">
      <div
        class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
        <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 18 18">
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="px-6 py-4 text-left modal-content">
        <!--Title-->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">Mass Edit</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <table class="min-full">
          <thead>
            <tr>
              <th
                class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Date
              </th>
              <th
                class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Account
              </th>
              <th
                class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Memo
              </th>
              <th
                class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
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
          <tbody class="max-w-screen-md">
            <TransactionNew v-for="t in transactionsToEdit" :key="t._id" :transaction="t" class="w-full "
              hide-save-button="true" />
          </tbody>
        </table>

        <!--Footer-->
        <div class="flex justify-end pt-2">

          <button @click="handleSave"
            class="px-4 py-2 text-sm font-sm tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ITransaction } from "../schemas/transaction";
import { useTransactionStore } from "../store/transaction";
import { upsert } from "../use/useTransaction";
import TransactionNew from './TransactionNew.vue';

const transactionStore = useTransactionStore();
const emit = defineEmits(['close-modal', 'save'])
const { transactions } = defineProps<{
  transactions: Array<ITransaction>
}>()

const transactionsToEdit = ref([...transactions]);
const amounts = transactionsToEdit.value.map(t => {
  return {
    _id: t._id,
    amount: (t.inflow - t.outflow)
  }
});

const closeModal = () => {
  emit('close-modal');
}

const handleSave = async () => {
  await upsert([
    ...transactionsToEdit.value
  ], amounts);
  emit('save');
  closeModal();
}

</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
