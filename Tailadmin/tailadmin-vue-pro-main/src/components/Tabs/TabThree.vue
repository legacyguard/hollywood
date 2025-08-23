<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref(0)

const tabs = ref([
  {
    title: 'Profile',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus ligula nec dolor placerat, a consequat elit volutpat. Quisque nibh lacus, posuere et turpis in, pretium facilisis nisl. Proin congue sem vel sollicitudin sagittis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per'
  },
  {
    title: 'Password',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde ex dolorum voluptate cupiditate adipisci doloremque, vel quam praesentium nihil veritatis.'
  },
  {
    title: 'Team',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?'
  },
  {
    title: 'Notification',
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
    <div class="mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10">
      <router-link
        to=""
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectTab(index)"
        :class="{
          'text-primary border-primary': activeTab === index,
          'border-transparent': activeTab !== index
        }"
        class="border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base"
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
