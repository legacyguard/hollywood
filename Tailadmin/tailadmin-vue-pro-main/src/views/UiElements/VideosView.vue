<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/DefaultCard.vue'
import VideoItem from '@/components/Videos/VideoItem.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'

const pageTitle = ref('Videos')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- Videos Start -->
    <div class="flex flex-col gap-7.5">
      <DefaultCard title="Embeds Video">
        <VideoItem
          videoSrc="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
          ratio="aspect-video"
        />
      </DefaultCard>

      <DefaultCard title="Responsive Aspect ratios 4:3">
        <VideoItem videoSrc="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" ratio="aspect-4/3" />
      </DefaultCard>

      <DefaultCard title="Responsive Aspect ratios 21:9">
        <VideoItem videoSrc="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" ratio="aspect-21/9" />
      </DefaultCard>

      <DefaultCard title="Responsive Aspect ratios 1:1">
        <VideoItem
          videoSrc="https://www.youtube.com/embed/zpOULjyy-n8?rel=0"
          ratio="aspect-square"
        />
      </DefaultCard>
    </div>
    <!-- Videos End -->
  </DefaultLayout>
</template>
