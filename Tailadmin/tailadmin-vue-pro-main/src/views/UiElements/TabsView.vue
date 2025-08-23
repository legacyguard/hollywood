<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import TabOne from '@/components/Tabs/TabOne.vue'
import TabThree from '@/components/Tabs/TabThree.vue'
import TabTwo from '@/components/Tabs/TabTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Tabs')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Dropdowns Start -->
    <div class="flex flex-col gap-9">
      <DefaultCard title="Tab Style 1">
        <TabOne />
      </DefaultCard>

      <DefaultCard title="Tab Style 2">
        <TabTwo />
      </DefaultCard>

      <DefaultCard title="Tab Style 3">
        <TabThree />
      </DefaultCard>
    </div>
    <!-- Dropdowns End -->
  </DefaultLayout>
</template>
