<template>

  <!-- New Transaction -->
  <tr @keydown.esc="handleCancelEdit">
    <td>
      <input type="date" ref="dateInput" v-model="transactionToEdit.date"
        class="text-sm leading-0 border-0 border-b-2 border-gray-300" placeholder="Select date">
    </td>
    <td>
      <select type="text" v-model="transactionToEdit.accountId"
        class="text-sm leading-0 border-0 border-b-2 border-gray-300" >
        <option v-for="(option) in accountStore.getAccountsPicklist" :value="option.value" :key="option.value">{{
            option.label
        }}
        </option>
      </select>
    </td>
    <td>
      <input type="text" ref="labelInput" v-model="transactionToEdit.memo"
        class="text-sm leading-0 border-0 border-b-2 border-gray-300" />
    </td>
    <td>
      <!-- <select type="text" v-model="transactionToEdit.categoryId"
        class="text-sm leading-0 border-0 border-b-2 border-gray-300">
        <option v-for="(option) in categoryStore.getCategoriesPicklist" :value="option.value" :key="option.value">{{
            option.label
        }}
        </option>
      </select> -->
      <SelectInput :options="categoryStore.getCategoriesPicklist" :value="transactionToEdit.categoryId" @select="handleSelectCategory"/>
    </td>
    <td>
      <input type="number" v-model="transactionToEdit.inflow"
        class="text-sm text-right leading-0 border-0 border-b-2 border-gray-300">
    </td>
    <td>
      <input type="number" v-model="transactionToEdit.outflow"
        class="text-sm text-right leading-0 border-0 border-b-2 border-gray-300">
    </td>

    <td class="text-center">
      <button @click="handleSave"
        class="px-2 py-1 text-sm tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">Save</button>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useTransactionStore } from '../store/transaction';
import { useCategoryStore } from '../store/category';
import { useAccountStore } from '../store/account';
import { formatCurrency } from '../utils/currency';
import { ITransaction } from '../schemas/transaction'
import SelectInput from './SelectInput.vue'

const { transaction, accountId } = defineProps(['transaction', 'accountId']);
const emit = defineEmits(['add-transaction']);

const dateInput = ref();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const accountStore = useAccountStore();
const isEditing = ref(false);

const defaultTransaction = {
  date: new Date(),
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
  emit('add-transaction');
  isEditing.value = false;
}

const handleCancelEdit = () => {
  isEditing.value = false;
}

const handleSelectCategory = (categorySelected: string) => {
  transactionToEdit.value.categoryId = categorySelected;
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
