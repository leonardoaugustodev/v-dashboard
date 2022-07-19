<template>

  <div :class="`modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`" @keyup.esc="closeModal"
    @keyup.enter="handleSave">
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
          <p class="text-2xl font-bold">{{ isEdit ? "Edit" : "New" }} Category</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <input type="text" ref="modalInput" v-model="categoryToEdit.name" @keydown.enter.stop="handleSave"
          class="form-input w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />

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
import { useCategoryStore } from "../store/category";
import { useBudgetStore } from "../store/budget";
import { ICategory } from "../schemas/category";
import { IChildRow, IParentRow } from "../schemas/budget";

const emit = defineEmits(['close-modal'])
const categoryStore = useCategoryStore();
const budgetStore = useBudgetStore();

const { category, parentRowId, isEdit, row } = defineProps<{
  category: ICategory,
  parentRowId: any,
  isEdit: boolean,
  row: IChildRow |  IParentRow
}>()

let categoryToEdit = <ICategory>(category);
const modalInput = ref()

const closeModal = () => {
  emit('close-modal');
}


const handleSave = async () => {
  try {

    const storedCategory = await categoryStore.getOrAddCategory({ ...categoryToEdit });
    if (!storedCategory) return;

    if (isEdit) {
      categoryStore.updateCategory(categoryToEdit);
    }
    else {
      if (parentRowId) {
        budgetStore.addChildRow(parentRowId, storedCategory._id);
      }
      else {
        budgetStore.addParentRow(storedCategory._id)
      }
    }

    closeModal();
  } catch (err) {
    console.log(err);
  }
}

const handleDelete = () => {
  try {
    const categoryToDelete = categoryStore.categories.find(c => c._id === row.categoryId);

    if(categoryToDelete){
      categoryStore.delete(categoryToDelete._id);
    }

    budgetStore.deleteRow(row);
    closeModal();

  } catch (error) {

  }
}

onMounted(() => {
  nextTick(() => {
    if (modalInput && modalInput.value) {
      modalInput.value.focus();
    }
  })
});

</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
