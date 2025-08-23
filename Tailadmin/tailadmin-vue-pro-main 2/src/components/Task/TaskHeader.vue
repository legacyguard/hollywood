<script setup lang="ts">
import { ref } from 'vue'
import TaskPopup from './TaskPopup.vue'
import userOne from '@/assets/images/user/user-07.png'
import userTwo from '@/assets/images/user/user-08.png'
import userThree from '@/assets/images/user/user-09.png'
import userFour from '@/assets/images/user/user-10.png'

const userList = ref([
  {
    image: userOne
  },
  {
    image: userTwo
  },
  {
    image: userThree
  },
  {
    image: userFour
  }
])
</script>

<template>
  <div
    class="flex flex-col gap-y-4 rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <h3 class="text-title-lg font-bold text-black dark:text-white">Tasks</h3>
    </div>
    <div class="flex flex-col gap-4 2xsm:flex-row 2xsm:items-center">
      <div class="flex -space-x-2">
        <template v-for="(item, index) in userList" :key="index">
          <button class="h-9 w-9 rounded-full border-2 border-white dark:border-boxdark">
            <img :src="item.image" alt="User" />
          </button>
        </template>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-white text-primary dark:border-strokedark dark:bg-boxdark"
        >
          <svg
            class="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <TaskPopup />
    </div>
  </div>
</template>
