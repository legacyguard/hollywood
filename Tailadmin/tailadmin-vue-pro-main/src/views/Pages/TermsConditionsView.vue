<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref } from 'vue'
import TermsConditionsCard from '@/components/TermsConditionsCard.vue'

const pageTitle = ref('Terms & Conditions')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Terms & Conditions Start -->
    <TermsConditionsCard />
    <!-- Terms & Conditions End -->
  </DefaultLayout>
</template>
