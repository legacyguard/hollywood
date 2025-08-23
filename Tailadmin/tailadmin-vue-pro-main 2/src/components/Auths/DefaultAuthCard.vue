<script setup lang="ts">
const props = defineProps(['subtitle', 'title', 'customClasses', 'description'])
</script>

<template>
  <!-- ====== Forms Section Start -->
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="flex flex-wrap items-stretch">
      <div class="hidden w-full items-center justify-center xl:flex xl:w-1/2">
        <div class="py-17.5 text-center w-full max-w-[350px]">
          <router-link class="mb-5.5 inline-block" to="/">
            <img class="hidden dark:block" src="@/assets/images/logo/logo.svg" alt="Logo" />
            <img class="dark:hidden" src="@/assets/images/logo/logo-dark.svg" alt="Logo" />
          </router-link>

          <p class="font-medium">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
          </p>

          <span class="mt-15 inline-block">
            <img src="@/assets/images/illustration/illustration-03.svg" alt="illustration" />
          </span>
        </div>
      </div>
      <div
        class="w-full px-4 sm:px-12.5 flex items-center justify-center border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2"
      >
        <div class="w-full py-17.5 max-w-[585px]">
          <span v-if="props.subtitle" class="mb-1.5 block font-medium">{{ props.subtitle }}</span>
          <h2
            class="text-2xl font-bold text-black dark:text-white sm:text-title-xl2"
            :class="{
              'mb-3': props.description,
              'mb-9': !props.description
            }"
          >
            {{ props.title }}
          </h2>
          <p v-if="props.description" class="mb-7.5 font-medium">
            {{ props.description }}
          </p>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  <!-- ====== Forms Section End -->
</template>
