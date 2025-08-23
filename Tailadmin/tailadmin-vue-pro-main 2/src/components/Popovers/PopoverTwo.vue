<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const target = ref(null)
const openPopover = ref(false)

onClickOutside(target, () => {
  openPopover.value = false
})
</script>

<template>
  <div class="p-4 sm:p-5 xl:p-7.5">
    <div class="-mx-4 flex flex-wrap">
      <div class="w-full px-4 sm:w-1/2 xl:w-1/4">
        <div class="mt-10 mb-60">
          <div ref="target" class="relative inline-block">
            <button
              @click.prevent="openPopover = !openPopover"
              class="inline-flex rounded-md bg-primary py-2.5 px-5 font-medium text-white hover:bg-opacity-90"
            >
              Popover Text
            </button>
            <div
              v-show="openPopover"
              class="absolute left-full top-0 z-20 ml-3 w-max max-w-[533px] rounded-md bg-white p-4 font-medium drop-shadow-5 dark:bg-meta-4 sm:p-5 xl:p-7.5"
            >
              <span
                class="absolute -left-1 top-4 -z-10 h-2 w-2 rotate-45 rounded-r-sm bg-white dark:bg-meta-4"
              ></span>
              <h4 class="mb-4 text-title-md font-bold text-black dark:text-white">
                Do you want to add this?
              </h4>
              <p class="font-medium">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris facilisis congue
                justo nec facilisis. Quisque quis augue ipsum. Aliquam suscipit dui ac dui commodo.
              </p>
              <p class="mt-4 font-medium">Quisque quis augue ipsum. Aliquam suscipit dui ac dui.</p>
              <div class="mt-6 flex items-center gap-4">
                <button
                  class="inline-block rounded bg-primary py-1 px-7.5 font-medium text-white hover:bg-opacity-90"
                >
                  Yes
                </button>
                <button
                  class="inline-block rounded bg-body py-1 px-7.5 font-medium text-white hover:bg-opacity-90"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
