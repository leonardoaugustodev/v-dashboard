<template>
  <div class="flex flex-col mt-6">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Date
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Account
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Memo
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Category
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Inflow
              </th>
              <th
                class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Outflow
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <tr v-for="(u, index) in transactions" :key="index">

              <td class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                <input type="checkbox">
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium leading-5 text-gray-900">
                    {{ moment(u.date).format('DD/MM/YYYY') }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <span
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                      u.account.name
                  }}</span>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ u.memo }}
                </div>
              </td>

              <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                <span
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                      u.category?.name
                  }}</span>
              </td>


              <td class="px-6 py-4 text-sm leading-5 text-green-700 border-b border-gray-200 whitespace-nowrap">
                {{ u.inflow.toFixed(2) }}
              </td>

              <td class="px-6 py-4 text-sm leading-5 text-red-500 border-b border-gray-200 whitespace-nowrap">
                {{ u.outflow.toFixed(2) }}
              </td>


            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import moment from 'moment';
import { ITransaction } from '../schemas/transaction';
import { useTransactionStore } from '../store/transaction';
const store = useTransactionStore();

const props = defineProps<{ transactions: ITransaction[] }>();


// import AccountModal from "./AccountModal.vue";
// import { IAccount, useAccount } from "../hooks/useAccount";
// const showModal = ref(false);
// const editingAccount = ref<IAccount>()
// const { defaultAccount } = useAccount();
// const { accountTableData } = useAccount();
// const router = useRouter();
// const handleNavigate = (accountId: string) => {
//   router.push({
//     name: 'AccountDetail', params: { id: accountId }
//   })

// }
</script>
