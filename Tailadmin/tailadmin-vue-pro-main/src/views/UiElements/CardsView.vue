<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import CardOne from '@/components/Cards/CardOne.vue'
import CardThree from '@/components/Cards/CardThree.vue'
import CardTwo from '@/components/Cards/CardTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Cards')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Cards Start -->
    <CardOne />

    <h2 class="mt-10 mb-7.5 text-title-md2 font-bold text-black dark:text-white">Cards</h2>
    <CardTwo />

    <h2 class="mt-10 mb-7.5 text-title-md2 font-bold text-black dark:text-white">Cards</h2>
    <CardThree />
    <!-- Cards End -->
  </DefaultLayout>
</template>
