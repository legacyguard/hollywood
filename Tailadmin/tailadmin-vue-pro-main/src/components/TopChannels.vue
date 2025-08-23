<script setup lang="ts">
import { ref } from 'vue'
import DropdownDefault from './Dropdowns/DropdownDefault.vue'

const channelsList = ref([
  {
    url: 'Google',
    view: '4.2k',
    unique: '3.9k',
    percent: 74
  },
  {
    url: 'Github',
    view: '1.9k',
    unique: '509',
    percent: 66
  },
  {
    url: 'Producthunt',
    view: '1.5k',
    unique: '986',
    percent: 58
  },
  {
    url: 'Facebook',
    view: '974',
    unique: '639',
    percent: 48
  },
  {
    url: 'Twitter',
    view: '179',
    unique: '57',
    percent: 39
  }
])
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-7.5"
  >
    <div class="mb-7 flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold text-black dark:text-white">Top Channels</h3>
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

      <template v-for="(item, index) in channelsList" :key="index">
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
