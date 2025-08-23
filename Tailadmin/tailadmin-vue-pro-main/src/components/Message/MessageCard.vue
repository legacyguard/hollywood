<script setup lang="ts">
import MessageSidebar from './MessageSidebar.vue'
import MessageHeader from './MessageHeader.vue'
import MessageInputBox from './MessageInputBox.vue'
import MessageOutputBox from './MessageOutputBox.vue'
</script>

<template>
  <div class="h-[calc(100vh-186px)] overflow-hidden sm:h-[calc(100vh-174px)]">
    <div
      class="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:flex"
    >
      <!-- ====== Message Sidebar Start -->
      <MessageSidebar />
      <!-- ====== Message Sidebar End -->

      <div class="flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4">
        <!-- ====== Message Header Start -->
        <MessageHeader />
        <!-- ====== Message Header End -->

        <!-- ====== Message Output Box Start -->
        <MessageOutputBox />
        <!-- ====== Message Output Box End -->

        <!-- ====== Message Input Box Start -->
        <MessageInputBox />
        <!-- ====== Message Input Box End -->
      </div>
    </div>
  </div>
</template>
