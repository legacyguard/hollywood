<script setup lang="ts">
import { ref } from 'vue'

import BrandOne from '@/assets/images/brand/brand-01.svg'
import BrandTwo from '@/assets/images/brand/brand-02.svg'
import BrandThree from '@/assets/images/brand/brand-06.svg'
import BrandFour from '@/assets/images/brand/brand-04.svg'
import BrandFive from '@/assets/images/brand/brand-05.svg'
import DropdownDefault from '@/components/Dropdowns/DropdownDefault.vue'

const brandData = ref([
  {
    logo: BrandOne,
    name: 'Google',
    visitors: 3.5,
    revenues: '5,768',
    conversion: 4.8
  },
  {
    logo: BrandTwo,
    name: 'Twitter',
    visitors: 2.2,
    revenues: '4,635',
    conversion: 4.3
  },
  {
    logo: BrandThree,
    name: 'Youtube',
    visitors: 2.1,
    revenues: '4,290',
    conversion: 3.7
  },
  {
    logo: BrandFour,
    name: 'Vimeo',
    visitors: 1.5,
    revenues: '3,580',
    sales: 389,
    conversion: 2.5
  },
  {
    logo: BrandFive,
    name: 'Facebook',
    visitors: 1.2,
    revenues: '2,740',
    conversion: 1.9
  }
])
</script>

<template>
  <div class="col-span-12 xl:col-span-7">
    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <div class="mb-6 flex justify-between">
        <div>
          <h4 class="text-title-sm2 font-bold text-black dark:text-white">Top Channels</h4>
        </div>

        <DropdownDefault />
      </div>

      <div class="flex flex-col">
        <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div class="p-2.5 xl:p-4">
            <h5 class="text-sm font-medium uppercase xsm:text-base">Source</h5>
          </div>
          <div class="p-2.5 text-center xl:p-4">
            <h5 class="text-sm font-medium uppercase xsm:text-base">Visitors</h5>
          </div>
          <div class="p-2.5 text-center xl:p-4">
            <h5 class="text-sm font-medium uppercase xsm:text-base">Revenues</h5>
          </div>
          <div class="hidden p-2.5 text-center sm:block xl:p-4">
            <h5 class="text-sm font-medium uppercase xsm:text-base">Conversion</h5>
          </div>
        </div>

        <template v-for="(brand, key) in brandData" :key="key">
          <div
            :class="`grid grid-cols-3 sm:grid-cols-4 ${
              key === brandData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
            }`"
          >
            <div class="flex items-center gap-3 p-2.5 xl:p-5">
              <div class="h-9 w-full max-w-9 flex-shrink-0">
                <img :src="brand.logo" alt="Brand" />
              </div>
              <p class="hidden font-medium text-black dark:text-white sm:block">{{ brand.name }}</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="font-medium text-black dark:text-white">{{ brand.visitors }}K</p>
            </div>

            <div class="flex items-center justify-center p-2.5 xl:p-5">
              <p class="font-medium text-meta-3">${{ brand.revenues }}</p>
            </div>

            <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p class="font-medium text-meta-5">{{ brand.conversion }}%</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
