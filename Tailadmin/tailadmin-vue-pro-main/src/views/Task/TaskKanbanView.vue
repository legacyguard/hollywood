<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import TaskHeader from '@/components/Task/TaskHeader.vue'
import TaskKanban from '@/components/Task/TaskKanban.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Task Kanban')
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-5xl">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->

      <!-- Task Header Start -->
      <TaskHeader />
      <!-- Task Header End -->

      <!-- Task List Wrapper Start -->
      <div class="mt-9 grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3">
        <TaskKanban />
      </div>
      <!-- Task List Wrapper End -->
    </div>
  </DefaultLayout>
</template>
