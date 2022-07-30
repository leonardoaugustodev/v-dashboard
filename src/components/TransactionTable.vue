<template>

  <TransactionMassEditModal v-if="showMassEditModal" :transactions="rowsSelected" @save="handleTransactionAdded"
    @close-modal="showMassEditModal = false" @keydown.esc="showMassEditModal = false" />

  <div class="flex flex-col">

    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
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
              <th
                class="px-2 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Cleared
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">

            <tr v-if="!isEditing" class="text-center bg-gray-100 text-gray-400 text-sm">

              <td v-if="!rowsSelected.length" @click="handleEdit" class="py-2 hover:text-bold" colspan="8"> +
                Transaction</td>

              <td v-else class="" colspan="8">
                <div class="w-full sm:w-1/1 xl:w-3/3 px-1 flex justify-between items-center">
                  <div class="flex">
                    <button @click="handleMassEdit"
                      class="text-blue-600 hover:text-blue-800 p-2 hover:bg-gray-200 rounded-md flex justify-between items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fill-rule="evenodd"
                          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                          clip-rule="evenodd" />
                      </svg>
                      <span class="ml-1">Edit</span>
                    </button>

                    <button @click="handleMassClear"
                      class="text-blue-600 hover:text-blue-800 p-2 hover:bg-gray-200 rounded-md flex justify-between items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span class="ml-1">Clear</span>
                    </button>

                    <button @click="handleMassUnclear"
                      class="text-purple-600 hover:text-purple-800 p-2 hover:bg-gray-200 rounded-md flex justify-between items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="ml-1">Unclear</span>
                    </button>
                  </div>

                  <button @click="handleDelete"
                    class="text-red-600 hover:text-red-800 p-2 hover:bg-gray-200 rounded-md flex justify-between items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="ml-1">Delete</span>
                  </button>

                </div>
              </td>
            </tr>
            <TransactionNew v-else @keydown.esc="cancelEdit" :account-id="accountId" @cancel="cancelEdit"
              @add-transaction="handleTransactionAdded" :hide-save-button="false" />

            <tr v-for="(u, index) in transactions" :key="index">

              <td class="py-2 border-b border-gray-200 whitespace-nowrap">
                <div class="flex items-center">
                  <input class="mr-4 ml-2 border-gray-300 rounded" type="checkbox" @change="handleSelect(u, $event)" />
                  <div class="text-sm font-medium leading-5 text-gray-900">
                    {{ moment(u.date).format('DD/MM/YYYY') }}
                  </div>
                </div>
              </td>

              <td class="py-2 border-b border-gray-200 whitespace-nowrap">
                <span
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                      u.account?.name
                  }}</span>

              </td>

              <td class="py-2 border-b border-gray-200 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ u.memo }}
                </div>
              </td>

              <td class="py-2 border-b border-gray-200 whitespace-nowrap">
                <span
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                      u.category?.name
                  }}</span>
              </td>


              <td class="py-2 text-sm leading-5 text-right text-green-700 border-b border-gray-200 whitespace-nowrap">
                {{ formatCurrency(u.inflow) }}
              </td>

              <td class="py-2 text-sm leading-5 text-right text-red-500 border-b border-gray-200 whitespace-nowrap">
                {{ formatCurrency(u.outflow) }}
              </td>

              <td class="py-2 text-sm leading-5 text-center border-b border-gray-200 whitespace-nowrap">
                <button @click="handleClear(u)">
                  <svg v-if="u.cleared" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20"
                    fill="#03a1fc">
                    <path fill-rule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>

                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="#ddd" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import moment from 'moment';
import TransactionNew from './TransactionNew.vue';
import { ITransaction } from '../schemas/transaction';
import { useTransactionStore } from '../store/transaction';
import { useAccountStore } from '../store/account';
import { useCategoryStore } from '../store/category';
import { formatCurrency } from '../utils/currency';
import TransactionMassEditModal from './TransactionMassEditModal.vue';
import { getDoc, doc, collection, getDocs, setDoc, where, query } from 'firebase/firestore';
import { db } from '../database/firebase';
import { useUserStore } from '../store/user';


const transactionStore = useTransactionStore();
const userStore = useUserStore();
const categoryStore = useCategoryStore();
const emit = defineEmits(['update']);
const { accountId } = defineProps<{ accountId: string }>();
const transactions = ref<Array<ITransaction>>(transactionStore.getTransactionsByAccountId(accountId));
const defaultTransaction = {
  date: moment().format('YYYY-MM-DD'),
  day: moment().date(),
  month: moment().month(),
  year: moment().year(),
  accountId: accountId,
  inflow: 0,
  outflow: 0,
  cleared: false
};

const transactionToEdit = ref<ITransaction>();
const isEditing = ref(false);
const rowsSelected = ref<Array<ITransaction>>([]);
const showMassEditModal = ref(false);

const getTransactions = async () => {

  const transactionDocs = await getDocs(
    query(
      collection(db, 'transactions'),
      where('userId', '==', userStore.user.uid),
      where('accountId', '==', accountId),
    )
  );

  transactions.value = [...transactionDocs.docs.map(doc => (doc.data() as ITransaction))];

  // console.log(transactionStore.transactions);
  // console.log('getting transactions');
  // transactions.value = transactionStore.getTransactionsByAccountId(accountId);
}

const handleTransactionAdded = () => {
  getTransactions();
  emit('update');
}

const handleEdit = () => {
  transactionToEdit.value = { ...defaultTransaction };
  isEditing.value = true;
}

const handleClear = (transaction: ITransaction) => {
  transactionStore.clear(transaction._id, !transaction.cleared);
  emit('update');
}

const handleSelect = (row: ITransaction, event: any) => {
  const checked = event.target.checked;

  if (checked) {
    cancelEdit();
    rowsSelected.value.push(row);
  }
  else {
    rowsSelected.value.splice(
      rowsSelected.value.findIndex(r => r._id === row._id), 1
    )
  }
}

const handleDelete = () => {
  rowsSelected.value.forEach(async (row) => {
    await transactionStore.delete(row._id)
    const index = transactions.value.findIndex((c) => c._id === row._id);
    transactions.value.splice(index, 1);
  });

  clearSelection();
  getTransactions();
}

const handleMassClear = () => {
  rowsSelected.value.forEach(row => {
    transactionStore.clear(row._id, true)
  });

  emit('update');
  clearSelection();
}

const handleMassUnclear = () => {
  rowsSelected.value.forEach(row => {
    transactionStore.clear(row._id, false)
  });

  emit('update');
  clearSelection();
}

const handleMassEdit = () => {
  showMassEditModal.value = true;
}

const clearSelection = () => {
  rowsSelected.value = [];

  document.querySelectorAll('input[type=checkbox]')?.forEach((el: any) => {
    el.checked = false
  });
}

const cancelEdit = () => {
  isEditing.value = false;
}

onMounted(() => {
  getTransactions();
})

</script>
