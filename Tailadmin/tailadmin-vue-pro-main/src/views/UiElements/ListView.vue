<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import ListOne from '@/components/List/ListOne.vue'
import ListTwo from '@/components/List/ListTwo.vue'
import ListThree from '@/components/List/ListThree.vue'

const pageTitle = ref('List')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- List Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Style 1">
        <ListOne />
      </DefaultCard>

      <DefaultCard title="Style 2">
        <ListTwo />
      </DefaultCard>

      <DefaultCard title="Style 3">
        <ListThree />
      </DefaultCard>
    </div>
    <!-- List End -->
  </DefaultLayout>
</template>
