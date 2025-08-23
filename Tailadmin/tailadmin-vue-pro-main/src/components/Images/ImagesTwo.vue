<script setup lang="ts">
import { ref } from 'vue'

import imageOne from '@/assets/images/cover/cover-03.jpg'
import imageTwo from '@/assets/images/cover/cover-04.jpg'
import imageThree from '@/assets/images/cover/cover-05.jpg'

const gridItems = ref([
  {
    image: imageOne
  },
  {
    image: imageTwo
  },
  {
    image: imageThree
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10">
      <template v-for="(item, index) in gridItems" :key="index">
        <div>
          <img :src="item.image" alt="Cover" />
        </div>
      </template>
    </div>
  </div>
</template>
