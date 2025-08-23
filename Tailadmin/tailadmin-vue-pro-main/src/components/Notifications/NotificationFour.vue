<script setup lang="ts">
import { ref } from 'vue'
import userOne from '@/assets/images/user/user-03.png'
import userTwo from '@/assets/images/user/user-22.png'
import userThree from '@/assets/images/user/user-23.png'
import userFour from '@/assets/images/user/user-24.png'
import userFive from '@/assets/images/user/user-25.png'

const notificationList = ref([
  {
    active: true,
    image: userOne,
    name: 'Dwayne Bero',
    details: 'Project assigned by the manager',
    time: '5 min ago',
    date: '24, Nov 2027'
  },
  {
    active: true,
    image: userTwo,
    name: 'Talan Curtis',
    details: 'Approved date for sanction of load is verified',
    time: '22, Feb 2027',
    date: '24, Nov 2027'
  },
  {
    active: true,
    image: userThree,
    name: 'Talan Rhiel Madsen',
    details: 'Admin and other team accepted your work request',
    time: '12 min ago',
    date: '12, Jan 2027'
  },
  {
    active: false,
    image: userFour,
    name: 'Charlie Botosh',
    details: 'Temporarily your account has been suspended',
    time: '1 year ago',
    date: '09, Dec 2026'
  },
  {
    active: true,
    image: userFive,
    name: 'Jordyn Torff',
    details: 'You have changed your password successfully',
    time: '1 year ago',
    date: '30, Mar 2026'
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex flex-col gap-5">
      <template v-for="(item, index) in notificationList" :key="index">
        <!-- notification item -->
        <div
          class="rounded-[10px] border-l-[5px] bg-white px-4 py-6 shadow-13 dark:bg-boxdark sm:px-5 xl:px-7.5"
          :class="item.active ? 'border-meta-3' : 'border-red'"
        >
          <div class="flex flex-wrap items-center justify-between gap-5">
            <div class="flex gap-5">
              <div class="relative h-11.5 w-full max-w-11.5 rounded-full">
                <img :src="item.image" alt="user" />
                <span
                  class="absolute -top-0.5 right-0.5 h-4 w-full max-w-4 rounded-full border-[2.3px] border-white"
                  :class="item.active ? 'bg-[#219653]' : 'bg-red'"
                ></span>
              </div>

              <div class="w-full">
                <h4 class="mb-[3px] text-title-xsm font-bold text-black dark:text-white">
                  {{ item.name }}
                </h4>
                <p class="mb-[3px] font-medium">{{ item.details }}</p>
                <span class="text-sm font-medium"> {{ item.time }} </span>
              </div>
            </div>

            <span
              class="inline-flex rounded-md bg-gray px-2.5 py-1.5 text-sm font-medium leading-[22px] dark:bg-graydark"
            >
              {{ item.date }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
