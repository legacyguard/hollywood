<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FaqOne from '@/components/Faq/FaqOne.vue'

const pageTitle = ref("Faq's")
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Faq Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Style 1">
        <FaqOne />
      </DefaultCard>
    </div>
    <!-- Faq End -->
  </DefaultLayout>
</template>
