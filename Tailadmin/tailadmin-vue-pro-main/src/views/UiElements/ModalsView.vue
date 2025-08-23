<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ModalOne from '@/components/Modals/ModalOne.vue'
import ModalTwo from '@/components/Modals/ModalTwo.vue'
import ModalThree from '@/components/Modals/ModalThree.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Modals')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Modals Start -->
    <div
      class="rounded-sm border border-stroke bg-white p-10 shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div class="flex flex-wrap justify-center gap-5">
        <ModalOne />
        <ModalTwo />
        <ModalThree />
      </div>
    </div>
    <!-- Modals End -->
  </DefaultLayout>
</template>
