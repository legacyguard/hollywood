<script setup lang="ts">
import { ref } from 'vue'

import cardOne from '@/assets/images/cards/cards-04.png'
import cardTwo from '@/assets/images/cards/cards-05.png'
import cardThree from '@/assets/images/cards/cards-06.png'

const cardList = ref([
  {
    cardImg: cardOne,
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    cardImg: cardTwo,
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    cardImg: cardThree,
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
        <router-link :to="item.link" class="block px-4 pt-4">
          <img :src="item.cardImg" alt="Cards" />
        </router-link>

        <div class="p-6">
          <h4 class="mb-3 text-xl font-semibold text-black dark:text-white">
            <router-link :to="item.link">{{ item.title }}</router-link>
          </h4>
          <p class="font-medium">
            {{ item.details }}
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
