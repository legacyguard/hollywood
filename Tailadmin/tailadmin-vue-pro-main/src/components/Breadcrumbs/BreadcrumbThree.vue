<script setup lang="ts">
import { ref } from 'vue'

const arrowIcon = `<svg
                    class="fill-current"
                    width="6"
                    height="15"
                    viewBox="0 0 6 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.80682 0.818303L2.05682 14.7501H0.255682L4.00568 0.818303H5.80682Z"
                      fill=""
                    />
                  </svg>`

const breadcrumbItems = ref([
  { text: 'Home', link: '#' },
  { text: 'Projects', link: '#' },
  { text: 'Marketing' }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div
      class="rounded-md border border-stroke bg-whiter p-4 py-3 dark:border-strokedark dark:bg-meta-4 sm:py-5.5 sm:px-6 xl:px-7.5"
    >
      <nav>
        <ol class="flex flex-wrap items-center gap-3">
          <template v-for="(item, index) in breadcrumbItems" :key="index">
            <li
              :class="{
                'flex items-center gap-3 font-medium': index === breadcrumbItems.length - 1
              }"
            >
              <router-link
                v-if="item.link"
                :to="item.link"
                :class="
                  index === 0
                    ? 'flex items-center gap-3.5 font-medium text-black hover:text-primary dark:text-white dark:hover:text-primary'
                    : 'flex items-center gap-3 font-medium'
                "
              >
                <span v-html="arrowIcon" v-if="item.link && index !== 0"></span>

                <span :class="{ 'hover:text-primary': index !== breadcrumbItems.length - 1 }">{{
                  item.text
                }}</span>
              </router-link>

              <span
                v-html="arrowIcon"
                v-if="!item.link && index === breadcrumbItems.length - 1"
              ></span>
              <span
                v-if="!item.link"
                :class="{ 'hover:text-primary': index !== breadcrumbItems.length - 1 }"
                >{{ item.text }}</span
              >
            </li>
          </template>
        </ol>
      </nav>
    </div>
  </div>
</template>
