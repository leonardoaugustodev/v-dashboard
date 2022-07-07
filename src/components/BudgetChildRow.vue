<template>
  <tr>
    <td class="w-5/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-left">
      <div class="flex items-center">
        <div class="px-2 pr-6">
          <input type="checkbox" aria-label="budget row checkbox" @change="handleSelectRow($event, row)">
        </div>
        <div class="text-sm font-medium leading-5 text-gray-700">
          {{ row.category?.name }}
        </div>
      </div>
    </td>
    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span @dblclick="handleUpdateRow" class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
        {{ formatCurrency(row.budgeted) }}
      </span>
    </td>

    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
        {{ formatCurrency(row.activity) }}
      </span>
    </td>

    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
        {{ formatCurrency(row.balance) }}
      </span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBudgetStore } from '../store/budget';
import { formatCurrency } from '../utils/currency';
import { IChildRow } from '../schemas/budget'

const { row } = defineProps(['row']);

const editableRow = ref<IChildRow>(row);

const budgetStore = useBudgetStore();

const handleUpdateRow = () => {
  budgetStore.updateChildRow(editableRow.value);
}

</script>

<style>
</style>
