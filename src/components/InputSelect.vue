<template>
  <!-- <div class="">
    <div class="select-box">
      <div class="select-box__current text-sm" tabindex="1">

        <div class="select-box__value text-sm">
          <input class="select-box__input" type="radio" id="0" value="1" name="Ben" checked="checked" />
          <p class="select-box__input-text text-sm">Cream</p>
        </div>

        <div class="select-box__value">
          <input class="select-box__input" type="radio" id="1" value="2" name="Ben" checked="checked" />
          <p class="select-box__input-text">Cheese</p>
        </div>
        <div class="select-box__value">
          <input class="select-box__input" type="radio" id="2" value="3" name="Ben" checked="checked" />
          <p class="select-box__input-text">Milk</p>
        </div>
        <div class="select-box__value">
          <input class="select-box__input" type="radio" id="3" value="4" name="Ben" checked="checked" />
          <p class="select-box__input-text">Honey</p>
        </div>
        <div class="select-box__value">
          <input class="select-box__input" type="radio" id="4" value="5" name="Ben" checked="checked" />
          <p class="select-box__input-text">Toast</p>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" class="ml-4 select-box__icon h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <ul class="select-box__list">
        <li>
          <label class="select-box__option" for="0" aria-hidden="aria-hidden">Cream</label>
        </li>
        <li>
          <label class="select-box__option" for="1" aria-hidden="aria-hidden">Cheese</label>
        </li>
        <li>
          <label class="select-box__option" for="2" aria-hidden="aria-hidden">Milk</label>
        </li>
        <li>
          <label class="select-box__option" for="3" aria-hidden="aria-hidden">Honey</label>
        </li>
        <li>
          <label class="select-box__option" for="4" aria-hidden="aria-hidden">Toast</label>
        </li>
      </ul>
    </div>
  </div> -->
</template>

<script setup lang="ts">
// import { onMounted, ref } from 'vue';

// const { options, value } = defineProps(['options', 'value']);
// const emit = defineEmits(['select']);

// const openMenu = ref(false);
// const itemRefs = ref([]);
// const selectedValue = ref(options.find((o: { value: string, label: string }) => o.value === value) || {
//   label: 'Select a value',
//   value: null
// });

// const handleSelect = (option: any) => {
//   selectedValue.value = option;
//   openMenu.value = false;
//   emit('select', option.value)
// }

// const closeMenu = () => {
//   openMenu.value = false;
// }

// const toggleMenu = () => {
//   openMenu.value = !openMenu.value;
// }

// const focusParent = (event: any) => {
//   event.target.focus();
// }

// const clearSelection = () => {
//   selectedValue.value = {
//     label: 'Select a value',
//     value: null
//   };
// }

// const handleKeyDown = () => {
//   if (!openMenu.value) {
//     toggleMenu();
//   }
// }

// onMounted(() => console.log(itemRefs.value))

// defineExpose({
//   clearSelection
// })


</script>

<style>
/* body {
  padding: 30px;
  box-sizing: border-box;
  width: 20%;
  margin: 3rem auto;
} */

.select-box {
  position: relative;
  display: block;
  width: 100%;
  font-size: 18px;
  color: #60666d;
}

.select-box__current {
  position: relative;
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  outline: none;
}

.select-box__current:focus+.select-box__list {
  opacity: 1;
  -webkit-animation-name: none;
  animation-name: none;
}

.select-box__current:focus+.select-box__list .select-box__option {
  cursor: pointer;
}

.select-box__current:focus .select-box__icon {
  -webkit-transform: translateY(-50%) rotate(180deg);
  transform: translateY(-50%) rotate(180deg);
}

.select-box__icon {
  position: absolute;
  top: 50%;
  right: 15px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 20px;
  opacity: 0.3;
  transition: 0.2s ease;
}

.select-box__value {
  display: flex;
}

.select-box__input {
  display: none;
}

.select-box__input:checked+.select-box__input-text {
  display: block;
}

.select-box__input-text {
  display: none;
  width: 100%;
  margin: 0;
  padding: 15px;
  /* background-color: #fff; */
}

.select-box__list {
  position: absolute;
  width: 100%;
  padding: 0;
  list-style: none;
  opacity: 0;
  -webkit-animation-name: HideList;
  animation-name: HideList;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
  -webkit-animation-timing-function: step-start;
  animation-timing-function: step-start;
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
}

.select-box__option {
  display: block;
  padding: 15px;
  background-color: #fff;
}

.select-box__option:hover,
.select-box__option:focus {
  color: #546c84;
  background-color: #fbfbfb;
}

@-webkit-keyframes HideList {
  from {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }

  to {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}

@keyframes HideList {
  from {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
  }

  to {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
  }
}
</style>