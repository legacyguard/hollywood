<script setup lang="ts">
import { ref } from 'vue'

const percent = ref(85)
</script>

<template>
  <div
    class="relative rounded-sm border border-stroke bg-white py-8 pl-7.5 pr-12 shadow-default dark:border-strokedark dark:bg-boxdark xl:py-11 2xl:pl-12 2xl:pr-16"
  >
    <div class="flex flex-col gap-3 2xsm:flex-row 2xsm:items-center 2xl:gap-9">
      <div class="relative flex items-center justify-center">
        <svg class="h-33 w-33 -rotate-90 transform">
          <circle
            class="text-stroke dark:text-strokedark"
            stroke-width="16"
            stroke="currentColor"
            fill="transparent"
            r="58"
            cx="66"
            cy="66"
          />
          <circle
            class="text-primary"
            stroke-width="16"
            :stroke-dasharray="58 * 2 * Math.PI"
            :stroke-dashoffset="58 * 2 * Math.PI - (percent / 100) * 58 * 2 * Math.PI"
            stroke="currentColor"
            fill="transparent"
            r="58"
            cx="66"
            cy="66"
          />
        </svg>
        <span
          class="absolute text-xl font-bold text-black dark:text-white"
          v-text="`${percent}%`"
        ></span>
      </div>

      <div>
        <h3 class="text-2xl font-bold text-black dark:text-white">Available Storage</h3>
        <p class="mt-3.5 font-medium">
          <span class="text-black dark:text-white">150</span><span class="text-sm"> GB</span> /
          <span class="text-black dark:text-white">512</span><span class="text-sm"> GB</span>
        </p>
      </div>
    </div>

    <button
      class="absolute -right-5 top-1/2 -translate-y-1/2 rotate-[270deg] rounded-t-lg bg-[#13C296] py-1 px-4 font-medium text-white"
    >
      Clean
    </button>
  </div>
</template>
