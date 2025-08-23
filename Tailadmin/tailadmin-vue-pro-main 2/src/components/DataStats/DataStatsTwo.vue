<script setup lang="ts">
import { ref } from 'vue'

const dataList = ref([
  {
    title: 'Unique Visitors',
    total: '$4,350',
    percent: 18
  },
  {
    title: 'Total Pageviews',
    total: '55.9K',
    percent: 25
  },
  {
    title: 'Bounce Rate',
    total: '54%',
    percent: -7
  },
  {
    title: 'Visit Duration',
    total: '2m 56s',
    percent: 12
  }
])
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
      <template v-for="(item, index) in dataList" :key="index">
        <div
          class="flex items-center justify-center gap-2 last:border-b-0 border-b border-stroke pb-5 last:pb-0 dark:border-strokedark xl:border-b-0 xl:border-r last:xl:border-r-0 xl:pb-0"
        >
          <div>
            <h4 class="mb-0.5 text-xl font-bold text-black dark:text-white md:text-title-lg">
              {{ item.total }}
            </h4>
            <p class="text-sm font-medium">{{ item.title }}</p>
          </div>
          <div class="flex items-center gap-1">
            <svg
              v-if="item.percent > 0"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.25259 5.87281L4.22834 9.89706L3.16751 8.83623L9.00282 3.00092L14.8381 8.83623L13.7773 9.89705L9.75306 5.87281L9.75306 15.0046L8.25259 15.0046L8.25259 5.87281Z"
                fill="#10B981"
              />
            </svg>
            <svg
              v-if="item.percent < 0"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.75302 12.1328L13.7773 8.10856L14.8381 9.16939L9.00279 15.0047L3.16748 9.16939L4.22831 8.10856L8.25256 12.1328V3.00098H9.75302V12.1328Z"
                fill="#F0950C"
              />
            </svg>
            <span
              class="text-sm font-medium"
              :class="{ 'text-meta-3': item.percent > 0, 'text-meta-8': item.percent < 0 }"
              >{{ item.percent }}%</span
            >
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
