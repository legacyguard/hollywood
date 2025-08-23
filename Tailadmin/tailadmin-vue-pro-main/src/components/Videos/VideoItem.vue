<script setup lang="ts">
const props = defineProps(['ratio', 'videoSrc'])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <iframe class="w-full" :class="props.ratio" :src="props.videoSrc" allowfullscreen></iframe>
  </div>
</template>
