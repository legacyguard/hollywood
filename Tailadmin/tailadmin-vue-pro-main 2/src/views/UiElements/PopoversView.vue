<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import PopoverOne from '@/components/Popovers/PopoverOne.vue'
import PopoverTwo from '@/components/Popovers/PopoverTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Popovers')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Popovers Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Popover in Four directions">
        <PopoverOne />
      </DefaultCard>

      <DefaultCard title="Popover With Button">
        <PopoverTwo />
      </DefaultCard>
    </div>
    <!-- Popovers End -->
  </DefaultLayout>
</template>
