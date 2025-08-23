<script setup lang="ts">
import { onMounted } from 'vue'
import noUiSlider from 'nouislider'

onMounted(() => {
  const rangeSliderTwo = document.getElementById('rangeSliderTwo') as any

  noUiSlider.create(rangeSliderTwo, {
    start: [20],
    connect: true,
    range: {
      min: 0,
      max: 100
    }
  })
})
</script>

<template>
  <div class="rangeSliderCommon rangeSliderTwo">
    <div id="rangeSliderTwo"></div>
  </div>
</template>
