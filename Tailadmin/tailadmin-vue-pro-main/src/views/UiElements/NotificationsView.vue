<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import NotificationOne from '@/components/Notifications/NotificationOne.vue'
import NotificationThree from '@/components/Notifications/NotificationThree.vue'
import NotificationTwo from '@/components/Notifications/NotificationTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import NotificationFour from '@/components/Notifications/NotificationFour.vue'

const pageTitle = ref('Notifications')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Notifications Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Notifications Style 1">
        <NotificationOne />
      </DefaultCard>

      <DefaultCard title="Notifications Style 2">
        <NotificationTwo />
      </DefaultCard>

      <DefaultCard title="Notifications Style 3">
        <NotificationThree />
      </DefaultCard>

      <DefaultCard title="Notifications Style 4">
        <NotificationFour />
      </DefaultCard>
    </div>
    <!-- Notifications End -->
  </DefaultLayout>
</template>
