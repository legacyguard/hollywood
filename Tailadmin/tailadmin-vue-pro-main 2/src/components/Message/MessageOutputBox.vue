<script setup lang="ts">
import { ref } from 'vue'

const messageTexts = ref([
  {
    userName: 'Andri Thomas',
    text: 'I want to make an appointment tomorrow from 2:00 to 5:00pm?',
    time: '1:55pm',
    reply: {
      text: 'Hello, Thomas! I will check the schedule and inform you',
      time: '1:55pm'
    }
  },
  {
    userName: 'Andri Thomas',
    text: 'Ok, Thanks for your reply.',
    time: '1:55pm',
    reply: {
      text: 'You are welcome!',
      time: '1:55pm'
    }
  },
  {
    userName: 'Andri Thomas',
    text: 'I want to make an appointment tomorrow from 2:00 to 5:00pm?',
    time: '1:55pm',
    reply: {
      text: 'Hello, Thomas! I will check the schedule and inform you',
      time: '1:55pm'
    }
  },
  {
    userName: 'Andri Thomas',
    text: 'Ok, Thanks for your reply.',
    time: '1:55pm',
    reply: {
      text: 'You are welcome!',
      time: '1:55pm'
    }
  }
])
</script>

<template>
  <div class="max-h-full space-y-3.5 overflow-auto px-6 py-7.5">
    <template v-for="(textItem, textIndex) in messageTexts" :key="textIndex">
      <div class="max-w-125">
        <p class="mb-2.5 text-sm font-medium">{{ textItem.userName }}</p>
        <div class="mb-2.5 rounded-2xl rounded-tl-none bg-gray py-3 px-5 dark:bg-boxdark-2">
          <p class="font-medium">{{ textItem.text }}</p>
        </div>
        <p class="text-xs font-medium">{{ textItem.time }}</p>
      </div>
      <div v-if="textItem.reply" class="ml-auto max-w-125">
        <div class="mb-2.5 rounded-2xl rounded-br-none bg-primary py-3 px-5">
          <p class="font-medium text-white">
            {{ textItem.reply.text }}
          </p>
        </div>
        <p class="text-right text-xs font-medium">{{ textItem.reply.time }}</p>
      </div>
    </template>
  </div>
</template>
