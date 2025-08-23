<script setup lang="ts">
import { ref } from 'vue'

const progressItems = ref([{ completion: '75%' }, { completion: '50%' }, { completion: '80%' }])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex max-w-[470px] flex-col gap-10 pt-5 xl:pt-4">
      <template v-for="(item, index) in progressItems" :key="index">
        <div class="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
          <div
            class="absolute left-0 h-full rounded-full bg-primary"
            :style="{ width: item.completion }"
          >
            <span
              class="absolute bottom-full -right-4 z-1 mb-2 inline-block rounded-sm bg-primary px-2 py-1 text-xs font-bold text-white"
            >
              <span
                class="absolute -bottom-1 left-1/2 -z-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-primary"
              ></span>
              {{ item.completion }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
