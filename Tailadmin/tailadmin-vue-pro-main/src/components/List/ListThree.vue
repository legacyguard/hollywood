<script setup lang="ts">
import { ref } from 'vue'
import userOne from '@/assets/images/user/user-01.png'
import userTwo from '@/assets/images/user/user-03.png'
import userThree from '@/assets/images/user/user-02.png'
import userFour from '@/assets/images/user/user-05.png'
import DropdownFive from '@/components/Dropdowns/DropdownFive.vue'

const listItems = ref([
  { image: userOne, name: 'Devid Wilium', position: 'Digital marketer' },
  { image: userTwo, name: 'Deniyal Shifer', position: 'Graphics designer' },
  { image: userThree, name: 'Philifs Geno', position: 'Content creator' },
  { image: userFour, name: 'Marko Diyan', position: 'Web developer' }
])
</script>
<template>
  <div class="p-4 sm:p-6 xl:p-9">
    <div class="w-full max-w-[360px] rounded-md border border-stroke py-2.5 dark:border-strokedark">
      <div class="flex flex-col">
        <template v-for="(item, index) in listItems" :key="index">
          <div
            class="flex items-center justify-between p-4.5 hover:bg-[#F9FAFB] dark:hover:bg-meta-4"
          >
            <div class="flex items-center">
              <div class="mr-4 h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
                <img :src="item.image" alt="user" class="rounded-full object-cover object-center" />
              </div>
              <div>
                <h4 class="text-base font-medium text-black dark:text-white">
                  {{ item.name }}
                </h4>
                <p class="text-sm">{{ item.position }}</p>
              </div>
            </div>
            <div>
              <DropdownFive />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
