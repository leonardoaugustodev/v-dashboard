<template>
  <div class="flex flex-col mt-6">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full table-auto">
          <thead>
            <tr>
              <!-- <th class="px-2 py-3 bg-gray-100 border-b border-gray-200"></th> -->
              <th
                class="w-3/6 px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Category
              </th>
              <th
                class="w-1/6  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Budgeted
              </th>
              <th
                class="w-1/6  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Activity
              </th>
              <th
                class="w-1/6  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Balance
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <tr v-for="(u, index) in store.currentBudget.rows" :key="index">

              <!-- <td class="px-2 py-4 text-sm font-medium leading-5 text-right border-b border-gray-200 whitespace-nowrap">
              </td> -->

              <td class="w-3/6 px-2 py-4 border-b border-gray-200 whitespace-nowrap text-left">
                <div class="flex items-center">
                  <div class="text-sm font-medium leading-5 text-gray-900">
                    {{ u.category.name }}
                  </div>
                </div>
              </td>

              <td class="w-1/6 px-2 py-4 border-b border-gray-200 whitespace-nowrap text-right">
                <span v-if="!u.category.isParent"
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  {{ u.budgeted?.toFixed(2) }}
                </span>
              </td>

              <td class="w-1/6 px-2 py-4 border-b border-gray-200 whitespace-nowrap text-right">
                <span v-if="!u.category.isParent"
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  {{ u.activity?.toFixed(2) }}
                </span>
              </td>

              <td class="w-1/6 px-2 py-4 border-b border-gray-200 whitespace-nowrap text-right">
                <span v-if="!u.category.isParent"
                  class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  {{ u.balance?.toFixed(2) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

]<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';
import { useBudgetStore } from '../store/budget';
const store = useBudgetStore();


</script>
