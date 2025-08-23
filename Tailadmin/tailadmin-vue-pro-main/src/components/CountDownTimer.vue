<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const days = ref<number>(0)
const hours = ref<number>(0)
const minutes = ref<number>(0)
const seconds = ref<number>(0)

const targetDate = new Date('12/31/2024 23:59:59')

const calculateRemainingPercentage = (): string => {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()
  const elapsedPercentage = (difference / targetDate.getTime()) * 100
  const remainingPercentage = (100 - elapsedPercentage).toFixed(2)

  return `${remainingPercentage}%`
}

const formatNumber = (num: number): number[] => {
  const formattedNumber = num.toString().padStart(2, '0')
  return formattedNumber.split('').map(Number)
}

const updateTimer = () => {
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  days.value = Math.floor(difference / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((difference % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateTimer()
  const interval = setInterval(updateTimer, 1000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <div>
      <div class="mb-3 flex items-center gap-2">
        <div
          v-for="(digit, index) in formatNumber(days)"
          :key="index"
          class="timer-box relative overflow-hidden rounded-lg"
        >
          <span
            class="flex h-17.5 min-w-[56px] items-center justify-center rounded-lg bg-black px-3 text-xl font-black leading-[1.35] text-white dark:bg-boxdark lg:text-3xl xl:text-[40px]"
            >{{ digit }}</span
          >
          <span
            class="absolute bottom-0 left-0 block w-full bg-[#000]/20 -z-1"
            :style="{ height: calculateRemainingPercentage() }"
          ></span>
        </div>
      </div>
      <span class="block text-center font-medium">Days</span>
    </div>
    <div>
      <div class="mb-3 flex items-center gap-2">
        <div
          v-for="(digit, index) in formatNumber(hours)"
          :key="index"
          class="timer-box relative overflow-hidden rounded-lg"
        >
          <span
            class="flex h-17.5 min-w-[56px] items-center justify-center rounded-lg bg-black px-3 text-xl font-black leading-[1.35] text-white dark:bg-boxdark lg:text-3xl xl:text-[40px]"
            >{{ digit }}</span
          >
          <span
            class="absolute bottom-0 left-0 block w-full bg-[#000]/20 -z-1"
            :style="{ height: calculateRemainingPercentage() }"
          ></span>
        </div>
      </div>
      <span class="block text-center font-medium">Hours</span>
    </div>
    <div>
      <div class="mb-3 flex items-center gap-2">
        <div
          v-for="(digit, index) in formatNumber(minutes)"
          :key="index"
          class="timer-box relative overflow-hidden rounded-lg"
        >
          <span
            class="flex h-17.5 min-w-[56px] items-center justify-center rounded-lg bg-black px-3 text-xl font-black leading-[1.35] text-white dark:bg-boxdark lg:text-3xl xl:text-[40px]"
            >{{ digit }}</span
          >
          <span
            class="absolute bottom-0 left-0 block w-full bg-[#000]/20 -z-1"
            :style="{ height: calculateRemainingPercentage() }"
          ></span>
        </div>
      </div>
      <span class="block text-center font-medium">Minutes</span>
    </div>
    <div>
      <div class="mb-3 flex items-center gap-2">
        <div
          v-for="(digit, index) in formatNumber(seconds)"
          :key="index"
          class="timer-box relative overflow-hidden rounded-lg"
        >
          <span
            class="flex h-17.5 min-w-[56px] items-center justify-center rounded-lg bg-black px-3 text-xl font-black leading-[1.35] text-white dark:bg-boxdark lg:text-3xl xl:text-[40px]"
            >{{ digit }}</span
          >
          <span
            class="absolute bottom-0 left-0 block w-full bg-[#000]/20 -z-1"
            :style="{ height: calculateRemainingPercentage() }"
          ></span>
        </div>
      </div>
      <span class="block text-center font-medium">Seconds</span>
    </div>
  </div>
</template>
