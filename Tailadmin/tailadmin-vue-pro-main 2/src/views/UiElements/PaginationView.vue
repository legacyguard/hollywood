<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import PaginationOne from '@/components/Pagination/PaginationOne.vue'
import PaginationThree from '@/components/Pagination/PaginationThree.vue'
import PaginationTwo from '@/components/Pagination/PaginationTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Pagination')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Notifications Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Pagination Style 1">
        <PaginationOne />
      </DefaultCard>

      <DefaultCard title="Pagination Style 2">
        <PaginationTwo />
      </DefaultCard>

      <DefaultCard title="Pagination Style 3">
        <PaginationThree />
      </DefaultCard>
    </div>
    <!-- Notifications End -->
  </DefaultLayout>
</template>
