<template>

  <CategoryModal v-if="showCategoryModal" :options="newCategoryOptions" @close-modal="handleCloseCategoryModal"
    @save="handleSaveCategoryModal" />

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
            <div class="rounded-full px-2 py-1">{{ formatCurrency(summary.notBudgetLastMonth) }}</div>
            <div class="text-xs text-gray-500">Not budgeted last month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div class="rounded-full px-2 py-1">{{ formatCurrency(summary.overspentLastMonth) }}</div>
            <div class="text-xs text-gray-500">Overspent last month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div class="rounded-full px-2 py-1">{{ formatCurrency(summary.income) }}</div>
            <div class="text-xs text-gray-500">Income this month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div class="rounded-full px-2 py-1">{{ formatCurrency(summary.budgeted) }}</div>
            <div class="text-xs text-gray-500">Budgeted this month</div>
          </div>
          <div class="flex flex-col items-center mx-2">
            <div class="text-bold rounded-full px-2 py-1"
              :class="summary.available < 0 ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'">{{
                  formatCurrency(summary.available)
              }}</div>
            <div class="text-xs text-gray-500 ">
              {{ (summary.available || 0) >= 0 ? 'Available to budget' : 'Overbudgeted' }}</div>
          </div>
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
                <button class="pl-2 brightness-150" @click="handleNewCategory(null)">
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
            <template v-for="(u, index) in budget?.rows" :key="index">

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
                          @click="handleNewCategory(u.category?._id)">
                          <span class="text-xs text-center">+ sub category</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

              </tr>

              <template v-if="u.children?.length && !u.isCollapsed">
                <BudgetChildRow v-for="(child, cIndex) in u.children" :key="`${child.categoryId}_${child.budgetId}`"
                  :row="child" @update-category="handleUpdateRowCategory(child)" @row-select="handleSelectRow"
                  @save="navigate(0)" />
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
import { IBudget, IBudgetRow } from '../schemas/budget';
import { ICategory } from '../schemas/category';
import { formatCurrency } from '../utils/currency';
import { generateId } from '../utils/hash';
import CategoryModal, { ICategoryModal } from '../components/CategoryModal.vue';
import { useCategoryStore } from '../store/category';
import BudgetChildRow from '../components/BudgetChildRow.vue';
import { useTransactionStore } from '../store/transaction';
import { ITransaction } from '../schemas/transaction';
import { getDoc, doc, collection, getDocs, setDoc, where, query } from 'firebase/firestore';
import { db } from '../database/firebase';
import { useUserStore } from '../store/user';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
const selectedRows = ref<Array<IBudgetRow>>([]);
const budget = ref<IBudget>();
const previousBudget = ref<{ income: number, outflow: number, budgeted: number }>();
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const transactions = ref<Array<ITransaction>>();

// ---- COMPUTED ----
const budgetMonth = computed(() => {
  return moment().month(currentMonth.value).format('MMMM')
})

const budgetYear = computed(() => {
  return moment().year(currentYear.value).format('YYYY')
})

const summary = computed(() => {
  // Calculation for the budget
  let income = 0;
  let budgeted = 0;
  let available = 0;
  let notBudgetLastMonth = 0;
  let overspentLastMonth = 0;

  if (transactions.value) {
    income = transactions.value.reduce((acc, cv) => acc + (cv.inflow || 0), 0);
  }

  if (budget.value?.rows) {
    const allChilds = budget.value.rows.flatMap(row => row.children);
    budgeted = allChilds.reduce((acc, cv) => acc + (cv.budgeted || 0), 0);
  }

  if (previousBudget.value) {
    notBudgetLastMonth = previousBudget.value.income - previousBudget.value.budgeted;
    overspentLastMonth = previousBudget.value.budgeted - previousBudget.value.outflow;
  }

  available = notBudgetLastMonth + overspentLastMonth + income - budgeted;

  return {
    income,
    budgeted,
    available,
    notBudgetLastMonth,
    overspentLastMonth
  };
})

// ---- METHODS ----
const loadBudget = async (month: number, year: number) => {
  // Load budget and build from database
  const userId = userStore.user.uid;
  const budgetId = `budget_${year}_${month}_${userId}`;

  // Retrieve budget
  const budgetDoc = await getDoc(doc(db, 'budgets', budgetId));

  if (!budgetDoc.exists()) {
    // Create a new budget
    try {
      budget.value = await createBudget(month, year);
    } catch (e) {
      console.error('Error adding budget: ', e);
    }
  }
  else {
    budget.value = (budgetDoc.data() as IBudget);
  }

  if (budget.value && budget.value._id) {

    // Retrieve categories
    const categories = categoryStore.categories.filter(c => c.isActive);

    // Build categories hierarchy
    let rows = <Array<IBudgetRow>>[];
    for (const category of categories) {
      const defaultCategory = {
        budgetId: budget.value._id,
        category,
        categoryId: category._id,
        children: [],
        budgeted: 0,
        activity: 0,
        balance: 0
      };

      // Find parent category
      if (category.parentId) {
        let parentRow = rows.find(c => c.categoryId === category.parentId);
        if (!parentRow) {
          parentRow = {
            ...defaultCategory,
            categoryId: category.parentId,
            category: categories.find(c => c._id === category.parentId)
          };
          rows.push(parentRow);
        }
        parentRow.children.push(defaultCategory);
      }
      else {
        let parentRow = rows.find(c => c.categoryId === category._id);
        if (!parentRow) rows.push(defaultCategory);
      }
    }
    budget.value.rows = rows;

    // Retrieve budget rows
    const rowDocs = await getDocs(
      query(
        collection(db, 'budgetRows'),
        where('userId', '==', userStore.user.uid),
        where("budgetId", "==", budget.value._id)
      )
    );

    for (const doc of rowDocs.docs) {
      const row = doc.data();

      budget.value.rows.forEach(r => {
        r.children.forEach(c => {
          if (c.categoryId === row.categoryId) {
            c.budgeted += row.budgeted;
            if (c.balance == 0) c.balance = row.budgeted;
          }
        })
      })
    }

    // Retrieve month transactions
    const transactionDocs = await getDocs(
      query(
        collection(db, 'transactions'),
        where('userId', '==', userStore.user.uid),
        where('month', '==', budget.value?.month),
        where('year', '==', budget.value?.year)
      )
    );

    transactions.value = [...transactionDocs.docs.map(doc => (doc.data() as ITransaction))];

    for (const transaction of transactions.value) {
      budget.value.rows.forEach(r => {
        r.children.forEach(c => {
          if (c.categoryId === transaction.categoryId) {
            c.activity += (transaction.inflow - transaction.outflow);
            c.balance += c.activity;
          }
        })
      });
    }

  }

  loadPreviousBudget();

}

const loadPreviousBudget = async () => {

  if (budget.value) {

    // Retrieve month transactions
    const transactionDocs = await getDocs(
      query(
        collection(db, 'transactions'),
        where('userId', '==', userStore.user.uid)
      )
    );

    const transactions = transactionDocs.docs
      .map(doc => doc.data() as ITransaction)
      .filter(t => budget.value && moment([t.year, t.month]) <= moment([budget.value.year, budget.value.month]).subtract(1, 'month'));

    const income = transactions.reduce((acc, cv) => acc + (cv.inflow || 0), 0);
    const outflow = transactions.reduce((acc, cv) => acc + (cv.outflow || 0), 0);

    const rowDocs = await getDocs(
      query(
        collection(db, 'budgetRows'),
        where('userId', '==', userStore.user.uid)
      )
    );

    const pastRows = rowDocs.docs
      .map(doc => doc.data() as IBudgetRow)
      .filter(row => row.budgetId < budget.value?._id)

    const budgeted = pastRows.reduce((acc, cv) => acc + (cv.budgeted || 0), 0);

    previousBudget.value = {
      income, outflow, budgeted
    }

  }
}

const createBudget = async (month: number, year: number) => {
  console.info('Creating budget ...');
  try {

    const userId = userStore.user.uid;
    const budgetId = `budget_${year}_${month}_${userId}`;
    const newBudget = {
      _id: budgetId,
      userId: userStore.user.uid,
      month: month,
      year: year
    };

    await setDoc(doc(db, 'budgets', budgetId), newBudget);
    return newBudget;

  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

const navigate = (decreaseOrIncrease: number) => {
  const currentDate = moment([currentYear.value, currentMonth.value]);
  const newDate = currentDate.add(decreaseOrIncrease, 'month');

  currentMonth.value = newDate.month();
  currentYear.value = newDate.year();
  loadBudget(newDate.month(), newDate.year());

}

let newCategoryOptions = <ICategoryModal>{};
const handleNewCategory = (parentId: any) => {
  if (parentId) {
    newCategoryOptions.parentId = parentId;
  }

  newCategoryOptions.budgetId = budget.value?._id;
  newCategoryOptions.categoryId = undefined;
  showCategoryModal.value = true;

  // parentRowId.value = pRowId;
  // isEditing.value = false;
}

const handleUpdateRowCategory = (row: IBudgetRow) => {
  if (row.categoryId) {
    newCategoryOptions.categoryId = row.categoryId;
    newCategoryOptions.budgetId = budget.value?._id;
    newCategoryOptions.parentId = row.category?.parentId;

    // isEditing.value = true;
    // editingRow.value = row;
    showCategoryModal.value = true;
  }
}

const handleSaveCategoryModal = () => {
  newCategoryOptions.parentId = undefined;
  navigate(0);
}





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

const updateBudget = () => {
  navigate(0);
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
  navigate(0);
});


</script>
