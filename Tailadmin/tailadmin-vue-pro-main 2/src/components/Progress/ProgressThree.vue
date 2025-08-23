<script setup lang="ts">
import { ref } from 'vue'

const progressItems = ref([{ completion: '50%' }, { completion: '80%' }, { completion: '75%' }])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex max-w-[470px] flex-col gap-7">
      <template v-for="(item, index) in progressItems" :key="index">
        <div class="relative h-4 w-full rounded-full bg-stroke dark:bg-strokedark">
          <div
            class="absolute left-0 flex h-full items-center justify-center rounded-full bg-primary"
            :style="{ width: item.completion }"
          >
            <p class="my-auto text-center text-[10px] font-bold leading-none text-white">
              {{ item.completion }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
