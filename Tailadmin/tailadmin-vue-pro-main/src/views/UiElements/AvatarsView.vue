<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import AvatarOne from '@/components/Avatars/AvatarOne.vue'
import AvatarTwo from '@/components/Avatars/AvatarTwo.vue'

const pageTitle = ref('Avatars')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Avatars Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Style 1">
        <AvatarOne />
      </DefaultCard>

      <DefaultCard title="Style 2">
        <AvatarTwo />
      </DefaultCard>
    </div>
    <!-- Avatars End -->
  </DefaultLayout>
</template>
