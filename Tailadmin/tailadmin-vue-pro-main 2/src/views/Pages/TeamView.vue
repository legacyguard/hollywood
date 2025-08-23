<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TeamTwo from '@/components/Teams/TeamTwo.vue'
import TeamOne from '@/components/Teams/TeamOne.vue'

import { ref } from 'vue'

const pageTitle = ref('Teams')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Teams Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Style 1">
        <TeamOne />
      </DefaultCard>

      <DefaultCard title="Style 2">
        <TeamTwo />
      </DefaultCard>
    </div>
    <!-- Teams End -->
  </DefaultLayout>
</template>
