<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import SpinnerOne from '@/components/Spinners/SpinnerOne.vue'
import SpinnerTwo from '@/components/Spinners/SpinnerTwo.vue'

const pageTitle = ref('Spinners')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Avatars Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Style 1">
        <SpinnerOne />
      </DefaultCard>

      <DefaultCard title="Style 2">
        <SpinnerTwo />
      </DefaultCard>
    </div>
    <!-- Avatars End -->
  </DefaultLayout>
</template>
