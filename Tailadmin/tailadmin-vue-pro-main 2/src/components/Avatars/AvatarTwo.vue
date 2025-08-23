<script setup lang="ts">
import { ref } from 'vue'
import userOne from '@/assets/images/user/user-03.png'

const avatarItems = ref([
  {
    image: userOne,
    classes: 'max-w-6 h-6',
    bulletClasses: 'max-w-2 -right-px -top-px h-2 border'
  },
  {
    image: userOne,
    classes: 'max-w-9.5 h-9.5',
    bulletClasses: 'max-w-3.5 -right-0.5 -top-0.5 h-3.5 border-2'
  },
  {
    image: userOne,
    classes: 'max-w-13 h-13',
    bulletClasses: 'max-w-4.5 -right-0.5 -top-0.5 h-4.5 border-[2.7px]'
  },
  {
    image: userOne,
    classes: 'max-w-20 h-20',
    bulletClasses: 'max-w-5.5 right-0 top-0 h-5.5 border-[3px]'
  }
])
</script>
<template>
  <div class="px-4 py-9 sm:px-6 xl:px-8.5">
    <div class="flex items-center gap-6">
      <template v-for="(item, index) in avatarItems" :key="index">
        <div class="relative w-full rounded-full" :class="item.classes">
          <img :src="item.image" alt="user" />

          <span
            class="absolute w-full rounded-full border border-white bg-[#219653] dark:border-black"
            :class="item.bulletClasses"
          ></span>
        </div>
      </template>
    </div>
  </div>
</template>
