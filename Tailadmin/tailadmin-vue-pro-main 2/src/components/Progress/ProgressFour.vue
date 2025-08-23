<script setup lang="ts">
import { ref } from 'vue'

const progressItems = ref([
  { completion: '85%', color: '#3c50e0' },
  { completion: '65%', color: '#3CA745' },
  { completion: '90%', color: '#F9C107' },
  { completion: '35%', color: '#DC3545' },
  { completion: '25%', color: '#3BA2B8' }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex max-w-[470px] flex-col gap-7">
      <template v-for="(item, index) in progressItems" :key="index">
        <div class="relative h-2.5 w-full rounded-full bg-stroke dark:bg-strokedark">
          <div
            class="absolute left-0 h-full w-10/12 rounded-full"
            :style="{ width: item.completion, backgroundColor: item.color }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>
