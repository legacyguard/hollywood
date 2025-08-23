<script setup lang="ts">
import { ref } from 'vue'
import DropdownDefault from './Dropdowns/DropdownDefault.vue'

const contentList = ref([
  {
    url: '/',
    view: '2.5k',
    unique: '2.1k',
    percent: 74
  },
  {
    url: '/blog/',
    view: '376',
    unique: '139',
    percent: 38
  },
  {
    url: '/reserve/success',
    view: '468',
    unique: '290',
    percent: 55
  },
  {
    url: '/product/product-details',
    view: '298',
    unique: '176',
    percent: 20
  },
  {
    url: '/blog/digital-marketing',
    view: '179',
    unique: '57',
    percent: 27
  }
])
</script>

<template>
  <div
    class="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:mb-6 md:p-6 xl:p-7.5 2xl:mb-7.5"
  >
    <div class="mb-7 flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-black dark:text-white">Top Content</h3>
      </div>
      <div>
        <DropdownDefault />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="grid grid-cols-10 py-2">
        <div class="col-span-6">
          <p class="text-sm font-medium">URL</p>
        </div>
        <div class="col-span-2">
          <p class="text-center text-sm font-medium">Views</p>
        </div>
        <div class="col-span-2">
          <p class="text-right text-sm font-medium">Uniques</p>
        </div>
      </div>

      <template v-for="(item, index) in contentList" :key="index">
        <div class="relative z-1 grid grid-cols-10 py-2">
          <span
            class="absolute left-0 top-0 -z-1 h-full rounded bg-gray dark:bg-meta-4"
            :style="{ width: item.percent + '%' }"
          ></span>
          <div class="col-span-6 pl-3.5">
            <p class="text-sm font-medium">{{ item.url }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-center text-sm font-medium">{{ item.view }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-right text-sm font-medium">{{ item.unique }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
