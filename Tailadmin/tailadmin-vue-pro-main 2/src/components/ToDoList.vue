<script setup lang="ts">
import { ref } from 'vue'
import DropdownDefault from './Dropdowns/DropdownDefault.vue'

const ToDoList = ref([
  {
    icon: `<svg
            width="26"
            height="20"
            viewBox="0 0 26 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_605_15057)">
              <path
                d="M13.0842 5.33077V11.4067C13.0842 14.2371 11.3726 15.9467 8.778 15.9467C6.18312 15.9467 4.3615 14.2371 4.3615 11.4067V0H0V11.4067C0 16.5914 3.42261 19.8145 8.778 19.8145C14.1055 19.8145 17.4457 16.5914 17.4457 11.4067V0H17.3691C15.069 0.7498 13.3531 2.81913 13.0842 5.33077Z"
                fill="url(#paint0_linear_605_15057)"
              />
              <path
                d="M21.1794 0H21.1045V19.6186H25.4661V5.33473C25.4249 3.15456 23.4808 0.750281 21.1794 0Z"
                fill="url(#paint1_linear_605_15057)"
              />
              <path
                d="M13.0842 5.33077V11.4067C13.0842 11.4103 13.0839 11.414 13.0839 11.418C13.085 11.4784 13.0882 11.5383 13.0882 11.5992C13.0882 15.6912 10.0528 19.0615 6.14392 19.5207C6.95742 19.7131 7.83731 19.8145 8.778 19.8145C14.1055 19.8145 17.4457 16.5914 17.4457 11.4067V0H17.3691C15.069 0.7498 13.3531 2.81913 13.0842 5.33077Z"
                fill="url(#paint2_linear_605_15057)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_605_15057"
                x1="14.9261"
                y1="17.8993"
                x2="3.30015"
                y2="-1.93446"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#2535C5" />
                <stop offset="0.169697" stop-color="#36409B" />
                <stop offset="0.575758" stop-color="#475BC6" />
                <stop offset="1" stop-color="#7075E4" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_605_15057"
                x1="23.2853"
                y1="0"
                x2="23.2853"
                y2="19.6187"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#375AD8" />
                <stop offset="0.472727" stop-color="#3C56DD" />
                <stop offset="1" stop-color="#2A1A8F" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_605_15057"
                x1="11.7948"
                y1="0"
                x2="11.7948"
                y2="19.8146"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#233593" />
                <stop offset="0.472727" stop-color="#4957D7" />
                <stop offset="0.890909" stop-color="#5465FF" />
                <stop offset="1" stop-color="#6A67FF" />
              </linearGradient>
              <clipPath id="clip0_605_15057">
                <rect width="25.7692" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>`,
    title: 'Uideck Yearly Meetings',
    time: '10:20 AM - 3:00 PM',
    date: '14 February,2025',
    status: 'Completed'
  },
  {
    icon: `<svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_605_15127)">
              <path
                d="M16 1.0625C24.25 1.0625 30.925 7.7375 30.925 15.975C30.925 24.2125 24.25 30.9 16 30.9C7.74995 30.9 1.07495 24.225 1.07495 15.9875C1.07495 7.75 7.74995 1.0625 16 1.0625Z"
                fill="#E74D89"
              />
              <path
                d="M16 31.9625C7.175 31.9625 0 24.8 0 15.9875C0 7.1625 7.175 0 16 0C24.825 0 32 7.1625 32 15.975C32 24.7875 24.825 31.9625 16 31.9625ZM29.4875 18.1625C29.025 18.0125 25.2625 16.9 20.975 17.575C22.7625 22.475 23.4875 26.475 23.625 27.3C26.7 25.2375 28.8875 21.9625 29.4875 18.1625ZM21.3375 28.5625C21.1375 27.3625 20.3375 23.1875 18.425 18.2125C18.4 18.225 18.3625 18.2375 18.3375 18.2375C10.625 20.925 7.8625 26.2625 7.6125 26.7625C9.925 28.5625 12.8375 29.6375 16 29.6375C17.8875 29.65 19.7 29.2625 21.3375 28.5625ZM5.85 25.125C6.1625 24.6 9.9125 18.4 16.9625 16.1125C17.1375 16.05 17.325 16 17.5 15.95C17.1625 15.175 16.7875 14.4 16.3875 13.6375C9.5625 15.675 2.9375 15.5875 2.3375 15.575C2.3375 15.7125 2.325 15.85 2.325 15.9875C2.3375 19.5 3.6625 22.7 5.85 25.125ZM2.625 13.2C3.2375 13.2125 8.8625 13.2375 15.2625 11.5375C13 7.5125 10.55 4.1375 10.2 3.65C6.3625 5.45 3.5125 8.975 2.625 13.2ZM12.8 2.725C13.175 3.225 15.6625 6.6 17.9 10.7125C22.7625 8.8875 24.8125 6.1375 25.0625 5.7875C22.65 3.65 19.475 2.35 16 2.35C14.9 2.35 13.825 2.4875 12.8 2.725ZM26.575 7.3625C26.2875 7.75 24 10.6875 18.95 12.75C19.2625 13.4 19.575 14.0625 19.8625 14.725C19.9625 14.9625 20.0625 15.2 20.1625 15.425C24.7125 14.85 29.225 15.775 29.675 15.8625C29.6375 12.65 28.4875 9.6875 26.575 7.3625Z"
                fill="#B2215A"
              />
            </g>
            <defs>
              <clipPath id="clip0_605_15127">
                <rect width="32" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>`,
    title: '2025 Dribbble Meet Up',
    time: '09:30 AM - 12:00 AM',
    date: '12 February,2025',
    status: 'Upcoming'
  },
  {
    icon: `<svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_605_15132)">
              <path
                d="M21.9381 0.375H2.10058C1.16309 0.375 0.413086 1.125 0.413086 2.0625V21.9375C0.413086 22.8375 1.16309 23.625 2.10058 23.625H21.8631C22.8006 23.625 23.5506 22.875 23.5506 21.9375V2.025C23.6256 1.125 22.8756 0.375 21.9381 0.375ZM7.2756 20.1375H3.8631V9.075H7.2756V20.1375ZM5.5506 7.5375C4.4256 7.5375 3.56308 6.6375 3.56308 5.55C3.56308 4.4625 4.4631 3.5625 5.5506 3.5625C6.6381 3.5625 7.5381 4.4625 7.5381 5.55C7.5381 6.6375 6.7131 7.5375 5.5506 7.5375ZM20.2131 20.1375H16.8006V14.775C16.8006 13.5 16.7631 11.8125 15.0006 11.8125C13.2006 11.8125 12.9381 13.2375 12.9381 14.6625V20.1375H9.5256V9.075H12.8631V10.6125H12.9006C13.3881 9.7125 14.4756 8.8125 16.1631 8.8125C19.6506 8.8125 20.2881 11.0625 20.2881 14.1375V20.1375H20.2131Z"
                fill="#0B65C2"
              />
            </g>
            <defs>
              <clipPath id="clip0_605_15132">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>`,
    title: '2025 Linkedin Meet Up',
    time: '10:30 AM - 11:00 PM',
    date: '05 February,2025',
    status: 'Canceled'
  }
])
</script>

<template>
  <div class="col-span-12 xl:col-span-7">
    <div
      class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
    >
      <div
        class="border-b border-stroke px-4 py-4 dark:border-strokedark md:px-6 md:py-6 xl:px-7.5"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-title-sm2 font-bold text-black dark:text-white">To Do List</h2>
          </div>
          <DropdownDefault />
        </div>
      </div>

      <div class="px-4 py-4 md:px-6 md:py-6 xl:px-7.5">
        <div class="flex flex-col gap-6">
          <template v-for="(item, index) in ToDoList" :key="index">
            <div class="flex items-center justify-between">
              <div class="flex flex-grow items-center gap-4.5">
                <div
                  class="hidden h-15 w-full max-w-15 items-center justify-center rounded-full border border-stroke bg-gray dark:border-strokedark dark:bg-meta-4 xsm:flex"
                  v-html="item.icon"
                ></div>

                <div>
                  <h4 class="mb-2 font-medium text-black dark:text-white">{{ item.title }}</h4>

                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
                    <span class="flex items-center gap-1.5">
                      <svg
                        class="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.57495 2.99999V1.57499H9.92495C10.225 1.57499 10.5 1.32499 10.5 0.999988C10.5 0.674988 10.25 0.424988 9.92495 0.424988H6.09995C5.79995 0.424988 5.52495 0.674988 5.52495 0.999988C5.52495 1.32499 5.77495 1.57499 6.09995 1.57499H7.44995V2.99999C4.22495 3.29999 1.69995 5.99999 1.69995 9.27499C1.69995 12.75 4.52495 15.575 7.99995 15.575C11.475 15.575 14.3 12.75 14.3 9.27499C14.3 5.99999 11.775 3.29999 8.57495 2.99999ZM7.99995 14.45C5.14995 14.45 2.82495 12.125 2.82495 9.27499C2.82495 6.42499 5.14995 4.09999 7.99995 4.09999C10.85 4.09999 13.175 6.42499 13.175 9.27499C13.175 12.125 10.85 14.45 7.99995 14.45Z"
                          fill=""
                        />
                        <path
                          d="M11.1749 8.69996H8.5749V6.09996C8.5749 5.79996 8.3249 5.52496 7.9999 5.52496C7.6999 5.52496 7.4249 5.77496 7.4249 6.09996V8.72496H6.7249C6.4249 8.72496 6.1499 8.97496 6.1499 9.29996C6.1499 9.62496 6.3999 9.87496 6.7249 9.87496H7.4249V10.575C7.4249 10.875 7.6749 11.15 7.9999 11.15C8.2999 11.15 8.5749 10.9 8.5749 10.575V9.87496H11.1999C11.4999 9.87496 11.7749 9.62496 11.7749 9.29996C11.7749 8.97496 11.4999 8.69996 11.1749 8.69996Z"
                          fill=""
                        />
                      </svg>

                      <span class="text-xs font-medium">{{ item.time }}</span>
                    </span>

                    <span class="flex items-center gap-1.5">
                      <svg
                        class="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2.65002H12.7V2.10002C12.7 1.80002 12.45 1.52502 12.125 1.52502C11.8 1.52502 11.55 1.77502 11.55 2.10002V2.65002H4.42505V2.10002C4.42505 1.80002 4.17505 1.52502 3.85005 1.52502C3.52505 1.52502 3.27505 1.77502 3.27505 2.10002V2.65002H2.00005C1.15005 2.65002 0.425049 3.35002 0.425049 4.22502V12.925C0.425049 13.775 1.12505 14.5 2.00005 14.5H14C14.85 14.5 15.575 13.8 15.575 12.925V4.20002C15.575 3.35002 14.85 2.65002 14 2.65002ZM1.57505 7.30002H3.70005V9.77503H1.57505V7.30002ZM4.82505 7.30002H7.45005V9.77503H4.82505V7.30002ZM7.45005 10.9V13.35H4.82505V10.9H7.45005ZM8.57505 10.9H11.2V13.35H8.57505V10.9ZM8.57505 9.77503V7.30002H11.2V9.77503H8.57505ZM12.3 7.30002H14.425V9.77503H12.3V7.30002ZM2.00005 3.77502H3.30005V4.30002C3.30005 4.60002 3.55005 4.87502 3.87505 4.87502C4.20005 4.87502 4.45005 4.62502 4.45005 4.30002V3.77502H11.6V4.30002C11.6 4.60002 11.85 4.87502 12.175 4.87502C12.5 4.87502 12.75 4.62502 12.75 4.30002V3.77502H14C14.25 3.77502 14.45 3.97502 14.45 4.22502V6.17502H1.57505V4.22502C1.57505 3.97502 1.75005 3.77502 2.00005 3.77502ZM1.57505 12.9V10.875H3.70005V13.325H2.00005C1.75005 13.35 1.57505 13.15 1.57505 12.9ZM14 13.35H12.3V10.9H14.425V12.925C14.45 13.15 14.25 13.35 14 13.35Z"
                          fill=""
                        />
                      </svg>

                      <span class="text-xs font-medium">{{ item.date }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <span
                class="rounded py-1.5 px-2.5 text-sm font-medium"
                :class="{
                  'bg-meta-3/[0.08] text-meta-3': item.status === 'Completed',
                  'bg-primary/[0.08] text-primary': item.status === 'Upcoming',
                  'bg-red/[0.08] text-red': item.status === 'Canceled'
                }"
                >{{ item.status }}</span
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
