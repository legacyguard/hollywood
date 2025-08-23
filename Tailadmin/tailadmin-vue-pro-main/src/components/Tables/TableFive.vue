<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  {
    name: 'Musharof Chowdhury',
    title: 'Multidisciplinary Web Entrepreneur',
    email: 'musharof@example.com',
    role: 'Owner'
  },
  {
    name: 'Naimur Rahman',
    title: 'Website Front-end Developer',
    email: 'naimurrahman@example.com',
    role: 'Member'
  },
  {
    name: 'Shafiq Hammad',
    title: 'Regional Paradigm Technician',
    email: 'shafiq.hd@example.com',
    role: 'Moderator'
  },
  {
    name: 'Alex Semuyel',
    title: 'Applications Engineer',
    email: 'alex.semuel@example.com',
    role: 'Admin'
  },
  {
    name: 'Sulium Keliym',
    title: 'Lead Implementation Liaison',
    email: 'suliym.info@example.com',
    role: 'Member'
  },
  {
    name: 'Jhon Smith',
    title: 'Regional Paradigm Technician',
    email: 'jhon.smith@example.com',
    role: 'Admin'
  },
  {
    name: 'Jenifer Lofess',
    title: 'Multidisciplinary Web Entrepreneur',
    email: 'loffes.cooper@example.com',
    role: 'Member'
  },
  {
    name: 'Devid Deekook',
    title: 'Central Security Manager',
    email: 'devid.decok@example.com',
    role: 'Moderator'
  }
])
</script>

<template>
  <div class="overflow-hidden rounded-[10px]">
    <div class="max-w-full overflow-x-auto">
      <div class="min-w-[1170px]">
        <!-- table header start -->
        <div class="grid grid-cols-12 bg-[#F9FAFB] px-5 py-4 dark:bg-meta-4 lg:px-7.5 2xl:px-11">
          <div class="col-span-3">
            <h5 class="font-medium text-[#637381] dark:text-bodydark">NAME</h5>
          </div>

          <div class="col-span-3">
            <h5 class="font-medium text-[#637381] dark:text-bodydark">TITLE</h5>
          </div>

          <div class="col-span-3">
            <h5 class="font-medium text-[#637381] dark:text-bodydark">EMAIL</h5>
          </div>

          <div class="col-span-2">
            <h5 class="font-medium text-[#637381] dark:text-bodydark">ROLE</h5>
          </div>
        </div>
        <!-- table header end -->

        <!-- table body start -->
        <div class="bg-white dark:bg-boxdark">
          <template v-for="(user, index) in users" :key="index">
            <!-- table row item -->
            <div
              class="grid grid-cols-12 border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11"
            >
              <div class="col-span-3">
                <p class="text-[#637381] dark:text-bodydark">{{ user.name }}</p>
              </div>

              <div class="col-span-3">
                <p class="text-[#637381] dark:text-bodydark">{{ user.title }}</p>
              </div>

              <div class="col-span-3">
                <p class="text-[#637381] dark:text-bodydark">{{ user.email }}</p>
              </div>

              <div class="col-span-2">
                <p class="text-[#637381] dark:text-bodydark">{{ user.role }}</p>
              </div>

              <div class="col-span-1">
                <button class="float-right text-primary">Edit</button>
              </div>
            </div>
          </template>
        </div>
        <!-- table body end -->
      </div>
    </div>
  </div>
</template>
