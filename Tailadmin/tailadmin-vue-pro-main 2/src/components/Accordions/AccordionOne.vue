<script setup lang="ts">
import { ref } from 'vue'

interface AccordionItems {
  accordionOpen: boolean
  title: string
  details: string
}

const accordionItems = ref<AccordionItems[]>([
  {
    accordionOpen: false,
    title: 'How long we deliver your first blog post?',
    details:
      'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available .'
  },
  {
    accordionOpen: true,
    title: 'How long we deliver your first blog post?',
    details:
      'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available .'
  },
  {
    accordionOpen: false,
    title: 'How long we deliver your first blog post?',
    details:
      'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available .'
  },
  {
    accordionOpen: false,
    title: 'How long we deliver your first blog post?',
    details:
      'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available .'
  },
  {
    accordionOpen: false,
    title: 'How long we deliver your first blog post?',
    details:
      'It takes 2-3 weeks to get your first blog post ready. That includes the in-depth research & creation of your monthly content marketing strategy that we do before writing your first blog post, Ipsum available .'
  }
])
</script>

<template>
  <div class="p-4 sm:p-6 xl:p-12.5">
    <div class="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2 xl:gap-7.5">
      <div class="flex flex-col gap-6">
        <template v-for="(item, index) in accordionItems" :key="index">
          <div
            v-if="index % 2 !== 0"
            class="rounded-md border border-stroke p-4 shadow-9 dark:border-strokedark dark:shadow-none sm:p-6"
          >
            <button
              @click="item.accordionOpen = !item.accordionOpen"
              class="flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6"
            >
              <div
                class="flex h-10.5 w-full max-w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4"
              >
                <svg
                  :class="item.accordionOpen && 'rotate-180'"
                  class="duration-200 ease-in-out fill-primary stroke-primary dark:fill-white dark:stroke-white"
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
                    fill=""
                    stroke=""
                  />
                </svg>
              </div>

              <div>
                <h4 class="text-left text-title-xsm font-medium text-black dark:text-white">
                  {{ item.title }}
                </h4>
              </div>
            </button>

            <div v-show="item.accordionOpen" class="mt-5 ml-16.5 duration-200 ease-in-out">
              <p class="font-medium">
                {{ item.details }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <div class="flex flex-col gap-6">
        <template v-for="(item, index) in accordionItems" :key="index">
          <div
            v-if="index % 2 === 0"
            class="rounded-md border border-stroke p-4 shadow-9 dark:border-strokedark dark:shadow-none sm:p-6"
          >
            <button
              @click="item.accordionOpen = !item.accordionOpen"
              class="flex w-full items-center gap-1.5 sm:gap-3 xl:gap-6"
            >
              <div
                class="flex h-10.5 w-full max-w-10.5 items-center justify-center rounded-md bg-[#F3F5FC] dark:bg-meta-4"
              >
                <svg
                  :class="item.accordionOpen && 'rotate-180'"
                  class="duration-200 ease-in-out fill-primary stroke-primary dark:fill-white dark:stroke-white"
                  width="18"
                  height="10"
                  viewBox="0 0 18 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.28882 8.43257L8.28874 8.43265L8.29692 8.43985C8.62771 8.73124 9.02659 8.86001 9.41667 8.86001C9.83287 8.86001 10.2257 8.69083 10.5364 8.41713L10.5365 8.41721L10.5438 8.41052L16.765 2.70784L16.771 2.70231L16.7769 2.69659C17.1001 2.38028 17.2005 1.80579 16.8001 1.41393C16.4822 1.1028 15.9186 1.00854 15.5268 1.38489L9.41667 7.00806L3.3019 1.38063L3.29346 1.37286L3.28467 1.36548C2.93287 1.07036 2.38665 1.06804 2.03324 1.41393L2.0195 1.42738L2.00683 1.44184C1.69882 1.79355 1.69773 2.34549 2.05646 2.69659L2.06195 2.70196L2.0676 2.70717L8.28882 8.43257Z"
                    fill=""
                    stroke=""
                  />
                </svg>
              </div>

              <div>
                <h4 class="text-left text-title-xsm font-medium text-black dark:text-white">
                  {{ item.title }}
                </h4>
              </div>
            </button>

            <div v-show="item.accordionOpen" class="mt-5 ml-16.5 duration-200 ease-in-out">
              <p class="font-medium">
                {{ item.details }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
