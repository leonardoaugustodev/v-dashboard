<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Welcome {{ user.displayName }}</h3>

    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">

        <div class="w-full px-6">
          <div class="flex items-start justify-center px-5 py-5 bg-white rounded-lg shadow-sm h-full">


            <!-- <h2 class="mb-4 text-lg text-gray-400">Top 5 categories</h2>
            <table class="min-w-full">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Category
                  </th>
                  <th
                    class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Amount
                  </th>

                </tr>
              </thead>

              <tbody class="bg-white">
                <tr v-for="category in categorySummary" :key="category.name">
                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="grey">
                        <path fill-rule="evenodd"
                          d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
                          clip-rule="evenodd" />
                      </svg>
                      <div class="ml-4">

                        <div class="text-sm font-medium leading-5 text-gray-900">
                          {{ category.name }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ formatCurrency(category.value) }}
                    </div>
                  </td>

                </tr>
              </tbody>
            </table> -->
            <div class="flex flex-col items-center w-1/3"></div>
            <div class="flex flex-col items-center w-1/3 h-56 justify-end">
              <h3 class="self-start font-bold mb-2">Week Outflows</h3>
              <div class="w-full flex gap-3 h-full">
                <div v-for="summary in transactionSummary" :key="summary.name" class="flex flex-col items-center h-full">
                  <div
                    class="flex items-center justify-end flex-col bg-white border border-gray-50 rounded-lg shadow-lg h-full">
                    <div
                      class="bg-blue-400 hover:brightness-110 rounded-lg shadow-sm text-xs text-center pt-1 text-white"
                      :style="`height: ${summary.percent}%; width: 40px`">
                      {{ summary.value }}
                    </div>
                  </div>
                  <div class="text-sm mt-3 text-gray-400">{{ summary.formatedDate }}</div>
                </div>
              </div>

            </div>
            <div class="flex flex-col items-center w-1/3">

              <div class="my-2 w-full">
                <h3 class="self-start font-bold mb-2">Accounts</h3>
                <div v-for="account in useAccountStore().accounts" :key="account._id" class="my-2">
                  <AccountBalanceCard :account="account" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>

    <div class="mt-8"></div>

    <!-- <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "../store/user";
import { useCategoryStore } from "../store/category";
import { useAccountStore } from "../store/account";
import { getByDate } from "../use/useTransaction";
import moment from "moment";
import { ITransaction } from "../schemas/transaction";
import { formatCurrency } from "../utils/currency";
import CreditCard from "../components/CreditCard.vue";
import AccountBalanceCard from "../components/AccountBalanceCard.vue";

interface ISummary {
  name: string;
  formatedDate: string;
  value: number;
  percent?: number;
}

const last30DaysTransactions = ref<Array<ITransaction>>([]);
const user = ref(useUserStore().user);
const data = ref([30, 40, 60, 70, 5]);

const last7DaysLabels = [0, 1, 2, 3, 4, 5, 6].map((n) => {
  return moment().subtract(n, 'days').format('DD/MM')
});

const transactionSummary = ref<Array<ISummary>>([]);
const categorySummary = ref<Array<ISummary>>([]);

const getLastTransactions = async () => {
  const dueDate = moment().subtract(30, 'days');
  last30DaysTransactions.value = await getByDate(dueDate.format('YYYY-MM-DD')) as unknown as Array<ITransaction>;
}

const summarizeLast7Days = () => {
  const last7Days = [0, 1, 2, 3, 4, 5, 6].map((n) => {
    return moment().subtract(n, 'days').format('YYYY-MM-DD')
  });

  for (const day of last7Days) {
    transactionSummary.value.push({
      name: day,
      formatedDate: moment(day).format('MMM DD'),
      value: 0
    })
  }

  const last7Day = moment().subtract(7, 'days').format('YYYY-MM-DD');
  const transactions = last30DaysTransactions.value.filter(t => t.date >= last7Day);

  for (const transaction of transactions) {

    const existing = transactionSummary.value.find(t => t.name === transaction.date);

    if (existing) {
      existing.value += transaction.outflow;
    }
  }

  const maximumValue = Math.max(...transactionSummary.value.filter(o => o.value > 0).map(o => o.value));

  transactionSummary.value = transactionSummary.value.map(t => {
    return {
      ...t,
      percent: (t.value / maximumValue) * 100
    }
  });

}

const summarizeByCategory = () => {
  const categoryStore = useCategoryStore();
  last30DaysTransactions.value.forEach(t => {
    const valueToAdd = (t.inflow - t.outflow);
    const categoryName = t.categoryId ? categoryStore.getCategory(t.categoryId)?.name : 'Empty category';
    let oldValue = categorySummary.value.find((c: ISummary) => c.name === categoryName);

    let newSummary = { name: categoryName, value: valueToAdd }
    if (oldValue) {
      newSummary.value += oldValue.value + valueToAdd;
      oldValue = { ...newSummary as ISummary };
    }
    else {
      categorySummary.value.push(newSummary as ISummary);
    }
  });

  categorySummary.value.sort((a: ISummary, b: ISummary) => a.value - b.value);
  categorySummary.value = categorySummary.value.slice(0, 5);
}

onMounted(async () => {
  await getLastTransactions();
  summarizeLast7Days();
  summarizeByCategory();
});

</script>
