<script setup lang="ts">
import { ref } from 'vue'

const isChecked = ref<boolean>(false)
defineProps(['option', 'index'])

const handleRadioChange = () => {
  isChecked.value = !isChecked.value
}
</script>

<template>
  <label
    class="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white"
  >
    <input
      class="sr-only"
      type="radio"
      name="recommend"
      :id="option.id"
      :checked="isChecked"
      @change="handleRadioChange()"
    />
    <span
      :class="[
        'flex h-5 w-5 items-center justify-center rounded-full border',
        isChecked ? 'border-primary' : 'border-body'
      ]"
    >
      <span :class="['h-2.5 w-2.5 rounded-full bg-primary', isChecked ? 'flex' : 'hidden']"></span>
    </span>
    {{ option.name }}
  </label>
</template>
