<script setup lang="ts">
import { ref } from 'vue'

import BrandOne from '@/assets/images/brand/brand-14.svg'
import BrandTwo from '@/assets/images/brand/brand-15.svg'
import BrandThree from '@/assets/images/brand/brand-16.svg'
import DropdownDefault from '@/components/Dropdowns/DropdownDefault.vue'

const stocksItems = ref([
  {
    image: BrandOne,
    name: 'Netflix',
    gross: '12,453.00',
    price: '1,984.00',
    returnRate: 0.14
  },
  {
    image: BrandTwo,
    name: 'Apple Inc.',
    gross: '132,453.00',
    price: '2,634.00',
    returnRate: 1.03
  },
  {
    image: BrandThree,
    name: 'Meta',
    gross: '31,428.00',
    price: '2,432.00',
    returnRate: 0.08
  }
])
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-10 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7 xl:col-span-5"
  >
    <div class="mb-7.5 flex items-center justify-between">
      <div>
        <h3 class="text-title-sm2 font-bold text-black dark:text-white">Trending Stocks</h3>
      </div>
      <div>
        <DropdownDefault />
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <template v-for="(item, index) in stocksItems" :key="index">
        <!-- stock item start -->
        <div class="rounded-[5px] border border-stroke p-5 dark:border-strokedark">
          <div class="mb-5.5 flex items-center justify-between">
            <div class="flex items-center gap-4.5">
              <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#EEF2F8]">
                <img :src="item.image" alt="brand" />
              </div>

              <div>
                <h5 class="font-bold text-black dark:text-white">
                  {{ item.name }}
                </h5>
                <p class="text-xs font-medium">$ {{ item.gross }}</p>
              </div>
            </div>

            <div class="text-right">
              <p
                class="mb-0.5 flex items-center justify-end gap-1 text-xs font-medium"
                :class="item.returnRate >= 0 ? 'text-meta-3' : 'text-red'"
              >
                {{ item.returnRate }} %

                <svg
                  v-if="item.returnRate >= 0"
                  class="fill-current"
                  width="9"
                  height="7"
                  viewBox="0 0 9 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.23511 0.193115L8.23815 6.19312H0.232065L4.23511 0.193115Z" fill="" />
                </svg>
                <svg
                  v-else
                  class="fill-current"
                  width="9"
                  height="7"
                  viewBox="0 0 9 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.48804 6.099L0.484999 0.0989983L8.49108 0.098999L4.48804 6.099Z"
                    fill=""
                  />
                </svg>
              </p>
              <p
                class="text-xs font-medium"
                :class="item.returnRate >= 0 ? 'text-meta-3' : 'text-red'"
              >
                <span v-text="item.returnRate >= 0 ? '+' : '-'"></span> ${{ item.price }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button
              class="flex w-full items-center justify-center rounded-[5px] bg-[#F3F5F8] px-7.5 py-2 text-sm font-medium text-black hover:bg-primary/[0.15] hover:text-primary dark:bg-meta-4 dark:text-white dark:hover:bg-primary/[0.15] dark:hover:text-primary"
            >
              Short
            </button>
            <button
              class="flex w-full items-center justify-center rounded-[5px] bg-[#F3F5F8] px-7.5 py-2 text-sm font-medium text-black hover:bg-primary/[0.15] hover:text-primary dark:bg-meta-4 dark:text-white dark:hover:bg-primary/[0.15] dark:hover:text-primary"
            >
              Buy
            </button>
          </div>
        </div>
        <!-- stock item end -->
      </template>
    </div>
  </div>
</template>
