<script setup lang="ts">
import DatepickerBox from '@/components/DatepickerBox.vue'
import ChartFour from '@/components/Charts/ChartFour.vue'
import MapTwo from '@/components/Maps/MapTwo.vue'
import DataStatsTwo from '@/components/DataStats/DataStatsTwo.vue'
import ChartThree from '@/components/Charts/ChartThree.vue'
import TableTwo from '@/components/Tables/TableTwo.vue'
import TopContent from '@/components/TopContent.vue'
import TopChannels from '@/components/TopChannels.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <div class="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <!-- ====== Chart Four Start -->
      <div class="col-span-12 flex flex-wrap items-center justify-between gap-3">
        <DatepickerBox />

        <div class="relative z-20 inline-block rounded bg-white shadow-card-2 dark:bg-boxdark">
          <select
            name=""
            id=""
            class="relative z-20 inline-flex appearance-none rounded border border-stroke bg-transparent py-2 pl-4 pr-9 text-sm outline-none dark:border-strokedark"
          >
            <option value="" class="dark:bg-boxdark">Yearly</option>
            <option value="" class="dark:bg-boxdark">Monthly</option>
          </select>
          <span class="absolute top-1/2 right-3 z-10 -translate-y-1/2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.96967 6.21967C4.26256 5.92678 4.73744 5.92678 5.03033 6.21967L9 10.1893L12.9697 6.21967C13.2626 5.92678 13.7374 5.92678 14.0303 6.21967C14.3232 6.51256 14.3232 6.98744 14.0303 7.28033L9.53033 11.7803C9.23744 12.0732 8.76256 12.0732 8.46967 11.7803L3.96967 7.28033C3.67678 6.98744 3.67678 6.51256 3.96967 6.21967Z"
                fill="#64748B"
              />
            </svg>
          </span>
        </div>
      </div>

      <ChartFour />
      <!-- ====== Chart Four End -->

      <!-- ====== Data Stats Start -->
      <DataStatsTwo />
      <!-- ====== Data Stats End -->

      <!-- ====== Map Two Start -->
      <MapTwo />
      <!-- ====== Map Two End -->

      <div class="col-span-12 xl:col-span-6">
        <!-- ====== Top Content Start -->
        <TopContent />
        <!-- ====== Top Content End -->

        <!-- ====== Top Channels Start -->
        <TopChannels />
        <!-- ====== Top Channels End -->
      </div>

      <!-- ====== Chart Three Start -->
      <ChartThree />
      <!-- ====== Chart Three End -->

      <!-- ====== Table Two Start -->
      <div class="col-span-12 xl:col-span-7">
        <TableTwo />
      </div>
      <!-- ====== Table Two End -->
    </div>
  </DefaultLayout>
</template>
