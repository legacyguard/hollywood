<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import BadgeOne from '@/components/Badges/BadgeOne.vue'
import BadgeTwo from '@/components/Badges/BadgeTwo.vue'
import BadgeThree from '@/components/Badges/BadgeThree.vue'
import BadgeFour from '@/components/Badges/BadgeFour.vue'
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

    <!-- Buttons Group Cards Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Badge Style 1">
        <BadgeOne />
      </DefaultCard>

      <DefaultCard title="Badge Style 2">
        <BadgeTwo />
      </DefaultCard>

      <DefaultCard title="Badge Style 3">
        <BadgeThree />
      </DefaultCard>

      <DefaultCard title="Badge Style 4">
        <BadgeFour />
      </DefaultCard>
    </div>
    <!-- Buttons Group Cards End -->
  </DefaultLayout>
</template>
