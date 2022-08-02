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
          <p class="text-2xl font-bold">Import</p>
          <div class="z-50 cursor-pointer modal-close" @click="closeModal">
            <svg class="text-black fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 18 18">
              <path
                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
            </svg>
          </div>
        </div>

        <!--Body-->
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" for="file_input">Select your
            OFX or CSV file</label>
          <input @change="readFile($event)"
            class="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input" type="file">

        </div>

        <!--Footer-->
        <div class="flex justify-end pt-2">
          <button @click="handleImport"
            class="px-4 py-2 text-sm font-medium tracking-wide text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const emit = defineEmits(['close-modal'])
const { accountId } = defineProps<{
  accountId: string
}>()
const file = ref();
const content = ref()
const readFile = (event: any) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  if(file){
      if (file.name.includes(".csv")) {
        reader.onload = (res) => {
          content.value = res?.target?.result;
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(file);
      }

      // } else {
      //   this.content = "check the console for file output";
      //   reader.onload = (res) => {
      //     console.log(res.target.result);
      //   };
      //   reader.onerror = (err) => console.log(err);
      //   reader.readAsText(this.file);
      // }
  }
  // const lines = input.split('\n') // 1️⃣
  // const header = lines[0].split(',') // 2️⃣
  // const output = lines.slice(1).map(line => {
  //   const fields = line.split(',') // 3️⃣
  //   return Object.fromEntries(header.map((h, i) => [h, fields[i]])) // 4️⃣
  // })
}
const handleImport = () => {
  

  
}

const closeModal = () => {
  emit('close-modal');
}


</script>

<style>
.modal {
  transition: opacity 0.25s ease;
}
</style>
