<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import TooltipOne from '@/components/Tooltips/TooltipOne.vue'
import TooltipTwo from '@/components/Tooltips/TooltipTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Tooltips')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Tooltips Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Tooltips Style 1">
        <TooltipOne />
      </DefaultCard>

      <DefaultCard title="Tooltips Style 2">
        <TooltipTwo />
      </DefaultCard>
    </div>
    <!-- Tooltips End -->
  </DefaultLayout>
</template>
