<script setup lang="ts">
import { onMounted } from 'vue'
import noUiSlider from 'nouislider'

onMounted(() => {
  const sliderOne = document.getElementById('rangeSliderOne') as any

  noUiSlider.create(sliderOne, {
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
  <div class="rangeSliderCommon rangeSliderOne">
    <div id="rangeSliderOne"></div>
  </div>
</template>
