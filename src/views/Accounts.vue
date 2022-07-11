<template>

  <AccountModal :account="editingAccount" :open="showModal" @close-modal="showModal = false" />

  <div class="flex justify-between full-width">
    <h3 class="text-gray-700 text-3xl font-medium">Accounts</h3>
    <button @click="handleNew"
      class="px-4 py-2 text-gray-200 bg-blue-800 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
      New account
    </button>
  </div>

  <div class="mt-8">
    <div class="flex flex-col mt-6">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Name
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Type
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Status
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                  Balance
                </th>
                <th class="px-6 py-3 bg-gray-100 border-b border-gray-200"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="(u, index) in accountStore.accounts" :key="index">
                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium leading-5 text-gray-900">
                      <span @click="handleNavigate(u._id)" class="hover:underline hover:cursor-pointer">{{ u.name
                      }}</span>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ u.type }}
                  </div>
                </td>

                <td class="px-6 py-4 border-b border-gray-200 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{{
                        u.status
                    }}</span>
                </td>

                <td class="px-6 py-4 text-sm leading-5 text-gray-500 border-b border-gray-200 whitespace-nowrap">
                  {{ formatCurrency(u.balance) }}
                </td>

                <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
                  <button href="#" class="text-indigo-600 hover:text-indigo-900" @click="handleEdit(u)">Edit</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import AccountModal from "../components/AccountModal.vue";
import { IAccount } from '../schemas/account';
import { useAccountStore } from '../store/account';
import { formatCurrency } from '../utils/currency';

const accountStore = useAccountStore();
const showModal = ref(false);
const router = useRouter();

const defaultAccount = <IAccount>{
  name: '',
  type: '',
  on_budget: true,
  status: 'active',
  balance: 0,
};
const editingAccount = ref<IAccount>(defaultAccount)

const handleNavigate = (accountId: string) => {
  router.push({
    name: 'AccountDetail', params: { id: accountId }
  })
}

const handleNew = () => {
  editingAccount.value = {
    ...defaultAccount,
  };
  showModal.value = true;

}

const handleEdit = (account: IAccount) => {
  editingAccount.value = {
    ...defaultAccount,
    ...account
  };
  showModal.value = true;

}

</script>
