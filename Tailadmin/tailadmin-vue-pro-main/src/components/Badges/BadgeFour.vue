<script setup lang="ts">
import { ref } from 'vue'

const badgesItems = ref([
  {
    name: 'Primary',
    color: '#3c50e0'
  },
  {
    name: 'Secondary',
    color: '#13C296'
  },
  {
    name: 'Dark',
    color: '#212B36'
  },
  {
    name: 'Gray',
    color: '#637381'
  },
  {
    name: 'Light',
    color: '#EFEFEF'
  },
  {
    name: 'Warning',
    color: '#F9C107'
  },
  {
    name: 'Danger',
    color: '#DC3545'
  },
  {
    name: 'Success',
    color: '#3CA745'
  },
  {
    name: 'Info',
    color: '#3BA2B8'
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-10">
    <div class="flex flex-wrap items-center gap-2 sm:gap-4.5">
      <template v-for="(badgeItem, badgeIndex) in badgesItems" :key="badgeIndex">
        <button
          class="inline-flex rounded-full border py-1 px-3 text-sm font-medium hover:opacity-80"
          :class="{
            '!text-[#212B36]': badgeItem.name === 'Light',
            'dark:!text-white dark:!border-white':
              badgeItem.name === 'Dark' || badgeItem.name === 'Light'
          }"
          :style="{ borderColor: badgeItem.color, color: badgeItem.color }"
        >
          {{ badgeItem.name }}
        </button>
      </template>
    </div>
  </div>
</template>
