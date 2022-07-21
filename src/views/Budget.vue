<template>

  <CategoryModal v-if="showCategoryModal" :category="newCategory" :parent-row-id="parentRowId" :is-edit="isEditing"
    :row="editingRow" @close-modal="handleCloseCategoryModal" />

  <div class="flex justify-between">
    <div class="w-full sm:w-1/1 xl:w-3/3">
      <div class="flex justify-between px-5 py-6 bg-white rounded-md shadow-sm">
        <div class="flex items-center">
          <button class="px-2 h-10 w-10 rounded-full hover:bg-gray-100" @click="navigate(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div class="mx-5 flex flex-col justify-center items-center">
            <h4 class="text-2xl font-semibold text-gray-700">{{ budgetMonth }}</h4>
            <div class="text-gray-500">{{ budgetYear }}</div>
          </div>
          <button class="px-2 h-10 w-10 rounded-full hover:bg-gray-100" @click="navigate(+1)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="flex self-end">
          <div class="flex flex-col items-center mx-2">
            <div>{{ formatCurrency(0) }}</div>
            <div class="text-xs text-gray-500">Not budgeted last month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div>{{ formatCurrency(0) }}</div>
            <div class="text-xs text-gray-500">Overspent last month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div>{{ formatCurrency(summary.income) }}</div>
            <div class="text-xs text-gray-500">Income this month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div>{{ formatCurrency(summary.budgeted) }}</div>
            <div class="text-xs text-gray-500">Budgeted this month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div>{{ formatCurrency(summary.available) }}</div>
            <div class="text-xs text-gray-500">Available to budget | Overbudgeted</div>
          </div>

          <!-- <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(selectedSummary.budgeted) }}</h4>
            <div class="text-gray-500">Budgeted</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">+</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(selectedSummary.activity) }}</h4>
            <div class="text-gray-500">Activity</div>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl text-gray-400">=</h4>
          </div>

          <div class="mx-5">
            <h4 class="text-2xl font-semibold text-gray-700">{{ formatCurrency(selectedSummary.balance) }}</h4>
            <div class="text-gray-500">Balance</div>
          </div> -->
        </div>


      </div>
    </div>

  </div>

  <div class="flex flex-col mt-6">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full table-auto">
          <thead>
            <tr>
              <th
                class="flex items-center w-full px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                <div>Category</div>
                <button class="pl-2 brightness-150" @click="handleNewCategory(null, null)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </th>
              <th
                class="w-min px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Budgeted
              </th>
              <th
                class="w-min px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Activity
              </th>
              <th
                class="w-min px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Balance
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <template v-for="(u, index) in budgetStore.currentBudget?.rows" :key="index">

              <tr class="bg-slate-100">
                <td class="w-auto px-2 py-2 border-b border-gray-200 whitespace-nowrap text-left " colspan="4">
                  <div class="flex justify-between">

                    <div class="flex items-center">
                      <div class="px-2 cursor-pointer" @click="u.isCollapsed = !u.isCollapsed">
                        <svg v-if="u.isCollapsed" xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 hover:fill-slate-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="text-sm font-bold leading-5 text-gray-900 ">
                        <span @click="handleUpdateRowCategory(u)" class="hover:underline hover:cursor-pointer">
                          {{ u.category?.name }}
                        </span>
                      </div>

                    </div>
                    <div>
                      <div class="px-2">
                        <button class="px-2 rounded opacity-20  hover:opacity-60"
                          @click="handleNewCategory(u.category?._id, u._id)">
                          <span class="text-xs text-center">+ sub category</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

              </tr>

              <template v-if="u.children?.length && !u.isCollapsed">
                <BudgetChildRow v-for="(child, cIndex) in u.children" :key="cIndex" :row="child"
                  @update-category="handleUpdateRowCategory(child)" @row-select="handleSelectRow" />
              </template>
            </template>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import moment from 'moment';
import { useBudgetStore } from '../store/budget';
import { IChildRow, IParentRow } from '../schemas/budget';
import { ICategory } from '../schemas/category';
import { formatCurrency } from '../utils/currency';
import { generateId } from '../utils/hash';
import CategoryModal from '../components/CategoryModal.vue';
import { useCategoryStore } from '../store/category';
import BudgetChildRow from '../components/BudgetChildRow.vue';
import { useTransactionStore } from '../store/transaction';
import { ITransaction } from '../schemas/transaction';
const budgetStore = useBudgetStore();
const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();

const selectedRows = ref<Array<IChildRow>>([]);

const handleSelectRow = (row: any, checked: boolean) => {
  console.log(row, checked);
  if (checked) {
    selectedRows.value.push(row);
  }
  else {
    selectedRows.value.splice(
      selectedRows.value.findIndex(r => r._id === row._id), 1
    )
  }
}

const selectedSummary = computed(() => {
  return selectedRows.value.reduce((pv, cv) => {
    return {
      budgeted: pv.budgeted + (cv.budgeted || 0),
      activity: pv.activity + (cv.activity || 0),
      balance: pv.balance + (cv.balance || 0),
    }
  }, {
    budgeted: 0,
    activity: 0,
    balance: 0
  })
});

const summary = computed(() => {

  let summary = {
    income: 0,
    budgeted: 0,
    available: 0
  };

  let transactions = <Array<ITransaction>>[];
  if (budgetStore?.currentBudget) {
    transactions = transactionStore.getTransactionsByMonth(
      budgetStore.currentBudget.month, budgetStore.currentBudget.year
    );

    summary.income = transactions.reduce((acc, cv) => {
      return acc + cv.inflow
    }, 0);

    summary.budgeted = budgetStore.childRows.filter(r => {
      return r.budgetId === budgetStore.currentBudget?._id
    }).reduce((acc, cv) => acc + (cv.budgeted || 0), 0);

    summary.available = summary.income - summary.budgeted;
  }

  return summary;

})

const budgetMonth = computed(() => {
  let currentMonth = budgetStore.currentBudget?.month || new Date().getMonth();
  return moment().month(currentMonth).format('MMMM')
})

const budgetYear = computed(() => {
  return moment().year(budgetStore.currentBudget?.year || new Date().getFullYear()).format('YYYY')
})

const navigate = (decreaseOrIncrease: number) => {
  const { currentMonth, currentYear } = budgetStore;

  let newMonth = currentMonth + decreaseOrIncrease;
  let newYear = currentYear;
  if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }
  else if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  }

  budgetStore.selectDate(newMonth, newYear);
}

const showCategoryModal = ref(false);
const isEditing = ref(false);
const parentRowId = ref();
const editingRow = ref();

const defaultCategory = <ICategory>({
  name: '',
  isActive: true,
});

let newCategory = ref(<ICategory>({}));

const handleNewCategory = (parentId: any, pRowId: any) => {
  if (parentId) {
    newCategory.value.parentId = parentId;
  }

  parentRowId.value = pRowId;
  showCategoryModal.value = true;
  isEditing.value = false;
}

const handleUpdateRowCategory = (row: IChildRow | IParentRow) => {
  if (row.category) {
    newCategory.value = { ...row.category };
    isEditing.value = true;
    editingRow.value = row;
    showCategoryModal.value = true;
  }
}

const handleCloseCategoryModal = () => {
  newCategory.value = {
    name: '',
    isActive: true,
  };
  showCategoryModal.value = false;
}

const returnCategoryById = (categoryId: string) => {
  return categoryStore.categories.find(
    (cat) => cat._id === categoryId
  );
}

onMounted(() => {
  // if(!store.currentBudget){
  //   const { currentMonth, currentYear } = store;
  //   store.cloneBudget(currentMonth, currentYear);
  // }
});


</script>
