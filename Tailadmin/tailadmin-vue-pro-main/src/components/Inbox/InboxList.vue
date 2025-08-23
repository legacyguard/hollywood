<script setup lang="ts">
import { ref } from 'vue'
import StarIcon from './StarIcon.vue'

const inboxList = ref([
  {
    name: 'Musharof Chowdhury',
    subject: 'Some note & Lorem Ipsum available alteration in some form.',
    date: '17 Oct, 2024'
  },
  {
    name: 'Naimur Rahman',
    subject: 'Lorem Ipsum available alteration in some form.',
    date: '25 Nov, 2024'
  },
  {
    name: 'Juhan Ahamed',
    subject: 'Lorem Ipsum available alteration in some form.',
    date: '25 Nov, 2024'
  },
  {
    name: 'Mahbub Hasan',
    subject: 'Lorem Ipsum available alteration in some form.',
    date: '19 Dec, 2024'
  },
  {
    name: 'Shafiq Hammad',
    subject: 'Lorem Ipsum available alteration in some form.',
    date: '20 Dec, 2024'
  }
])
</script>

<template>
  <div class="h-full">
    <table class="h-full w-full table-auto">
      <thead>
        <tr class="flex border-y border-stroke dark:border-strokedark">
          <th class="w-[65%] py-6 pl-4 pr-4 lg:pl-10 xl:w-1/4">
            <label
              for="checkbox-1"
              class="flex cursor-pointer select-none items-center font-medium"
            >
              <div class="relative">
                <input type="checkbox" id="checkbox-1" class="tableCheckbox sr-only" />
                <div
                  class="box mr-4 flex h-5 w-5 items-center justify-center rounded-[3px] border-[.5px] border-stroke bg-gray-2 text-white dark:border-strokedark dark:bg-boxdark-2"
                >
                  <span class="opacity-0">
                    <svg width="14" height="14" viewBox="0 0 10 10">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.62796 2.20602C8.79068 2.36874 8.79068 2.63256 8.62796 2.79528L4.04463 7.37861C3.88191 7.54133 3.61809 7.54133 3.45537 7.37861L1.37204 5.29528C1.20932 5.13256 1.20932 4.86874 1.37204 4.70602C1.53476 4.5433 1.79858 4.5433 1.96129 4.70602L3.75 6.49473L8.03871 2.20602C8.20142 2.0433 8.46524 2.0433 8.62796 2.20602Z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              Sender
            </label>
          </th>
          <th class="hidden w-3/5 py-6 px-4 xl:block">
            <p class="text-left font-medium">Subject</p>
          </th>
          <th class="w-[35%] py-6 pl-4 pr-4 lg:pr-10 xl:w-[20%]">
            <p class="text-right font-medium">Date</p>
          </th>
        </tr>
      </thead>
      <tbody class="block h-full max-h-full overflow-auto py-4">
        <template v-for="(listItem, listIndex) in inboxList" :key="listIndex">
          <tr class="flex cursor-pointer items-center hover:bg-whiten dark:hover:bg-boxdark-2">
            <td class="w-[65%] py-4 pl-4 pr-4 lg:pl-10 xl:w-1/4">
              <div class="flex items-center">
                <label
                  :for="`inboxCheckbox-${listIndex}`"
                  class="flex cursor-pointer select-none items-center text-sm font-medium sm:text-base"
                >
                  <div class="relative">
                    <input
                      type="checkbox"
                      :id="`inboxCheckbox-${listIndex}`"
                      class="tableCheckbox sr-only"
                    />
                    <div
                      class="box mr-4 flex h-5 w-5 items-center justify-center rounded-[3px] border-[.5px] border-stroke bg-gray-2 text-white dark:border-strokedark dark:bg-boxdark-2"
                    >
                      <span class="opacity-0">
                        <svg width="14" height="14" viewBox="0 0 10 10">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8.62796 2.20602C8.79068 2.36874 8.79068 2.63256 8.62796 2.79528L4.04463 7.37861C3.88191 7.54133 3.61809 7.54133 3.45537 7.37861L1.37204 5.29528C1.20932 5.13256 1.20932 4.86874 1.37204 4.70602C1.53476 4.5433 1.79858 4.5433 1.96129 4.70602L3.75 6.49473L8.03871 2.20602C8.20142 2.0433 8.46524 2.0433 8.62796 2.20602Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </label>
                <span class="pr-3">
                  <StarIcon />
                </span>
                {{ listItem.name }}
              </div>
            </td>
            <td class="hidden w-3/5 p-4 xl:block">
              <p>{{ listItem.subject }}</p>
            </td>
            <td class="w-[35%] py-4 pl-4 pr-4 lg:pr-10 xl:w-[20%]">
              <p class="text-right text-xs xl:text-base">{{ listItem.date }}</p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
