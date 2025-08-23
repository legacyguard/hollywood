<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  id: string
  label: string
}

const options: Option[] = [
  { id: 'Graphics', label: 'Graphics Design' },
  { id: 'Web', label: 'Web Development' },
  { id: 'Logo', label: 'Logo Design' },
  { id: 'Others', label: 'Others' }
]

const isChecked = ref<string>('')

const handleRadioChange = (value: string) => {
  isChecked.value = value
}
</script>

<template>
  <label for="roleSelect" class="mb-4.5 block text-sm font-medium text-black dark:text-white">
    Select option
  </label>

  <div class="flex flex-wrap items-center gap-5.5">
    <div v-for="option in options" :key="option.id">
      <label
        class="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white"
      >
        <input
          class="sr-only"
          type="radio"
          name="roleSelect"
          :id="option.id"
          @change="handleRadioChange(option.id)"
        />
        <span
          :class="[
            'flex h-5 w-5 items-center justify-center rounded-full border',
            isChecked === option.id ? 'border-primary' : 'border-body'
          ]"
        >
          <span
            :class="[
              'h-2.5 w-2.5 rounded-full bg-primary',
              isChecked === option.id ? 'flex' : 'hidden'
            ]"
          ></span>
        </span>
        {{ option.label }}
      </label>
    </div>
  </div>
</template>
