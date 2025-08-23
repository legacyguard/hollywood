<script setup lang="ts">
import DropdownDefault from '@/components/Dropdowns/DropdownDefault.vue'

import { onMounted, ref } from 'vue'

const lanes = ref([
  {
    title: "To Do's",
    tasks: [
      {
        title: 'Task title',
        taskItems: [
          {
            name: 'Here is task one',
            completed: false
          },
          {
            name: 'Here is task Two',
            completed: true
          },
          {
            name: 'Here is task Three',
            completed: false
          }
        ]
      },
      {
        title: 'Task title',
        taskItems: [
          {
            name: 'Here is task one',
            completed: false
          },
          {
            name: 'Here is task Two',
            completed: true
          }
        ]
      },
      {
        title: 'Task title',
        taskItems: [
          {
            name: 'Here is task one',
            completed: false
          }
        ]
      }
    ]
  },
  {
    title: 'In Progress',
    tasks: [
      {
        title: 'Task title',
        taskItems: [
          {
            name: 'Here is task one',
            completed: false
          }
        ]
      }
    ]
  },
  {
    title: 'Completed',
    tasks: [
      {
        title: 'Task title',
        taskItems: [
          {
            name: 'Here is task one',
            completed: true
          },
          {
            name: 'Here is task Two',
            completed: true
          }
        ]
      }
    ]
  }
])

onMounted(() => {
  const draggables = document.querySelectorAll('.task')
  const droppables = document.querySelectorAll('.swim-lane')

  draggables.forEach((task) => {
    task.addEventListener('dragstart', () => {
      task.classList.add('is-dragging')
    })
    task.addEventListener('dragend', () => {
      task.classList.remove('is-dragging')
    })
  })

  droppables.forEach((zone) => {
    zone.addEventListener('dragover', (e: Event) => {
      e.preventDefault()

      const bottomTask = insertAboveTask(zone as HTMLElement, (e as DragEvent).clientY)
      const curTask = document.querySelector('.is-dragging')

      if (!bottomTask) {
        if (curTask) {
          zone.appendChild(curTask)
        }
      } else {
        if (curTask) {
          zone.insertBefore(curTask, bottomTask)
        }
      }
    })
  })

  const insertAboveTask = (zone: HTMLElement, mouseY: number): HTMLElement | null => {
    const els = Array.from(zone.querySelectorAll('.task:not(.is-dragging)'))

    let closestTask: HTMLElement | null = null
    let closestOffset = Number.NEGATIVE_INFINITY

    els.forEach((task) => {
      const { top } = task.getBoundingClientRect()

      const offset = mouseY - top

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset
        closestTask = task as HTMLElement
      }
    })

    return closestTask
  }
})
</script>

<template>
  <div v-for="(lane, index) in lanes" :key="index" class="swim-lane flex flex-col gap-5.5">
    <h4 class="text-xl font-bold text-black dark:text-white">
      {{ lane.title }} ({{ lane.tasks.length }})
    </h4>

    <template v-for="(task, taskIndex) in lane.tasks" :key="taskIndex">
      <div
        draggable="true"
        class="task relative flex cursor-move justify-between rounded-sm border border-stroke bg-white p-7 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div>
          <h5 class="mb-4 text-lg font-medium text-black dark:text-white">{{ task.title }}</h5>

          <div class="flex flex-col gap-2">
            <template v-for="(item, itemIndex) in task.taskItems" :key="itemIndex">
              <label
                :for="`taskCheckbox-${index}-${taskIndex}-${itemIndex}`"
                class="cursor-pointer"
              >
                <div class="relative flex items-center pt-0.5">
                  <input
                    :id="`taskCheckbox-${index}-${taskIndex}-${itemIndex}`"
                    type="checkbox"
                    class="taskCheckbox sr-only"
                    :checked="item.completed"
                  />
                  <div
                    class="box mr-3 flex h-5 w-5 items-center justify-center rounded border border-stroke dark:border-strokedark dark:bg-boxdark-2"
                  >
                    <span class="text-white opacity-0">
                      <svg
                        class="fill-current"
                        width="10"
                        height="7"
                        viewBox="0 0 10 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.70685 0.292804C9.89455 0.480344 10 0.734667 10 0.999847C10 1.26503 9.89455 1.51935 9.70685 1.70689L4.70059 6.7072C4.51283 6.89468 4.2582 7 3.9927 7C3.72721 7 3.47258 6.89468 3.28482 6.7072L0.281063 3.70701C0.0986771 3.5184 -0.00224342 3.26578 3.785e-05 3.00357C0.00231912 2.74136 0.10762 2.49053 0.29326 2.30511C0.4789 2.11969 0.730026 2.01451 0.992551 2.01224C1.25508 2.00996 1.50799 2.11076 1.69683 2.29293L3.9927 4.58607L8.29108 0.292804C8.47884 0.105322 8.73347 0 8.99896 0C9.26446 0 9.51908 0.105322 9.70685 0.292804Z"
                          fill=""
                        />
                      </svg>
                    </span>
                  </div>
                  <p>{{ item.name }}</p>
                </div>
              </label>
            </template>
          </div>
        </div>

        <div class="absolute right-4 top-4">
          <DropdownDefault />
        </div>
      </div>
    </template>
  </div>
</template>
