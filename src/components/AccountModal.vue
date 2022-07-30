<template>

  <div :class="`modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`" @keyup.esc="closeModal">
    <div @click="closeModal" class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

    <div class="z-50 w-11/12 mx-auto overflow-y-auto bg-white rounded shadow-lg modal-container md:max-w-md">
      <div
        class="absolute top-0 right-0 z-50 flex flex-col items-center mt-4 mr-4 text-sm text-white cursor-pointer modal-close">
        <svg class="text-white fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
          viewBox="0 0 18 18">
          <path
            d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
        </svg>
        <span class="text-sm">(Esc)</span>
      </div>

      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="px-6 py-4 text-left modal-content">
        <!--Title-->
        <div class="flex items-center justify-between pb-3">
          <p class="text-2xl font-bold">{{ isEdit ? "Edit" : "New" }} Account</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <form>
          <label class="block my-2">
            <span class="block mb-1 text-sm font-medium text-slate-700">Name</span>

            <input type="text" ref="labelInput" v-model="accountToEdit.name"
              class="form-input w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
          </label>

          <label class="block my-2">
            <span class="block mb-1 text-sm font-medium text-slate-700">Type</span>
            <select v-model="accountToEdit.type"
              class="form-select w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <option v-for="(type, index) in accountStore.accountTypes" :value="type.value" :key="type.value">{{
                  type.label
              }}
              </option>
            </select>
            <!-- 
            <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
              Please provide a valid email address.
            </p> -->
          </label>

          <label class="block my-2">
            <span class="block mb-1 text-sm font-medium text-slate-700">Status</span>
            <select v-model="accountToEdit.status"
              class="form-select w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <!-- 
            <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
              Please provide a valid email address.
            </p> -->
          </label>

          <FormInput type="number" label="Starting balance" v-model="accountToEdit.balance" />

        </form>

        <!--Footer-->
        <div class="flex justify-between pt-2">
          <button @click="handleDelete"
            class="px-4 py-2 text-sm mr-2 text-red-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-red-400 focus:outline-none">
            Delete
          </button>

          <div class="flex justify-end">
            <button @click="closeModal"
              class="px-4 py-2 text-sm mr-2 text-indigo-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-indigo-400 focus:outline-none">
              Close
            </button>
            <button @click="handleSave"
              class="px-4 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, ComputedRef, nextTick, onMounted } from "vue";
import { IAccount } from "../schemas/account";
import { useAccountStore } from "../store/account";
import FormInput from './FormInput.vue'

const emit = defineEmits(['close-modal'])
const accountStore = useAccountStore();
const { account } = defineProps<{
  account: IAccount
}>()

const accountToEdit = ref<IAccount>(account);
const labelInput = ref();
const closeModal = () => {
  // accountToEdit.value = useAccount().defaultAccount;
  emit('close-modal');
}

const isEdit = computed((): boolean => {
  return account && !!account._id;
});

const handleSave = () => {
  accountStore.save({
    ...account,
    ...accountToEdit.value
  });
  closeModal();
}

const handleDelete = () => {
  accountStore.delete(account._id);
  closeModal();
}

onMounted(() => {
  nextTick(() => {
    if (labelInput && labelInput.value) {
      labelInput.value.focus();
    }
  })
});
</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
