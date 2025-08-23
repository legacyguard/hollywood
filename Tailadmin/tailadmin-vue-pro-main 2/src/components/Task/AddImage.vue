<script setup lang="ts">
import { ref } from 'vue'

const files = ref<FileList | null>(null)

const updateFiles = (event: any) => {
  files.value = event.target.files
}

const resetFiles = () => {
  files.value = null
}

const setDragState = (isActive: boolean) => {
  const uploadContainer = document.getElementById('FileUpload')
  if (uploadContainer) {
    isActive ? uploadContainer.classList.add('active') : uploadContainer.classList.remove('active')
  }
}
</script>

<template>
  <div class="mb-5">
    <label for="taskImg" class="mb-2.5 block font-medium text-black dark:text-white">
      Add image
    </label>

    <div>
      <div
        id="FileUpload"
        class="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white py-4 px-4 dark:border-strokedark dark:bg-boxdark sm:py-14"
      >
        <input
          type="file"
          accept="image/*"
          class="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none"
          @change="updateFiles"
          @dragover.prevent="setDragState(true)"
          @dragleave.prevent="setDragState(false)"
          @drop.prevent="setDragState(false)"
        />
        <div class="flex flex-col items-center justify-center space-y-3">
          <span
            class="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_75_12841)">
                <path
                  d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z"
                  fill="#3C50E0"
                />
              </g>
              <defs>
                <clipPath id="clip0_75_12841">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          <p class="text-xs"><span class="text-primary">Click to upload</span> or drag and drop</p>
        </div>
      </div>

      <template v-if="files !== null">
        <div
          class="mt-4.5 border border-stroke bg-white py-3 px-4 dark:border-strokedark dark:bg-boxdark"
        >
          <div class="flex items-center justify-between">
            <template v-for="file in files" :key="file.name">
              <span>{{ file.name }}</span>
            </template>

            <button @click="resetFiles">
              <svg
                class="fill-current"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                  fill=""
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
