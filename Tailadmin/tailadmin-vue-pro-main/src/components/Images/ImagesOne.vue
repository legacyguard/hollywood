<script setup lang="ts">
import { onMounted } from 'vue'

import ImageResize from '@/assets/js/image-resize'

onMounted(() => {
  ImageResize()
})
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="relative">
      <div id="pane" class="overflow-hidden">
        <img src="@/assets/images/cover/cover-02.jpg" alt="Cover" />
      </div>
      <div id="ghostpane" class="absolute left-0 top-0 duration-300 ease-in-out"></div>
    </div>
  </div>
</template>
