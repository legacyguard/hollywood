<script setup lang="ts">
import { ref } from 'vue'

const currentPage = ref<number>(1)
const totalPages = ref<number>(5)

const pages = ref<number[]>([])

for (let i = 1; i <= totalPages.value; i++) {
  pages.value.push(i)
}

const navigatePage = (direction: number) => {
  currentPage.value += direction
  updatePages()
}

const goToPage = (page: number) => {
  currentPage.value = page
  updatePages()
}

const updatePages = () => {
  if (currentPage.value < 1) {
    currentPage.value = 1
  } else if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-7.5">
    <nav>
      <ul class="flex flex-wrap items-center gap-2">
        <li>
          <router-link
            class="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
            to="#"
            @click="navigatePage(-1)"
          >
            Previous
          </router-link>
        </li>
        <li v-for="page in pages" :key="page">
          <router-link
            class="flex items-center justify-center rounded py-1.5 px-3 font-medium hover:bg-primary hover:text-white"
            to="#"
            @click="goToPage(page)"
          >
            {{ page }}
          </router-link>
        </li>
        <li>
          <router-link
            class="flex items-center justify-center rounded bg-[#EDEFF1] py-1.5 px-3 text-xs font-medium text-black hover:bg-primary hover:text-white dark:bg-graydark dark:text-white dark:hover:bg-primary dark:hover:text-white"
            to="#"
            @click="navigatePage(1)"
          >
            Next
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>
