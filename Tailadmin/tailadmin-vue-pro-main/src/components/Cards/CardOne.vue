<script setup lang="ts">
import { ref } from 'vue'

import userOne from '@/assets/images/user/user-11.png'
import userTwo from '@/assets/images/user/user-12.png'
import userThree from '@/assets/images/user/user-13.png'
import cardOne from '@/assets/images/cards/cards-01.png'
import cardTwo from '@/assets/images/cards/cards-02.png'
import cardThree from '@/assets/images/cards/cards-03.png'

const cardList = ref([
  {
    user: {
      img: userOne,
      name: 'Naimur Rahman',
      position: 'Content Writer'
    },
    cardImg: cardOne,
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    user: {
      img: userTwo,
      name: 'Musharof Chy',
      position: 'Web Developer'
    },
    cardImg: cardTwo,
    title: 'Card Title here',
    link: '#',
    details:
      'Lorem ipsum dolor sit amet, vehiculaum ero felis loreum fitiona fringilla goes scelerisque Interdum et.'
  },
  {
    user: {
      img: userThree,
      name: 'Shafiq Hammad',
      position: 'Front-end Developer'
    },
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
        <div class="flex items-center gap-3 py-5 px-6">
          <div class="h-10 w-10 rounded-full">
            <img :src="item.user.img" alt="User" />
          </div>
          <div>
            <h4 class="font-medium text-black dark:text-white">{{ item.user.name }}</h4>
            <p class="text-xs font-medium">{{ item.user.position }}</p>
          </div>
        </div>

        <router-link :to="item.link" class="block px-4">
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
