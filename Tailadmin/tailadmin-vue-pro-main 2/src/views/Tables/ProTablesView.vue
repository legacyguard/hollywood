<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TableFive from '@/components/Tables/TableFive.vue'
import TableSix from '@/components/Tables/TableSix.vue'

const pageTitle = ref('Pro Tables')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <TableFive />
      <TableSix />
    </div>
  </DefaultLayout>
</template>
