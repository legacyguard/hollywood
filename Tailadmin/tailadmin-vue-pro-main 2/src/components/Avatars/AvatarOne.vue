<script setup lang="ts">
import { ref } from 'vue'
import userOne from '@/assets/images/user/user-03.png'

const avatarItems = ref([
  {
    image: userOne,
    classes: 'max-w-6 h-6'
  },
  {
    image: userOne,
    classes: 'max-w-9.5 h-9.5'
  },
  {
    image: userOne,
    classes: 'max-w-13 h-13'
  },
  {
    image: userOne,
    classes: 'max-w-20 h-20'
  }
])
</script>
<template>
  <div class="px-4 py-9 sm:px-6 xl:px-8.5">
    <div class="flex items-center gap-6">
      <template v-for="(item, index) in avatarItems" :key="index">
        <div class="w-full rounded-full" :class="item.classes">
          <img :src="item.image" alt="user" />
        </div>
      </template>
    </div>
  </div>
</template>
