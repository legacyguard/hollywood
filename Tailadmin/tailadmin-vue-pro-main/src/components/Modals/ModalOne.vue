<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'

const target = ref(null)
const modalOpen = ref(false)

onClickOutside(target, () => {
  modalOpen.value = false
})
</script>

<template>
  <div>
    <button
      @click="modalOpen = true"
      class="rounded-md bg-primary py-3 px-9 font-medium text-white hover:bg-opacity-90"
    >
      Modal 1
    </button>

    <div
      v-show="modalOpen"
      class="fixed top-0 left-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5"
    >
      <div
        ref="target"
        class="w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark md:py-15 md:px-17.5"
      >
        <h3 class="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
          Your Message Sent Successfully
        </h3>
        <span class="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
        <p class="mb-10 font-medium">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since
        </p>
        <div class="-mx-3 flex flex-wrap gap-y-4">
          <div class="w-full px-3 2xsm:w-1/2">
            <button
              @click="modalOpen = false"
              class="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
            >
              Cancel
            </button>
          </div>
          <div class="w-full px-3 2xsm:w-1/2">
            <button
              class="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
