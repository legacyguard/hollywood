<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import CarouselOne from '@/components/Carousel/CarouselOne.vue'
import CarouselThree from '@/components/Carousel/CarouselThree.vue'
import CarouselTwo from '@/components/Carousel/CarouselTwo.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Carousel')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Carousel Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Slider With Controls">
        <CarouselOne />
      </DefaultCard>

      <DefaultCard title="Slider With Indicators">
        <CarouselTwo />
      </DefaultCard>

      <DefaultCard title="Slider With Controls & Indicators">
        <CarouselThree />
      </DefaultCard>
    </div>
    <!-- Carousel End -->
  </DefaultLayout>
</template>
