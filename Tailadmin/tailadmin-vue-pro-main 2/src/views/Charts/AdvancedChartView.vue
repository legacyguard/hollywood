<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ChartEight from '@/components/Charts/ChartEight.vue'
import ChartFour from '@/components/Charts/ChartFour.vue'
import ChartNine from '@/components/Charts/ChartNine.vue'
import ChartSeven from '@/components/Charts/ChartSeven.vue'
import ChartSix from '@/components/Charts/ChartSix.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import ChartTwelve from '@/components/Charts/ChartTwelve.vue'

const pageTitle = ref('Advanced Chart')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <!-- ====== Chart Four Start -->
      <div class="col-span-12">
        <ChartFour />
      </div>
      <!-- ====== Chart Four End -->

      <!-- ===== Chart Seven Start ===== -->
      <div class="col-span-12 xl:col-span-7">
        <ChartSeven />
      </div>
      <!-- ===== Chart Seven End ===== -->

      <!-- ===== Chart Eight Start ===== -->
      <div class="col-span-12 xl:col-span-5">
        <ChartEight />
      </div>
      <!-- ===== Chart Eight End ===== -->

      <!-- ===== Chart Six Start ===== -->
      <div class="col-span-12 xl:col-span-7">
        <ChartSix />
      </div>
      <!-- ===== Chart Six End ===== -->

      <!-- ===== Chart Nine Start ===== -->
      <div class="col-span-12 xl:col-span-5">
        <ChartNine />
      </div>
      <!-- ===== Chart Nine End ===== -->

      <!-- ===== Chart Twelve Start ===== -->
      <ChartTwelve />
      <!-- ===== Chart Twelve End ===== -->
    </div>
  </DefaultLayout>
</template>
