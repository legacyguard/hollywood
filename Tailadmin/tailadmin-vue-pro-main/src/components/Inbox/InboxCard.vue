<script setup lang="ts">
import InboxPagination from './InboxPagination.vue'
import InboxSidebar from './InboxSidebar.vue'
import InboxHeader from './InboxHeader.vue'
import InboxList from './InboxList.vue'
</script>

<template>
  <div class="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
    <div
      class="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:flex"
    >
      <!-- ====== Inbox Sidebar Start -->
      <InboxSidebar />
      <!-- ====== Inbox Sidebar End -->

      <div class="flex h-full flex-col border-l border-stroke dark:border-strokedark lg:w-4/5">
        <!-- ====== Inbox Header Start -->
        <InboxHeader />
        <!-- ====== Inbox Header End -->

        <!-- ====== Inbox List Start -->
        <InboxList />
        <!-- ====== Inbox List End -->

        <!-- ====== Inbox Pagination Start -->
        <InboxPagination />
        <!-- ====== Inbox Pagination End -->
      </div>
    </div>
  </div>
</template>
