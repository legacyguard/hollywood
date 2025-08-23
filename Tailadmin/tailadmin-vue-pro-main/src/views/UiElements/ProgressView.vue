<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import ProgressFour from '@/components/Progress/ProgressFour.vue'
import ProgressOne from '@/components/Progress/ProgressOne.vue'
import ProgressThree from '@/components/Progress/ProgressThree.vue'
import ProgressTwo from '@/components/Progress/ProgressTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Progress')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Progress Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Progress Style 1">
        <ProgressOne />
      </DefaultCard>

      <DefaultCard title="Progress Style 2">
        <ProgressTwo />
      </DefaultCard>

      <DefaultCard title="Progress Style 3">
        <ProgressThree />
      </DefaultCard>

      <DefaultCard title="Progress Style 4">
        <ProgressFour />
      </DefaultCard>
    </div>
    <!-- Progress End -->
  </DefaultLayout>
</template>
