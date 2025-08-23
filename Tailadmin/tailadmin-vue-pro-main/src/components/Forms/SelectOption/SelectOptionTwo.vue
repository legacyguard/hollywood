<script setup lang="ts">
import { ref } from 'vue'

interface Option {
  id: string
  label: string
}

const options: Option[] = [
  { id: 'Yes', label: 'Yes' },
  { id: 'No', label: 'No' },
  { id: 'Maybe', label: 'Maybe' }
]

const isChecked = ref<string>('')

const handleRadioChange = (value: string) => {
  isChecked.value = value
}
</script>

<template>
  <div class="mb-5.5">
    <label for="recommend" class="mb-4.5 block text-sm font-medium text-black dark:text-white">
      Would you recommend our site to a friend?
    </label>

    <div class="flex flex-col gap-2.5">
      <div v-for="option in options" :key="option.id">
        <label
          class="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-black dark:text-white"
        >
          <input
            class="sr-only"
            type="radio"
            name="recommend"
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
  </div>
</template>
