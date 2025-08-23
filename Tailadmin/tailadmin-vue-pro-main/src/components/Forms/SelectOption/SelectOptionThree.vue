<script setup lang="ts">
import SelectOptionGroup from '@/components/Forms/SelectOption/SelectOption.vue'

interface Language {
  id: string
  name: string
}

const languages: Language[] = [
  { id: 'C', name: 'C' },
  { id: 'C++', name: 'C++' },
  { id: 'Java', name: 'Java' },
  { id: 'Python', name: 'Python' },
  { id: 'JavaScript', name: 'JavaScript' },
  { id: 'React', name: 'React' },
  { id: 'Angular', name: 'Angular' }
]
</script>

<template>
  <div class="mb-6">
    <label class="mb-4.5 block text-sm font-medium text-black dark:text-white">
      Which languages & frameworks you know?
    </label>

    <div class="flex flex-col gap-2.5">
      <div v-for="(language, index) in languages" :key="language.id">
        <SelectOptionGroup :index="index" :option="language" />
      </div>
    </div>
  </div>
</template>
