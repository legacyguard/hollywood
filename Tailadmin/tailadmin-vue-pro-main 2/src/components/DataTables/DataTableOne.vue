import type { onMounted } from 'vue';
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataTable } from 'simple-datatables'

const columns = ref([
  { title: 'Name/ID', key: 'name' },
  { title: 'Position', key: 'position' },
  { title: 'BDay', key: 'bday', type: 'date', format: 'YYYY/DD/MM' },
  { title: 'Email/Phone', key: 'email' },
  { title: 'Address', key: 'address' },
  { title: 'Status', key: 'status' }
])

const dataList = ref([
  {
    id: '155',
    name: 'Brielle Kuphal',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1977',
    email: 'Brielle45@gmail.com',
    phone: '+323(29)-232-44-74',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '156',
    name: 'Barney Murray',
    position: 'Developer',
    duration: '3 years',
    birthDate: '25 Nov, 1966',
    email: 'Barney@gmail.com',
    phone: '+323(29)-232-75-44',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '157',
    name: 'Ressie Ruecker',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1955',
    email: 'Ressie@gmail.com',
    phone: '+323(29)-785-44-44',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '158',
    name: 'Teresa Mertz',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1979',
    email: 'Teresa@gmail.com',
    phone: '+323(29)-232-15-44',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '159',
    name: 'Chelsey Hackett',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1969',
    email: 'Chelsey@gmail.com',
    phone: '+323(29)-232-56-89',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '160',
    name: 'Tatyana Metz',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1989',
    email: 'Tatyana@gmail.com',
    phone: '+323(29)-789-42-23',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '161',
    name: 'Oleta Harvey',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1979',
    email: 'Oleta@gmail.com',
    phone: '+323(29)-852-63-95',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '162',
    name: 'Bette Haag',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1979',
    email: 'Bette@gmail.com',
    phone: '+323(29)-852-23-01',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '163',
    name: 'Meda Ebert',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1945',
    email: 'Meda@gmail.com',
    phone: '+323(29)-232-15-23',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '164',
    name: 'Elissa Stroman',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 2000',
    email: 'Elissa@gmail.com',
    phone: '+323(29)-756-25-63',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '165',
    name: 'Sid Swaniawski',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1999',
    email: 'Sid@gmail.com',
    phone: '+323(29)-859-52-12',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '166',
    name: 'Madonna Hahn',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1965',
    email: 'Madonna@gmail.com',
    phone: '+323(29)-896-52-13',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '167',
    name: 'Waylon Kihn',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1975',
    email: 'Waylon@gmail.com',
    phone: '+323(29)-420-45-65',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '168',
    name: 'Jaunita Lindgren',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1945',
    email: 'Jaunita@gmail.com',
    phone: '+323(29)-789-45-89',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '169',
    name: 'Lenora MacGyver',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1998',
    email: 'Lenora@gmail.com',
    phone: '+323(29)-789-12-75',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '159',
    name: 'Chelsey Hackett',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1968',
    email: 'Chelsey@gmail.com',
    phone: '+323(29)-963-14-52',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '160',
    name: 'Tatyana Metz',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1984',
    email: 'Tatyana@gmail.com',
    phone: '+323(29)-856-75-12',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '161',
    name: 'Oleta Harvey',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1989',
    email: 'Oleta@gmail.com',
    phone: '+323(29)-963-15-95',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '163',
    name: 'Meda Ebert',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1988',
    email: 'Meda@gmail.com',
    phone: '+323(29)-258-62-32',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '164',
    name: 'Elissa Stroman',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1998',
    email: 'Elissa@gmail.com',
    phone: '+323(29)-856-41-44',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '165',
    name: 'Sid Swaniawski',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1997',
    email: 'Sid@gmail.com',
    phone: '+323(29)-147-75-56',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '166',
    name: 'Madonna Hahn',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1964',
    email: 'Madonna@gmail.com',
    phone: '+323(29)-863-25-13',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '167',
    name: 'Waylon Kihn',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1945',
    email: 'Waylon@gmail.com',
    phone: '+323(29)-896-75-25',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  },
  {
    id: '168',
    name: 'Jaunita Lindgren',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1989',
    email: 'Jaunita@gmail.com',
    phone: '+323(29)-789-12-45',
    address: 'Block A, Demo Park',
    status: 'Full-time'
  },
  {
    id: '169',
    name: 'Lenora MacGyver',
    position: 'Designer',
    duration: '3 years',
    birthDate: '25 Nov, 1985',
    email: 'Lenora@gmail.com',
    phone: '+323(29)-856-75-12',
    address: 'Block A, Demo Park',
    status: 'Part-time'
  }
])

onMounted(() => {
  const dataTableOne = document.querySelectorAll('#dataTableOne')

  if (dataTableOne.length) {
    new DataTable('#dataTableOne', {
      perPageSelect: [5, 10, 15, ['All', -1]],
      columns: [
        {
          select: 2
          // sortSequence: ['desc', 'asc']
        },
        {
          select: 3
          // sortSequence: ['desc']
        },
        {
          select: 4,
          cellClass: 'green',
          headerClass: 'red'
        }
      ],
      tableRender: (_data, table, type) => {
        if (type === 'print') {
          return table
        }
        const tHead = table.childNodes && table.childNodes[0]

        if (tHead && tHead.childNodes && tHead.childNodes[0] && tHead.childNodes[0].childNodes) {
          const filterHeaders = {
            nodeName: 'TR',
            childNodes: tHead.childNodes[0].childNodes.map((_th, index) => ({
              nodeName: 'TH',
              childNodes: [
                {
                  nodeName: 'INPUT',
                  attributes: {
                    class: 'datatable-input',
                    type: 'search',
                    'data-columns': `[${index}]`
                  }
                }
              ]
            }))
          }
          tHead.childNodes.push(filterHeaders)
        }
        return table
      }
    })
  }
})
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="data-table-common data-table-one max-w-full overflow-x-auto">
      <table class="table w-full table-auto" id="dataTableOne">
        <thead>
          <tr>
            <template v-for="(column, index) in columns" :key="index">
              <th v-if="!column.type">
                <div class="flex items-center gap-1.5">
                  <p>{{ column.title }}</p>
                  <div class="inline-flex flex-col space-y-[2px]">
                    <span class="inline-block">
                      <svg
                        class="fill-current"
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 0L0 5H10L5 0Z" fill="" />
                      </svg>
                    </span>
                    <span class="inline-block">
                      <svg
                        class="fill-current"
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill="" />
                      </svg>
                    </span>
                  </div>
                </div>
              </th>
              <th v-if="column.type" data-type="date" data-format="YYYY/DD/MM">
                <div class="flex items-center gap-1.5">
                  <p>{{ column.title }}</p>
                  <div class="inline-flex flex-col space-y-[2px]">
                    <span class="inline-block">
                      <svg
                        class="fill-current"
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 0L0 5H10L5 0Z" fill="" />
                      </svg>
                    </span>
                    <span class="inline-block">
                      <svg
                        class="fill-current"
                        width="10"
                        height="5"
                        viewBox="0 0 10 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z" fill="" />
                      </svg>
                    </span>
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </thead>

        <tbody>
          <template v-for="(dataItem, dataIndex) in dataList" :key="dataIndex">
            <tr>
              <td>{{ dataItem.name }}</td>
              <td>{{ dataItem.position }}</td>
              <td>{{ dataItem.birthDate }}</td>
              <td>{{ dataItem.email }}</td>
              <td>{{ dataItem.address }}</td>
              <td>{{ dataItem.status }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
