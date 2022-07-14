<template>
  
  <div @click="openContext = !openContext" class="w-full bg-green-400">{{ selectedValue.label }}</div>

  <div v-if="openContext" class="bg-green-100 absolute mt-2 rounded shadow-md">
    <ul>
      <li v-for="(option) in options" :value="option.value" :key="option.value" @click="handleSelect(option)"
      class="text-sm cursor-pointer p-3 hover:bg-slate-500">{{
          option.label
      }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const { options, value } = defineProps(['options', 'value']);

const openContext = ref(false);
const selectedValue = ref(options.find(o => o.value === value) || {
  label: '-- None --',
  value: null
});

const handleSelect = (option) => {
  selectedValue.value = option;
}

</script>