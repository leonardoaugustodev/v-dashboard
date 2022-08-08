<template>

  <!-- New Transaction -->
  <tr @keydown.esc="handleCancelEdit" @keydown.enter.stop="handleSave">
    <td>
      <input type="date" ref="dateInput" v-model="transactionToEdit.date"
        class="w-full text-sm leading-0 border-0 border-b-2 border-gray-300" placeholder="Select date">
    </td>
    <td>
      <SelectInput :options="accountStore.getAccountsPicklist" :value="transactionToEdit.accountId"
        @select="handleSelectAccount" />
    </td>
    <td>
      <input type="text" ref="labelInput" v-model="transactionToEdit.memo"
        class="w-full text-sm leading-0 border-0 border-b-2 border-gray-300" />
    </td>
    <td>
      <SelectInput ref="categoryInput" :options="categoryStore.getCategoriesPicklist"
        :value="transactionToEdit.categoryId" @select="handleSelectCategory" />
    </td>
    <td>
      <input type="number" v-model="transactionToEdit.inflow"
        class="w-full text-sm text-right leading-0 border-0 border-b-2 border-gray-300">
    </td>
    <td>
      <input type="number" v-model="transactionToEdit.outflow"
        class="w-full text-sm text-right leading-0 border-0 border-b-2 border-gray-300">
    </td>

    <td class="text-center" v-if="showSaveButton">
      <button @click="handleCancelEdit" class="px-2 py-1 text-xs text-red-400 hover:bg-gray-50"><svg
          xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg></button>
      <button @click="handleSave" class="px-2 py-1 text-xs text-teal-400 hover:bg-gray-50"><svg
          xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg></button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import moment from 'moment';
import { useTransactionStore } from '../store/transaction';
import { useCategoryStore } from '../store/category';
import { useAccountStore } from '../store/account';
import { formatCurrency } from '../utils/currency';
import { ITransaction } from '../schemas/transaction'
import SelectInput from './SelectInput.vue'
import { useRoute } from 'vue-router';
import { upsert } from '../use/useTransaction';

const { transaction, accountId, hideSaveButton } = defineProps(['transaction', 'accountId', 'hideSaveButton']);
const emit = defineEmits(['add-transaction', 'cancel', 'amount-change']);

const dateInput = ref();
const categoryInput = ref();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const isEditing = ref(false);
const showSaveButton = ref(!hideSaveButton);
const route = useRoute();
const defaultTransaction = {
  date: moment().format('YYYY-MM-DD'),
  day: new Date().getDay(),
  month: new Date().getMonth(),
  year: new Date().getFullYear(),
  accountId: route.params.id,
  categoryId: '',
  inflow: 0,
  outflow: 0,
  cleared: false
}

const transactionToEdit = ref<ITransaction>(transaction || { ...defaultTransaction });

const initialAmounts = {
  _id: transactionToEdit.value._id,
  amount: (transactionToEdit.value.inflow - transactionToEdit.value.outflow) || 0,
}

const handleEdit = () => {
  isEditing.value = true;
}

const handleSave = async () => {

  await upsert([{
    ...transactionToEdit.value
  }], [initialAmounts]);
  emit('add-transaction');

  resetFields();
  focusDate();
}

const handleCancelEdit = () => {
  isEditing.value = false;
  emit('cancel');
}

const handleSelectCategory = (categorySelected: string) => {
  transactionToEdit.value.categoryId = categorySelected;
}

const handleSelectAccount = (accountSelected: string) => {
  transactionToEdit.value.accountId = accountSelected;
}

const resetFields = () => {
  transactionToEdit.value = { ...defaultTransaction as ITransaction };
  if (categoryInput && categoryInput.value) {
    categoryInput.value.clearSelection();
  }
}

const focusDate = () => {
  if (dateInput && dateInput.value) {
    dateInput.value.focus();
  }
}


onMounted(() => {
  nextTick(() => {
    focusDate()
  })
})

</script>

<style>
</style>
