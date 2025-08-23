<script setup lang="ts">
import { ref } from 'vue'

const listItems = ref([
  { text: 'Lorem ipsum dolor sit amet' },
  { text: 'It is a long established fact reader' },
  { text: 'The point of using Lorem Ipsum' },
  { text: 'There are many variations of passages' },
  { text: 'If you are going to use a of Lorem' }
])
</script>
<template>
  <div class="p-4 sm:p-6 xl:p-9">
    <div
      class="min-w-[370px] max-w-max rounded-md border border-stroke py-1 dark:border-strokedark"
    >
      <ul class="flex flex-col">
        <template v-for="(item, index) in listItems" :key="index">
          <li
            class="flex items-center gap-2.5 border-b border-stroke px-5 py-3 last:border-b-0 dark:border-strokedark"
          >
            <span
              class="flex h-6.5 w-full max-w-6.5 items-center justify-center rounded-full bg-primary text-white"
              v-text="index + 1"
            >
            </span>
            <span> {{ item.text }} </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
