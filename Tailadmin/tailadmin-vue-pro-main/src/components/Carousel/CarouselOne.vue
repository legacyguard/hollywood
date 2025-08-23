<script setup lang="ts">
import Swiper from 'swiper'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import carouselImgOne from '@/assets/images/carousel/carousel-01.jpg'
import carouselImgTwo from '@/assets/images/carousel/carousel-02.jpg'
import carouselImgThree from '@/assets/images/carousel/carousel-03.jpg'

const swiper = ref<Swiper | null>(null) as { value?: Swiper }
const swiperContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  initSwiper()
})

watch(swiperContainer, () => {
  initSwiper()
})

const initSwiper = () => {
  if (swiperContainer.value && !swiper.value) {
    swiper.value = new Swiper(swiperContainer.value, {
      slidesPerView: 1,
      loop: true
    } as any)
  }
}

onUnmounted(() => {
  if (swiper.value) {
    swiper.value.destroy()
  }
})

const onPrevClick = () => {
  swiper?.value?.slidePrev()
}

const onNextClick = () => {
  swiper?.value?.slideNext()
}

const carouselItems = ref([
  {
    image: carouselImgOne
  },
  {
    image: carouselImgTwo
  },
  {
    image: carouselImgThree
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="swiper-container carouselOne swiper" ref="swiperContainer">
      <div class="swiper-wrapper">
        <template v-for="(item, index) in carouselItems" :key="index">
          <div class="swiper-slide">
            <img :src="item.image" alt="carousel" />
          </div>
        </template>
      </div>
      <div @click="onPrevClick" class="prev-arrow swiper-button-prev cursor-pointer">
        <button>
          <svg
            class="fill-current"
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.2344 19.4875C10.0094 19.4875 9.78438 19.4125 9.63437 19.225L1.15937 10.6C0.821875 10.2625 0.821875 9.73748 1.15937 9.39997L9.63437 0.774976C9.97188 0.437476 10.4969 0.437476 10.8344 0.774976C11.1719 1.11248 11.1719 1.63748 10.8344 1.97498L2.95937 9.99998L10.8719 18.025C11.2094 18.3625 11.2094 18.8875 10.8719 19.225C10.6469 19.375 10.4594 19.4875 10.2344 19.4875Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      <div @click="onNextClick" class="next-arrow swiper-button-next cursor-pointer">
        <button>
          <svg
            class="fill-current"
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.75938 19.4875C1.53438 19.4875 1.34687 19.4125 1.15937 19.2625C0.821875 18.925 0.821875 18.4 1.15937 18.0625L9.03437 9.99998L1.15937 1.97498C0.821875 1.63748 0.821875 1.11248 1.15937 0.774976C1.49687 0.437476 2.02187 0.437476 2.35937 0.774976L10.8344 9.39997C11.1719 9.73748 11.1719 10.2625 10.8344 10.6L2.35937 19.225C2.20937 19.375 1.98438 19.4875 1.75938 19.4875Z"
              fill=""
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
