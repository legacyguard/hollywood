<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import TaskHeader from '@/components/Task/TaskHeader.vue'
import TaskList from '@/components/Task/TaskList.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Task List')
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
      <div class="mt-9 flex flex-col gap-9">
        <TaskList />
      </div>
      <!-- Task List Wrapper End -->
    </div>
  </DefaultLayout>
</template>
