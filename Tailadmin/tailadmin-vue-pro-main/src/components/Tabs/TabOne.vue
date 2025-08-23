<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref(0)

const tabs = ref([
  {
    title: 'Home',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.'
  },
  {
    title: 'About Us',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde ex dolorum voluptate cupiditate adipisci doloremque, vel quam praesentium nihil veritatis.'
  },
  {
    title: 'Our Team',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?'
  },
  {
    title: 'Company Details',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.'
  }
])

const selectTab = (index: number) => {
  activeTab.value = index
}
</script>

<template>
  <div class="mb-14 w-full p-7.5">
    <div
      class="mb-7.5 flex flex-wrap gap-3 rounded-lg border border-stroke py-3 px-4 dark:border-strokedark"
    >
      <router-link
        to=""
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectTab(index)"
        :class="{
          'bg-primary text-white': activeTab === index,
          'bg-gray dark:bg-meta-4 text-black dark:text-white': activeTab !== index
        }"
        class="rounded-md py-3 px-4 text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-primary md:text-base lg:px-6"
      >
        {{ tab.title }}
      </router-link>
    </div>
    <div>
      <div class="font-medium leading-relaxed">
        {{ tabs[activeTab].content }}
      </div>
    </div>
  </div>
</template>
