<script setup lang="ts">
import { ref } from 'vue'
// @ts-ignore
import VueApexCharts from 'vue3-apexcharts'

const chartData = {
  series: [70, 20, 10],
  labels: ['Desktop', 'Tablet', 'Mobile']
}

const chart = ref(null)

const apexOptions = {
  chart: {
    type: 'donut',
    width: 380
  },
  colors: ['#0FADCF', '#80CAEE', '#3C50E0'],
  labels: chartData.labels,
  legend: {
    show: false,
    position: 'bottom'
  },

  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        background: 'transparent'
      }
    }
  },

  dataLabels: {
    enabled: false
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 250
        }
      }
    }
  ]
}
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-title-sm2 font-bold text-black dark:text-white">Used Devices</h4>
      </div>
      <div class="mt-2 flex items-center sm:mt-0">
        <p class="font-medium uppercase text-black dark:text-white">Short by:</p>
        <div class="relative z-20 inline-block">
          <select
            name="#"
            id="#"
            class="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 font-medium outline-none"
          >
            <option value="" class="dark:bg-boxdark">Monthly</option>
            <option value="" class="dark:bg-boxdark">Weekly</option>
          </select>
          <span class="absolute top-1/2 right-1 z-10 -translate-y-1/2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.99995 12.8249C8.8312 12.8249 8.69058 12.7687 8.54995 12.6562L2.0812 6.2999C1.82808 6.04678 1.82808 5.65303 2.0812 5.3999C2.33433 5.14678 2.72808 5.14678 2.9812 5.3999L8.99995 11.278L15.0187 5.34365C15.2718 5.09053 15.6656 5.09053 15.9187 5.34365C16.1718 5.59678 16.1718 5.99053 15.9187 6.24365L9.44995 12.5999C9.30933 12.7405 9.1687 12.8249 8.99995 12.8249Z"
                fill="#64748B"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
    <div class="mb-2">
      <div id="chartEight" class="mx-auto flex justify-center">
        <VueApexCharts
          type="donut"
          width="380"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="block h-4 w-4 rounded-full border-4 border-primary"></span>
          <span class="font-medium text-black-2 dark:text-white">Mobile</span>
        </div>

        <span
          class="inline-block rounded-md bg-primary py-0.5 px-1.5 text-xs font-medium text-white"
          >10%</span
        >
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="block h-4 w-4 rounded-full border-4 border-secondary"></span>
          <span class="font-medium text-black-2 dark:text-white">Tablet</span>
        </div>

        <span
          class="inline-block rounded-md bg-secondary py-0.5 px-1.5 text-xs font-medium text-white"
          >20%</span
        >
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="block h-4 w-4 rounded-full border-4 border-meta-10"></span>
          <span class="font-medium text-black-2 dark:text-white">Desktop</span>
        </div>

        <span
          class="inline-block rounded-md bg-meta-10 py-0.5 px-1.5 text-xs font-medium text-white"
          >70%</span
        >
      </div>
    </div>
  </div>
</template>
