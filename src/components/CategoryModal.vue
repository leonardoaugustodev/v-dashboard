<template>

  <div :class="`modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center`"
    @keyup.esc="handleCloseModal" @keyup.enter="handleSave">
    <div @click="handleCloseModal" class="absolute w-full h-full bg-gray-900 opacity-50 modal-overlay"></div>

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
          <p class="text-2xl font-bold">{{ !options.parentId ? "Edit" : "New" }} Category</p>
          <div class="z-50 cursor-pointer modal-close" @click="handleCloseModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <input type="text" ref="modalInput" v-model="categoryName" @keydown.enter.stop="handleSave"
          class="form-input w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />

        <!--Footer-->
        <div class="flex justify-between pt-2">
          <button @click="handleHide"
            class="px-4 py-2 text-sm mr-2 text-red-500 bg-transparent rounded-lg hover:bg-gray-100 hover:text-red-400 focus:outline-none">
            Hide
          </button>

          <div class="flex justify-end">
            <button @click="handleCloseModal"
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
import { ref, nextTick, onMounted } from "vue";
import { useCategoryStore } from "../store/category";
import { ICategory } from "../schemas/category";

export interface ICategoryModal {
  parentId?: string;
  budgetId: string;
  categoryId?: string;
};

const emit = defineEmits(['close-modal', 'save'])
const categoryStore = useCategoryStore();

const { options } = defineProps<{
  options: ICategoryModal,
}>()

let categoryToEdit = ref(<ICategory>{});
const categoryName = ref();

const modalInput = ref()

const handleCloseModal = () => {
  emit('close-modal');
}

const handleSave = async () => {
  try {

    const category = { ...categoryToEdit.value, name: categoryName.value };
    if (options.parentId) category.parentId = options.parentId;

    const storedCategory = await categoryStore.getOrAddCategory(category);

    if (!storedCategory) return;

    if (options.categoryId) {
      await categoryStore.updateCategory(category);
    }
    emit('save');
    handleCloseModal();
  } catch (err) {
    console.log(err);
  }
}

const handleHide = async () => {
  try {
    const categoryToHide = categoryStore.categories.find(c => c._id === options.categoryId);

    if (categoryToHide) {
      await categoryStore.updateCategory({
        ...categoryToHide,
        isActive: false
      });

      // const transactions = transactionStore.transactions.filter(t => t.categoryId === categoryToHide._id).map(t => {
      //   return { ...t, budgeted: 0 }
      // });

      // transactionStore.bulkSave(transactions)
    }

    emit('save');
    handleCloseModal();

  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  if (options.categoryId) {
    const category = categoryStore.categories.find(c => c._id === options.categoryId);
    if (category) {
      categoryToEdit.value = category;
      categoryName.value = category.name;
    }
  }
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
