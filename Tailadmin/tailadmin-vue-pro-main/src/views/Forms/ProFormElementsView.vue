<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import RangeSliderOne from '@/components/Forms/RangeSlider/RangeSliderOne.vue'
import RangeSliderTwo from '@/components/Forms/RangeSlider/RangeSliderTwo.vue'
import FileDropZone from '@/components/Forms/FileDropZone.vue'

const pageTitle = ref('Form Elements')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- ====== Form Elements Section Start -->
    <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div class="flex flex-col gap-9">
        <!-- Range Slider Start -->
        <DefaultCard cardTitle="Range Slider">
          <div class="flex flex-col gap-5.5 p-7.5">
            <RangeSliderOne />
            <RangeSliderTwo />
          </div>
        </DefaultCard>
        <!-- Range Slider End -->
      </div>

      <div class="flex flex-col gap-9">
        <!-- File Drop Zone -->
        <DefaultCard cardTitle="File Drop Zone">
          <FileDropZone />
        </DefaultCard>
        <!-- File Drop Zone -->
      </div>
    </div>
    <!-- ====== Form Elements Section End -->
  </DefaultLayout>
</template>
