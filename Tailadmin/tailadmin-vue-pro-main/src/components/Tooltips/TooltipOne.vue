<script setup lang="ts">
import { ref } from 'vue'

const tooltipsList = ref([
  {
    buttonText: 'Tooltip on top',
    tooltipText: 'Tooltip Text',
    boxClasses: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    textClasses: 'bottom-[-3px] left-1/2 -translate-x-1/2'
  },
  {
    buttonText: 'Tooltip on right',
    tooltipText: 'Tooltip Text',
    boxClasses: 'left-full top-1/2 ml-3 -translate-y-1/2',
    textClasses: 'left-[-3px] top-1/2 -translate-y-1/2'
  },
  {
    buttonText: 'Tooltip on bottom',
    tooltipText: 'Tooltip Text',
    boxClasses: 'top-full left-1/2 mt-3 -translate-x-1/2',
    textClasses: 'top-[-3px] left-1/2 -translate-x-1/2'
  },
  {
    buttonText: 'Tooltip on left',
    tooltipText: 'Tooltip Text',
    boxClasses: 'right-full top-1/2 mr-3 -translate-y-1/2',
    textClasses: 'right-[-3px] top-1/2 -translate-y-1/2'
  }
])
</script>

<template>
  <div class="p-4 sm:p-5 xl:p-7.5">
    <div class="-mx-4 flex flex-wrap justify-center">
      <template v-for="(item, index) in tooltipsList" :key="index">
        <div class="w-full px-4 sm:w-1/2 xl:w-1/4">
          <div class="mb-14">
            <div class="group relative inline-block">
              <button class="inline-flex rounded-md bg-primary py-2 px-4.5 font-medium text-white">
                {{ item.buttonText }}
              </button>
              <div
                class="absolute z-20 whitespace-nowrap rounded bg-black py-1.5 px-4.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100"
                :class="item.boxClasses"
              >
                <span
                  class="absolute -z-10 h-2 w-2 rotate-45 rounded-sm bg-black"
                  :class="item.textClasses"
                ></span>
                {{ item.tooltipText }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
