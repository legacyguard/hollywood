<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import InvoiceOne from '@/components/Invoice/InvoiceOne.vue'
import InvoiceTwo from '@/components/Invoice/InvoiceTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DefaultCard from '@/components/DefaultCard.vue'

const pageTitle = ref('Invoice')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Invoice Start -->
    <div class="flex flex-col gap-10">
      <DefaultCard title="Style 1">
        <InvoiceOne />
      </DefaultCard>

      <DefaultCard title="Style 2">
        <InvoiceTwo />
      </DefaultCard>
    </div>
    <!-- Invoice End -->
  </DefaultLayout>
</template>
