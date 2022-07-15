<template>

  <div id="context" tabindex="0" class="menu relative text-sm cursor-pointer hover:bg-slate-50 rounded border-b-2 border-gray-300"
    @click="focusParent($event)" @keyup.esc="closeMenu">
    <div id="context-menu" @click="toggleMenu" class="w-full flex justify-between items-center p-2">
      <span>{{ selectedValue.label }}</span>

      <svg v-if="!openMenu" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="#aaa">
        <path fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>

      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="#aaa">
        <path fill-rule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clip-rule="evenodd" />
      </svg>
    </div>

    <div v-if="openMenu" id="context-options" class="options menu w-full fixed bg-white  mt-2 rounded shadow-lg"
      :class="!selectedValue.value ? 'text-gray-500' : ''">
      <ul>
        <li v-for="(option) in options" tabindex=1 :value="option.value" :key="option.value"
          @click="handleSelect(option)" class="text-sm cursor-pointer p-3 hover:bg-slate-100 rounded">{{
              option.label
          }}
        </li>
      </ul>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const { options, value } = defineProps(['options', 'value']);
const emit = defineEmits(['select']);

const openMenu = ref(false);
const selectedValue = ref(options.find(o => o.value === value) || {
  label: 'Select a value',
  value: null
});

const handleSelect = (option) => {
  selectedValue.value = option;
  openMenu.value = false;
  // emit('select', option.value)
}

const closeMenu = () => {
  openMenu.value = false;
}

const toggleMenu = () => {
  openMenu.value = !openMenu.value;
}

const focusParent = (event: any) => {
  event.target.focus();
}


</script>

<style>
.menu {
  z-index: 50;
  max-width: 200px;
  min-width: 150px;
}

.options {
  overflow-y: scroll;
}

.backdrop {
  z-index: 10;
}
</style>