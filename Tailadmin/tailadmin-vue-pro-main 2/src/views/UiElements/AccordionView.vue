<script setup lang="ts">
import AccordionOne from '@/components/Accordions/AccordionOne.vue'
import AccordionTwo from '@/components/Accordions/AccordionTwo.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Accordion')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Accordion Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Accordions Style 1">
        <AccordionOne />
      </DefaultCard>

      <DefaultCard title="Accordions Style 2">
        <AccordionTwo />
      </DefaultCard>
    </div>
    <!-- Accordion End -->
  </DefaultLayout>
</template>
