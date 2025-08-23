<script setup lang="ts">
import Swiper from 'swiper'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ChartEleven from '@/components/Charts/ChartEleven.vue'
import BrandOne from '@/assets/images/brand/brand-07.svg'
import BrandTwo from '@/assets/images/brand/brand-08.svg'
import BrandThree from '@/assets/images/brand/brand-09.svg'
import BrandFour from '@/assets/images/brand/brand-10.svg'
import BrandFive from '@/assets/images/brand/brand-11.svg'
import Brandsix from '@/assets/images/brand/brand-12.svg'

const statsItems = ref([
  {
    image: BrandOne,
    name: 'Apple',
    share: 410.5,
    returnRate: -1.1
  },
  {
    image: BrandTwo,
    name: 'Meta',
    share: 157.36,
    returnRate: -0.1
  },
  {
    image: BrandThree,
    name: 'Google',
    share: 743.76,
    returnRate: +0.95
  },
  {
    image: BrandFour,
    name: 'Tesla',
    share: 234.09,
    returnRate: -1.1
  },
  {
    image: BrandFive,
    name: 'Microsoft',
    share: 410.5,
    returnRate: -2.9
  },
  {
    image: Brandsix,
    name: 'Amazon',
    share: 743.76,
    returnRate: +0.65
  }
])

const swiperInstance = ref<Swiper | null>(null)

onMounted(() => {
  // Initialize Swiper when the component is mounted
  swiperInstance.value = new Swiper('.dataStatsSlider', {
    slidesPerView: 1,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      768: {
        slidesPerView: 2
      },
      1280: {
        slidesPerView: 3
      },
      1536: {
        slidesPerView: 4
      }
    }
  })
})

onBeforeUnmount(() => {
  // Destroy Swiper when the component is unmounted
  if (swiperInstance.value) {
    swiperInstance.value.destroy()
  }
})
</script>

<template>
  <div
    class="data-stats-slider-outer relative col-span-12 rounded-sm border border-stroke bg-white py-10 shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="swiper dataStatsSlider !-mx-px">
      <div class="swiper-wrapper">
        <div
          v-for="(item, index) in statsItems"
          :key="index"
          class="swiper-slide border-r border-stroke px-10 last:border-r-0 dark:border-strokedark"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="h-10.5 w-10.5 overflow-hidden rounded-full">
                <img :src="item.image" alt="brand" />
              </div>
              <h4 class="text-xl font-bold text-black dark:text-white">{{ item.name }}</h4>
            </div>

            <!-- ===== Chart Eleven Start ===== -->
            <ChartEleven :returnRate="item.returnRate" />
            <!-- ===== Chart Eleven End ===== -->
          </div>
          <div class="mt-5.5 flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-1">
              <p class="text-sm font-medium">Total Share</p>

              <p class="font-medium text-black dark:text-white">${{ item.share }}</p>
            </div>

            <div class="flex items-center justify-between gap-1">
              <p class="text-sm font-medium">Total Return</p>

              <p
                class="flex items-center gap-1 font-medium"
                :class="item.returnRate >= 0 ? 'text-meta-3' : 'text-red'"
              >
                {{ item.returnRate }}%

                <svg
                  v-if="item.returnRate >= 0"
                  class="fill-current"
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.83258 0.417479L10.8364 7.91748L0.828779 7.91748L5.83258 0.417479Z"
                    fill="#10B981"
                  />
                </svg>
                <svg
                  v-else
                  class="fill-current"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.83246 8.41748L0.828662 0.91748L10.8363 0.91748L5.83246 8.41748Z"
                    fill=""
                  />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Navigation -->
    <div class="swiper-button-prev">
      <svg
        class="fill-current"
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.8562 2.80185C16.0624 2.80185 16.2343 2.8706 16.4062 3.0081C16.7155 3.31748 16.7155 3.79873 16.4062 4.1081L9.1874 11.4987L16.4062 18.855C16.7155 19.1644 16.7155 19.6456 16.4062 19.955C16.0968 20.2644 15.6155 20.2644 15.3062 19.955L7.5374 12.0487C7.22803 11.7394 7.22803 11.2581 7.5374 10.9487L15.3062 3.04248C15.4437 2.90498 15.6499 2.80185 15.8562 2.80185Z"
          fill=""
        />
      </svg>
    </div>

    <div class="swiper-button-next">
      <svg
        class="fill-current"
        width="23"
        height="23"
        viewBox="0 0 23 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.08721 20.1957C7.88096 20.1957 7.70908 20.127 7.53721 19.9895C7.22783 19.6801 7.22783 19.1988 7.53721 18.8895L14.756 11.4988L7.53721 4.14258C7.22783 3.8332 7.22783 3.35195 7.53721 3.04258C7.84658 2.7332 8.32783 2.7332 8.63721 3.04258L16.406 10.9488C16.7153 11.2582 16.7153 11.7395 16.406 12.0488L8.63721 19.9551C8.49971 20.0926 8.29346 20.1957 8.08721 20.1957Z"
          fill=""
        />
      </svg>
    </div>
  </div>
</template>
