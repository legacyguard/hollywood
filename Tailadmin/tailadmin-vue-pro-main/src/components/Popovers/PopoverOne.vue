<script setup lang="ts">
import { ref } from 'vue'
import PopoverItem from './PopoverItem.vue'

const popoverList = ref([
  {
    button: 'Popover on top',
    title: 'Popover Title',
    details:
      'Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris facilisis congue exclamate justo nec facilisis.',
    boxClasses: 'top-full left-1/2 mt-3 -translate-x-1/2',
    arrowClasses: '-top-1.5 left-1/2 -translate-x-1/2'
  },
  {
    button: 'Popover on right',
    title: 'Popover Title',
    details:
      'Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris facilisis congue exclamate justo nec facilisis.',
    boxClasses: 'top-0 left-full ml-3',
    arrowClasses: '-left-1.5 top-4'
  },
  {
    button: 'Popover on bottom',
    title: 'Popover Title',
    details:
      'Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris facilisis congue exclamate justo nec facilisis.',
    boxClasses: 'bottom-full left-1/2 mb-3 -translate-x-1/2',
    arrowClasses: '-bottom-1.5 left-1/2 -translate-x-1/2'
  },
  {
    button: 'Popover on left',
    title: 'Popover Title',
    details:
      'Lorem ipsum dolor sit amet, consect adipiscing elit. Mauris facilisis congue exclamate justo nec facilisis.',
    boxClasses: 'top-0 right-full mr-3',
    arrowClasses: '-right-1.5 top-4'
  }
])
</script>

<template>
  <div class="p-4 sm:p-5 xl:p-7.5">
    <div class="-mx-4 flex flex-wrap justify-center">
      <PopoverItem v-for="(item, index) in popoverList" :item="item" :key="index" />
    </div>
  </div>
</template>
