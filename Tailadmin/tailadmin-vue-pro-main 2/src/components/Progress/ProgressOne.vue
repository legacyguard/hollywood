<script setup lang="ts">
import { ref } from 'vue'

const progressItems = ref([{ completion: '80%' }, { completion: '65%' }, { completion: '90%' }])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex max-w-[470px] flex-col gap-7">
      <template v-for="(item, index) in progressItems" :key="index">
        <div class="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
          <div
            class="absolute left-0 h-full rounded-full bg-primary"
            :style="{ width: item.completion }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>
