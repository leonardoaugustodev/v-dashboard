<template>

  <!-- New Transaction -->
  <tr @keydown.esc="handleCancelEdit">
    <td>
      <input type="date" ref="dateInput" v-model="transactionToEdit.date"
        class="w-full text-sm leading-0 border-0 border-b-2 border-gray-300" placeholder="Select date">
    </td>
    <td>
      <SelectInput :options="accountStore.getAccountsPicklist" :value="transactionToEdit.accountId" @select="handleSelectAccount"/>
    </td>
    <td>
      <input type="text" ref="labelInput" v-model="transactionToEdit.memo"
        class="w-full text-sm leading-0 border-0 border-b-2 border-gray-300" />
    </td>
    <td>
      <SelectInput :options="categoryStore.getCategoriesPicklist" :value="transactionToEdit.categoryId" @select="handleSelectCategory"/>
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
      <button @click="handleSave"
        class="px-2 py-1 text-sm tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">Save</button>
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

const { transaction, accountId, hideSaveButton } = defineProps(['transaction', 'accountId', 'hideSaveButton']);
const emit = defineEmits(['add-transaction']);

const dateInput = ref();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const isEditing = ref(false);
const showSaveButton = ref(!!hideSaveButton); 

const todayIso = moment().format('YYYY-MM-DD');
const defaultTransaction = {
  date: todayIso,
  accountId,
  inflow: 0,
  outflow: 0,
  cleared: false
}

const transactionToEdit = ref<ITransaction>(transaction || defaultTransaction);

const handleEdit = () => {
  isEditing.value = true;
}

const handleSave = () => {
  transactionStore.save(transactionToEdit.value);
  isEditing.value = false;
  emit('add-transaction');
}

const handleCancelEdit = () => {
  isEditing.value = false;
}

const handleSelectCategory = (categorySelected: string) => {
  transactionToEdit.value.categoryId = categorySelected;
}

const handleSelectAccount = (accountSelected: string) => {
  transactionToEdit.value.accountId = accountSelected;
}

onMounted(() => {
  nextTick(() => {
    if (dateInput && dateInput.value) {
      dateInput.value.focus();
    }
  })
})

</script>

<style>
</style>
