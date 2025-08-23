<script setup lang="ts">
import ChartEight from '@/components/Charts/ChartEight.vue'
import ChartNine from '@/components/Charts/ChartNine.vue'
import ChartSeven from '@/components/Charts/ChartSeven.vue'
import DataStatsFour from '@/components/DataStats/DataStatsFour.vue'
import LeadsReport from '@/components/LeadsReport.vue'
import ToDoList from '@/components/ToDoList.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- ===== Data Stats Start ===== -->
    <DataStatsFour />
    <!-- ===== Data Stats End ===== -->

    <div class="mt-7.5 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <!-- ===== Chart Seven Start ===== -->
      <div class="col-span-12 xl:col-span-7">
        <ChartSeven />
      </div>
      <!-- ===== Chart Seven End ===== -->

      <!-- ===== Chart Eight Start ===== -->
      <div class="col-span-12 xl:col-span-5">
        <ChartEight />
      </div>
      <!-- ===== Chart Eight End ===== -->

      <!-- ===== Leads Report Start ===== -->
      <LeadsReport />
      <!-- ===== Leads Report End ===== -->

      <!-- ===== Chart Nine Start ===== -->
      <div class="col-span-12 xl:col-span-5">
        <ChartNine />
      </div>
      <!-- ===== Chart Nine End ===== -->

      <!-- ===== To Do List Start ===== -->
      <ToDoList />
      <!-- ===== To Do List End ===== -->
    </div>
  </DefaultLayout>
</template>
