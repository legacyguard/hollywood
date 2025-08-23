<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import BreadcrumbOne from '@/components/Breadcrumbs/BreadcrumbOne.vue'
import BreadcrumbThree from '@/components/Breadcrumbs/BreadcrumbThree.vue'
import BreadcrumbTwo from '@/components/Breadcrumbs/BreadcrumbTwo.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Breadcrumb')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Breadcrumb Cards Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Breadcrumb Style 1">
        <BreadcrumbOne />
      </DefaultCard>

      <DefaultCard title="Breadcrumb Style 2">
        <BreadcrumbTwo />
      </DefaultCard>

      <DefaultCard title="Breadcrumb Style 3">
        <BreadcrumbThree />
      </DefaultCard>
    </div>
    <!-- Breadcrumb Cards End -->
  </DefaultLayout>
</template>
