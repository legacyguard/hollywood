<script setup lang="ts">
import DropdownDefault from './Dropdowns/DropdownDefault.vue'
import { ref } from 'vue'
import userOne from '@/assets/images/user/user-14.png'
import userTwo from '@/assets/images/user/user-15.png'
import userThree from '@/assets/images/user/user-16.png'

const feedbackItems = ref([
  {
    image: userOne,
    nameOne: 'Timothy Smith',
    nameTwo: 'Killan James',
    feedback: `It's an Affiliate commissions SaaS application that allows you to track your affiliate revenue.`,
    time: '1 hour ago'
  },
  {
    image: userTwo,
    nameOne: 'Nancy Martino',
    nameTwo: 'Matney',
    feedback: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered.`,
    time: '2 hour ago'
  },
  {
    image: userThree,
    nameOne: 'Michael Morris',
    nameTwo: 'Williams Son',
    feedback: `There are many variations of passages of Lorem Ipsum.`,
    time: '3 hour ago'
  }
])
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-6"
  >
    <div
      class="flex items-start justify-between border-b border-stroke py-5 px-6 dark:border-strokedark"
    >
      <div>
        <h2 class="text-title-md2 font-bold text-black dark:text-white">Feedback</h2>
      </div>
      <DropdownDefault />
    </div>

    <div class="p-6">
      <div class="flex flex-col gap-7">
        <template v-for="(item, index) in feedbackItems" :key="index">
          <div class="relative z-1 flex gap-5.5">
            <div
              class="h-16 w-full max-w-16 rounded-full border-[3px] border-stroke dark:border-strokedark"
            >
              <img :src="item.image" alt="User" />
            </div>

            <div>
              <p class="text-black dark:text-white">
                <span class="font-medium">{{ item.nameOne }}</span>
                Commented on Cloud
                <span class="font-medium">{{ item.nameTwo }}</span>
              </p>
              <span class="mt-1 block text-sm">{{ item.time }}</span>
              <p class="mt-2.5 text-black dark:text-white">
                {{ item.feedback }}
              </p>
            </div>

            <span
              v-if="index === 0"
              class="absolute left-8 -z-1 block h-[300%] w-[1px] border-l border-dashed border-stroke dark:border-strokedark"
            ></span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
