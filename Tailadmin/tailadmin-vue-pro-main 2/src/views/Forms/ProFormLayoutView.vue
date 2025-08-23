<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import InputGroup from '@/components/Forms/InputGroup.vue'
import SelectGroup from '@/components/Forms/SelectGroup/SelectGroupTwo.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import { ref } from 'vue'
import SelectOptionOne from '@/components/Forms/SelectOption/SelectOptionOne.vue'
import SelectGroupThree from '@/components/Forms/SelectGroup/SelectGroupThree.vue'
import SelectOptionTwo from '@/components/Forms/SelectOption/SelectOptionTwo.vue'
import SelectOptionThree from '@/components/Forms/SelectOption/SelectOptionThree.vue'

const pageTitle = ref('Pro Form Layout')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <!-- ====== Form Layout Section Start -->
    <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div class="flex flex-col gap-9">
        <!-- Contact Form Start -->
        <DefaultCard cardTitle="Contact Form 2">
          <form action="#">
            <div class="p-6.5">
              <div class="mb-5 flex flex-col gap-6 xl:flex-row">
                <InputGroup
                  label="First name"
                  type="text"
                  placeholder="Enter your first name"
                  customClasses="w-full xl:w-1/2"
                />

                <InputGroup
                  label="Last name"
                  type="text"
                  placeholder="Enter your last name"
                  customClasses="w-full xl:w-1/2"
                />
              </div>

              <div class="mb-5 flex flex-col gap-6 xl:flex-row">
                <InputGroup
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  customClasses="w-full xl:w-1/2"
                />
                <InputGroup
                  label="Phone"
                  type="text"
                  placeholder="(321) 5555-0115"
                  customClasses="w-full xl:w-1/2"
                />
              </div>

              <div class="mb-5.5">
                <SelectOptionOne />
              </div>

              <div class="mb-6">
                <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                  Message
                </label>
                <textarea
                  rows="6"
                  placeholder="Type your message"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button
                class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Send Message
              </button>
            </div>
          </form>
        </DefaultCard>
        <!-- Contact Form End -->
      </div>

      <div class="flex flex-col gap-9">
        <!-- Sign In Start -->
        <DefaultCard cardTitle="Survey Form">
          <form action="#">
            <div class="p-6.5">
              <InputGroup
                label="Name"
                type="text"
                placeholder="Enter your full name"
                customClasses="mb-5"
              />

              <InputGroup
                label="Email"
                type="email"
                placeholder="Enter your email address"
                customClasses="mb-5"
              />

              <InputGroup
                label="Age"
                type="text"
                placeholder="Enter your age"
                customClasses="mb-5"
              />

              <SelectGroupThree />

              <SelectOptionTwo />

              <SelectOptionThree />

              <div class="mb-5.5">
                <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                  Any comments or suggestions?
                </label>
                <textarea
                  rows="6"
                  placeholder="Type here"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button
                class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                Send Message
              </button>
            </div>
          </form>
        </DefaultCard>
        <!-- Sign In End -->
      </div>
    </div>
    <!-- ====== Form Layout Section End -->
  </DefaultLayout>
</template>
