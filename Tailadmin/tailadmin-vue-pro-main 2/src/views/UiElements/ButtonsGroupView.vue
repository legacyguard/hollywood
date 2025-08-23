<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ButtonGroupOne from '@/components/ButtonsGroup/ButtonGroupOne.vue'
import ButtonGroupTwo from '@/components/ButtonsGroup/ButtonGroupTwo.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Buttons Group')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Buttons Group Cards Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Buttons Group">
        <ButtonGroupOne />
      </DefaultCard>

      <DefaultCard title="Buttons Group With Icon">
        <ButtonGroupTwo />
      </DefaultCard>
    </div>
    <!-- Buttons Group Cards End -->
  </DefaultLayout>
</template>
