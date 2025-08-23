<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DropdownOne from '@/components/Dropdowns/DropdownOne.vue'
import DropdownThree from '@/components/Dropdowns/DropdownThree.vue'
import DropdownTwo from '@/components/Dropdowns/DropdownTwo.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Reset Password')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Dropdowns Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Dropdowns Style 1">
        <DropdownOne />
      </DefaultCard>

      <DefaultCard title="Dropdowns Style 2">
        <DropdownTwo />
      </DefaultCard>

      <DefaultCard title="Dropdowns Style 3">
        <DropdownThree />
      </DefaultCard>
    </div>
    <!-- Dropdowns End -->
  </DefaultLayout>
</template>
