<script setup lang="ts">
import { ref } from 'vue'

const cardList = ref([
  {
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  }
])
</script>

<template>
  <div class="grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
    <template v-for="(item, index) in cardList" :key="index">
      <div
        class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="border-b border-stroke p-5 px-7.5 dark:border-strokedark">
          <h4 class="text-xl font-semibold text-black dark:text-white">
            <router-link :to="item.link">{{ item.title }}</router-link>
          </h4>
        </div>
        <div class="px-7.5 pt-6 pb-9">
          <p class="font-medium">
            {{ item.details }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
