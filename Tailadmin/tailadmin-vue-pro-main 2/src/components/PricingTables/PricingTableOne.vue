<script setup lang="ts">
import { ref } from 'vue'

const pricingPlans = ref([
  {
    type: 'Starter',
    price: 25.0,
    features: [
      'Get Figma Source File',
      'Use on Unlimited Projects',
      'Personal & Commercial Use',
      'Downloadable Offline Files',
      'Lifetime Free Updates'
    ],
    button: {
      text: 'Purchase Now'
    }
  },
  {
    popular: true,
    type: 'Basic',
    price: 59.0,
    features: [
      'Get Figma Source File',
      'Use on Unlimited Projects',
      'Personal & Commercial Use',
      'Downloadable Offline Files',
      'Lifetime Free Updates'
    ],
    button: {
      text: 'Purchase Now'
    }
  },
  {
    type: 'Premium',
    price: 99.0,
    features: [
      'Get Figma Source File',
      'Use on Unlimited Projects',
      'Personal & Commercial Use',
      'Downloadable Offline Files',
      'Lifetime Free Updates'
    ],
    button: {
      text: 'Purchase Now'
    }
  }
])
</script>

<style scoped>
.body {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

:root {
  --main-fill-color: #3c50e0; /* Set your default fill color here */
  --secondary-fill-color: #2539c8; /* Set your default secondary fill color here */
}

.custom-shape {
  width: 0;
  height: 0;
  border-left: 24px solid transparent;
  border-right: 85px solid transparent;
  border-bottom: 30px solid var(--main-fill-color);
  position: relative;
}

.triangle-bottom {
  position: absolute;
  bottom: -30px;
  left: 24px;
  width: 61px;
  height: 30px;
  background-color: var(--secondary-fill-color);
}
</style>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
    <template v-for="(plan, index) in pricingPlans" :key="index">
      <div
        class="relative rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark md:p-9 xl:p-11.5"
      >
        <span v-if="plan.popular" class="absolute top-3.5 -right-1">
          <svg
            width="109"
            height="34"
            viewBox="0 0 109 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 0L106 0C107.657 0 109 1.34315 109 3V30L24 30L24 0Z" fill="#3C50E0" />
            <foreignObject x="24" y="0" width="81" height="30">
              <div xmlns="http://www.w3.org/1999/xhtml">
                <div class="text-white font-satoshi font-medium text-sm text-center mt-1">
                  Best Value
                </div>
              </div>
            </foreignObject>
            <path d="M0 0H24V30H0L19 15L0 0Z" fill="#3C50E0" />
            <path d="M105 34L109 30H105V34Z" fill="#2539C8" />
          </svg>
        </span>

        <span class="mb-2.5 block text-title-sm2 font-bold text-black dark:text-white">{{
          plan.type
        }}</span>
        <h3>
          <span class="text-xl font-medium text-black dark:text-white">$</span>
          <span class="text-title-xxl2 font-bold text-black dark:text-white">
            {{ plan.price }}</span
          >
          <span class="font-medium"> Per Month</span>
        </h3>

        <h4 class="mt-7.5 mb-5 text-lg font-medium text-black dark:text-white">Features</h4>

        <ul class="flex flex-col gap-3.5">
          <template v-for="(feature, featureIndex) in plan.features" :key="featureIndex">
            <li class="font-medium">{{ feature }}</li>
          </template>
        </ul>

        <button
          class="mt-9 flex rounded-md border border-primary py-3 px-9 font-medium text-primary hover:bg-primary hover:text-white"
        >
          {{ plan.button.text }}
        </button>
      </div>
    </template>
  </div>
</template>
