<script setup lang="ts">
import { ref } from 'vue'

const buttonList = ref([
  {
    type: 'square',
    children: [
      {
        link: '#',
        text: 'About'
      },
      {
        link: '#',
        text: 'Profile'
      },
      {
        link: '#',
        text: 'Services'
      }
    ]
  },
  {
    type: 'rounded',
    children: [
      {
        link: '#',
        text: 'About'
      },
      {
        link: '#',
        text: 'Profile'
      },
      {
        link: '#',
        text: 'Services'
      }
    ]
  },
  {
    type: 'fullyRounded',
    children: [
      {
        link: '#',
        text: 'About'
      },
      {
        link: '#',
        text: 'Profile'
      },
      {
        link: '#',
        text: 'Services'
      }
    ]
  }
])
</script>

<template>
  <div class="p-4 sm:p-5 xl:p-7.5">
    <div class="flex flex-col gap-6">
      <template v-for="(groupItem, groupIndex) in buttonList" :key="groupIndex">
        <div
          class="flex items-center"
          :class="{
            'rounded-lg': groupItem.type === 'rounded',
            'rounded-full': groupItem.type === 'fullyRounded'
          }"
        >
          <template v-for="(item, index) in groupItem.children" :key="index">
            <router-link
              v-if="groupItem.type === 'square'"
              :to="item.link"
              class="inline-flex py-1 px-2 font-medium hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary sm:py-3 sm:px-6"
              :class="{
                'border-primary bg-primary text-white': index === 0,
                'border-stroke dark:border-strokedark text-black dark:text-white': index !== 0,
                'border-y': index !== 0 && index !== groupItem.children.length - 1,
                border: index === 0 || index === groupItem.children.length - 1
              }"
            >
              {{ item.text }}
            </router-link>

            <router-link
              v-if="groupItem.type === 'rounded'"
              :to="item.link"
              class="inline-flex py-1 px-2 font-medium hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary sm:py-3 sm:px-6"
              :class="{
                'rounded-l-lg border-primary bg-primary text-white': index === 0,
                'border-stroke dark:border-strokedark text-black dark:text-white': index !== 0,
                'rounded-r-lg': index === groupItem.children.length - 1,
                'border-y': index !== 0 && index !== groupItem.children.length - 1,
                border: index === 0 || index === groupItem.children.length - 1
              }"
            >
              {{ item.text }}
            </router-link>

            <router-link
              v-if="groupItem.type === 'fullyRounded'"
              :to="item.link"
              class="inline-flex py-1 px-2 font-medium hover:border-primary hover:bg-primary hover:text-white dark:hover:border-primary sm:py-3 sm:px-6"
              :class="{
                'rounded-l-full border-primary bg-primary text-white': index === 0,
                'border-stroke dark:border-strokedark text-black dark:text-white': index !== 0,
                'rounded-r-full': index === groupItem.children.length - 1,
                'border-y': index !== 0 && index !== groupItem.children.length - 1,
                border: index === 0 || index === groupItem.children.length - 1
              }"
            >
              {{ item.text }}
            </router-link>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
