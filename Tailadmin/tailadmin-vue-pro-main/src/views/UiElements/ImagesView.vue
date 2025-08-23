<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import ImagesOne from '@/components/Images/ImagesOne.vue'
import ImagesTwo from '@/components/Images/ImagesTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Images')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Images Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Responsive image">
        <ImagesOne />
      </DefaultCard>

      <DefaultCard title="Image Grid">
        <ImagesTwo />
      </DefaultCard>
    </div>
    <!-- Images End -->
  </DefaultLayout>
</template>
