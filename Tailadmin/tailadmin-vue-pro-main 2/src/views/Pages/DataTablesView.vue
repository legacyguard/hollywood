<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DataTableOne from '@/components/DataTables/DataTableOne.vue'
import DataTableTwo from '@/components/DataTables/DataTableTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Data Tables')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <!-- ====== Data Table One Start -->
      <DataTableOne />
      <!-- ====== Data Table One End -->

      <!-- ====== Data Table Two Start -->
      <DataTableTwo />
      <!-- ====== Data Table Two End -->
    </div>
  </DefaultLayout>
</template>
