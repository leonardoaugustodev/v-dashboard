<template>
  <label class="block my-2">
    <span class="block mb-1 text-sm font-medium text-slate-700">{{ label }}</span>
    <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value || '')"
      class="form-input w-full px-4 py-2 rounded-md appearance-none focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500" />
    <!-- 
            <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
              Please provide a valid email address.
            </p> -->
  </label>
</template>

<script setup lang="ts">
defineEmits(['update:modelValue'])

const { type, label, modelValue } = defineProps(['type', 'label', 'modelValue'])

</script>
