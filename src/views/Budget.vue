<template>
  <div class="flex flex-col mt-6">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
        <table class="min-w-full table-auto">
          <thead>
            <tr>
              <th class="w-1/12 py-3 bg-gray-100 border-b border-gray-200"></th>
              <th
                class="w-5/12 px-2 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Category
              </th>
              <th
                class="w-2/12  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Budgeted
              </th>
              <th
                class="w-2/12  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Activity
              </th>
              <th
                class="w-2/12  px-2 py-3 text-xs font-medium leading-4 tracking-wider text-right text-gray-500 uppercase bg-gray-100 border-b border-gray-200">
                Balance
              </th>
            </tr>
          </thead>

          <tbody class="bg-white">
            <template v-for="(u, index) in store.currentBudget.rows" :key="index">

              <tr class="bg-slate-100">
                <td>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </td>
                <td class="w-3/6 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-left " colspan="4">
                  <div class="flex items-center">
                    <div class="text-sm font-bold leading-5 text-gray-900 ">
                      {{ u.category.name }}
                    </div>
                  </div>
                </td>

              </tr>

              <template v-if="u.children?.length">
                <tr v-for="(child, cIndex) in u.children" :key="cIndex">
                  <td class="w-min"><input type="checkbox" name="" id=""></td>
                  <td class="w-5/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-left">
                    <div class="flex items-center">
                      <div class="text-sm font-medium leading-5 text-gray-900">
                        {{ child.category.name }}
                      </div>
                    </div>
                  </td>
                  <td class="w-2/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      {{ child.budgeted?.toFixed(2) }}
                    </span>
                  </td>

                  <td class="w-2/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      {{ child.activity?.toFixed(2) }}
                    </span>
                  </td>

                  <td class="w-2/12 px-2 py-2 border-b border-gray-200 whitespace-nowrap text-right">
                    <span
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                      {{ child.balance?.toFixed(2) }}
                    </span>
                  </td>
                </tr>
              </template>
            </template>

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
