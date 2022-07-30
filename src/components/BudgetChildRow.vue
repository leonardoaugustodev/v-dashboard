<template>
  <tr>
    <td class="w-5/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-left">
      <div class="flex items-center">
        <div class="px-2 pr-6">
          <input type="checkbox" aria-label="budget row checkbox" @change="handleSelectRow($event)">
        </div>
        <div class="text-sm font-medium leading-5 text-gray-700">
          <span @click="handleUpdateCategory" class="hover:underline hover:cursor-pointer">{{ row.category?.name
          }}</span>
        </div>
      </div>
    </td>
    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span @click="handleBudgetedClick" v-if="!editBudgeted"
        class="inline-flex px-2 text-xs font-semibold leading-5 text-indigo-800 bg-indigo-100 rounded-full">
        {{ formatCurrency(row.budgeted) }}
      </span>
      <input v-if="editBudgeted" @focus="($event.target as HTMLInputElement).select()" @keypress.enter="handleSaveBudgeted"
        @keydown.esc="cancelChange" ref="budgetedInput" type="number" v-model="editableRow.budgeted"
        class="w-20 h-6 text-xs font-semibold leading-5 text-indigo-800 bg-indigo-100 border-indigo-200 rounded-full">
    </td>

    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
        {{ formatCurrency(row.activity) }}
      </span>
    </td>

    <td class="w-min px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
      <span class="inline-flex px-2 text-xs font-semibold leading-5  rounded-full"
        :class="row.balance < 0 ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'">
        {{ formatCurrency(row.balance) }}
      </span>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { formatCurrency } from '../utils/currency';
import { getDoc, doc, collection, getDocs, setDoc, where, query, limit, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebase';
import { IBudgetRow } from '../schemas/budget';
import { generateId } from '../utils/hash';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const { row } = defineProps(['row']);

const editableRow = <IBudgetRow>({ ...row });
const budgetedInput = ref();
const editBudgeted = ref(false);
const emit = defineEmits(['update-category', 'row-select', 'save']);

const handleSelectRow = (event: any) => {
  emit('row-select', row, event.target.checked);
}

const handleUpdateCategory = () => {
  emit('update-category');
}

const handleBudgetedClick = () => {
  editBudgeted.value = true;
  nextTick(() => {
    if (budgetedInput && budgetedInput.value) {
      budgetedInput.value.focus();
    }
  })
}

const handleSaveBudgeted = async () => {

  const rowDocs = await getDocs(
    query(
      collection(db, 'budgetRows'),
      where("userId", "==", userStore.user.uid),
      where("budgetId", "==", row.budgetId),
      where("categoryId", "==", row.categoryId),
      limit(1)
    )
  );

  if (!rowDocs.docs.length) {
    // Create a budget row
    const rowId = generateId('budgetRow');
    await setDoc(doc(db, 'budgetRows', rowId), {
      _id: rowId,
      userId: userStore.user.uid,
      ...editableRow
    });
  }
  else {
    const row = rowDocs.docs[0].data();
    await updateDoc(doc(db, "budgetRows", row._id), { budgeted: editableRow.budgeted });
  }
  emit('save');
  editBudgeted.value = false;
}

const cancelChange = () => {
  editBudgeted.value = false;
}

</script>

<style>
</style>
