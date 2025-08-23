<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const target = ref(null)
const openPopover = ref(false)
defineProps(['item'])

onClickOutside(target, () => {
  openPopover.value = false
})
</script>

<template>
  <div class="w-full px-4 sm:w-1/2 xl:w-1/4">
    <div class="mt-10 text-center sm:mb-60">
      <div class="relative inline-block" ref="target">
        <button
          @click.prevent="openPopover = !openPopover"
          class="inline-flex rounded-md bg-primary py-2.5 px-5 font-medium text-white hover:bg-opacity-90"
        >
          {{ item.button }}
        </button>
        <div
          class="absolute z-20 w-max max-w-[311px] rounded bg-white drop-shadow-5 dark:bg-meta-4"
          :class="item.boxClasses"
          v-show="openPopover"
        >
          <span
            class="absolute -z-10 h-4 w-4 rotate-45 rounded-sm bg-white dark:bg-meta-4"
            :class="item.arrowClasses"
          ></span>

          <div class="border-b border-stroke p-3 dark:border-strokedark">
            <h4 class="text-center text-title-sm font-semibold text-black dark:text-white">
              {{ item.title }}
            </h4>
          </div>
          <div class="py-4.5 px-5 text-center">
            <p class="font-medium">
              {{ item.details }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
