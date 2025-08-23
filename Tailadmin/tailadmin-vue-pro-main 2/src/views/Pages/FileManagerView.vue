<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ChartTen from '@/components/Charts/ChartTen.vue'
import DownloadList from '@/components/DownloadList.vue'
import FileDetailsList from '@/components/FileDetailsList.vue'
import StorageChart from '@/components/Storage/StorageChart.vue'
import StorageList from '@/components/Storage/StorageList.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('File Manager')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- File Details List Start -->
    <FileDetailsList />
    <!-- File Details List End -->

    <div class="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <!-- ===== Chart Ten Start ===== -->
      <div class="col-span-12 xl:col-span-8">
        <ChartTen />
      </div>
      <!-- ===== Chart Ten End ===== -->

      <div class="col-span-12 xl:col-span-4">
        <div class="flex flex-col gap-4 sm:flex-row md:gap-6 xl:flex-col xl:gap-7.5">
          <StorageChart />

          <StorageList />
        </div>
      </div>

      <!-- Download List Start -->
      <DownloadList />
      <!-- Download List End -->
    </div>
  </DefaultLayout>
</template>
