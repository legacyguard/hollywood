<script setup lang="ts">
import UserOne from '@/assets/images/user/user-01.png'
import UserTwo from '@/assets/images/user/user-02.png'
import UserThree from '@/assets/images/user/user-03.png'
import UserFour from '@/assets/images/user/user-04.png'
import UserFive from '@/assets/images/user/user-05.png'
import { ref } from 'vue'

const userList = ref([
  {
    imgSrc: UserThree,
    name: 'Henry Dholi',
    message: 'I cam across your profile and...'
  },
  {
    imgSrc: UserFour,
    name: 'Mariya Desoja',
    message: 'I like your confidence 💪'
  },
  {
    imgSrc: UserFive,
    name: 'Robert Jhon',
    message: 'Can you share your offer?'
  },
  {
    imgSrc: UserOne,
    name: 'Cody Fisher',
    message: `I'm waiting for you response!`
  },
  {
    imgSrc: UserTwo,
    name: 'Jenny Wilson',
    message: 'I cam across your profile and...'
  }
])
</script>

<template>
  <div class="hidden h-full flex-col xl:flex xl:w-1/4">
    <div class="sticky border-b border-stroke px-6 py-7.5 dark:border-strokedark">
      <h3 class="text-lg font-medium text-black dark:text-white 2xl:text-xl">
        Active Conversations
        <span
          class="rounded-md border-[.5px] border-stroke bg-gray-2 py-0.5 px-2 text-base font-medium text-black dark:border-strokedark dark:bg-boxdark-2 dark:text-white 2xl:ml-4"
          >{{ userList.length }}</span
        >
      </h3>
    </div>

    <div class="flex max-h-full flex-col overflow-auto p-5">
      <form class="sticky mb-7">
        <input
          type="text"
          class="w-full rounded border border-stroke bg-gray-2 py-2.5 pl-5 pr-10 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2"
          placeholder="Search..."
        />
        <button class="absolute top-1/2 right-4 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
              fill="#637381"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.957 11.958C12.2499 11.6651 12.7247 11.6651 13.0176 11.958L16.2801 15.2205C16.573 15.5133 16.573 15.9882 16.2801 16.2811C15.9872 16.574 15.5124 16.574 15.2195 16.2811L11.957 13.0186C11.6641 12.7257 11.6641 12.2508 11.957 11.958Z"
              fill="#637381"
            />
          </svg>
        </button>
      </form>

      <div class="no-scrollbar max-h-full space-y-2.5 overflow-auto">
        <template v-for="(user, userIndex) in userList" :key="userIndex">
          <div
            class="flex cursor-pointer items-center rounded py-2 px-4 hover:bg-gray-2 dark:hover:bg-strokedark"
          >
            <div class="relative mr-3.5 h-11 w-full max-w-11 rounded-full">
              <img
                :src="user.imgSrc"
                alt="profile"
                class="h-full w-full object-cover object-center"
              />
              <span
                class="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-gray-2 bg-success"
              ></span>
            </div>
            <div class="w-full">
              <h5 class="text-sm font-medium text-black dark:text-white">{{ user.name }}</h5>
              <p class="text-sm font-medium">{{ user.message }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
