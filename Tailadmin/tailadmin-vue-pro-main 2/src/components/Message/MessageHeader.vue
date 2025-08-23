<script setup lang="ts">
import DropdownDefault from '@/components/Dropdowns/DropdownDefault.vue'
</script>

<template>
  <div
    class="sticky flex items-center justify-between border-b border-stroke px-6 py-4.5 dark:border-strokedark"
  >
    <div class="flex items-center">
      <div class="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
        <img
          src="@/assets/images/user/user-01.png"
          alt="avatar"
          class="h-full w-full object-cover object-center"
        />
      </div>
      <div>
        <h5 class="font-medium text-black dark:text-white">Henry Dholi</h5>
        <p class="text-sm font-medium">Reply to message</p>
      </div>
    </div>
    <div>
      <DropdownDefault />
    </div>
  </div>
</template>
