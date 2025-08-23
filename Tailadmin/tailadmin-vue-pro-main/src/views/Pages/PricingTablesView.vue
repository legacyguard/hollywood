<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import PricingTableOne from '@/components/PricingTables/PricingTableOne.vue'
import PricingTableTwo from '@/components/PricingTables/PricingTableTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Pricing Table')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-5 md:gap-7 2xl:gap-10">
      <!-- ====== Pricing Table One Start -->
      <PricingTableOne />
      <!-- ====== Pricing Table One End -->

      <!-- ====== Pricing Table Two Start -->
      <PricingTableTwo />
      <!-- ====== Pricing Table Two End -->
    </div>
  </DefaultLayout>
</template>
