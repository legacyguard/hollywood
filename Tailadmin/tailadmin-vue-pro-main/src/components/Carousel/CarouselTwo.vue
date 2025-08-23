<script setup lang="ts">
import Swiper from 'swiper/bundle'
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
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    } as any)
  }
}

onUnmounted(() => {
  if (swiper.value) {
    swiper.value.destroy()
  }
})

const carouselItems = ref([
  {
    image: carouselImgTwo
  },
  {
    image: carouselImgThree
  },
  {
    image: carouselImgOne
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="swiper-container carouselTwo swiper" ref="swiperContainer">
      <div class="swiper-wrapper">
        <template v-for="(item, index) in carouselItems" :key="index">
          <div class="swiper-slide">
            <img :src="item.image" alt="carousel" />
          </div>
        </template>
      </div>

      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>
