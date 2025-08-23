import type { onMounted } from 'vue';
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DataTable } from 'simple-datatables'

const columns = ref([
  { title: 'Name', key: 'name' },
  { title: 'Position', key: 'position' },
  { title: 'Office', key: 'office' },
  { title: 'Age', key: 'age' },
  { title: 'Start Date', key: 'startDate', type: 'date', format: 'YYYY/DD/MM' },
  { title: 'Salary', key: 'salary' }
])

const dataList = ref([
  {
    name: 'Brielle Kuphal',
    position: 'Senior Javascript Developer',
    office: 'Edinburgh',
    age: '25',
    startDate: '2012/03/29',
    salary: '$433,060'
  },
  {
    name: 'Barney Murray',
    position: 'Senior Backend Developer',
    office: 'amsterdam',
    age: '29',
    startDate: '2010/05/01',
    salary: '$424,785'
  },
  {
    name: 'Ressie Ruecker',
    position: 'Senior Frontend Developer',
    office: 'Jakarta',
    age: '27',
    startDate: '2013/07/01',
    salary: '$785,210'
  },
  {
    name: 'Teresa Mertz',
    position: 'Senior Designer',
    office: 'New Caledonia',
    age: '25',
    startDate: '2014/05/30',
    salary: '$532,126'
  },
  {
    name: 'Chelsey Hackett',
    position: 'Product Manager',
    office: 'NewYork',
    age: '26',
    startDate: '2011/09/30',
    salary: '$421,541'
  },
  {
    name: 'Tatyana Metz',
    position: 'Senior Product Manager',
    office: 'NewYork',
    age: '28',
    startDate: '2009/09/30',
    salary: '$852,541'
  },
  {
    name: 'Oleta Harvey',
    position: 'Junior Product Manager',
    office: 'California',
    age: '25',
    startDate: '2015/10/30',
    salary: '$654,444'
  },
  {
    name: 'Bette Haag',
    position: 'Junior Product Manager',
    office: 'Carolina',
    age: '29',
    startDate: '2017/12/31',
    salary: '$541,111'
  },
  {
    name: 'Meda Ebert',
    position: 'Junior Web Developer',
    office: 'Amsterdam',
    age: '27',
    startDate: '2015/10/31',
    salary: '$651,456'
  },
  {
    name: 'Elissa Stroman',
    position: 'Junior React Developer',
    office: 'Kuala Lumpur',
    age: '29',
    startDate: '2008/05/31',
    salary: '$566,123'
  },
  {
    name: 'Sid Swaniawski',
    position: 'Senior React Developer',
    office: 'Las Vegas',
    age: '29',
    startDate: '2009/09/01',
    salary: '$852,456'
  },
  {
    name: 'Madonna Hahn',
    position: 'Senior Vue Developer',
    office: 'New York',
    age: '27',
    startDate: '2006/10/01',
    salary: '$456,147'
  },
  {
    name: 'Waylon Kihn',
    position: 'Senior HTML Developer',
    office: 'Amsterdam',
    age: '23',
    startDate: '2017/11/01',
    salary: '$321,254'
  },
  {
    name: 'Jaunita Lindgren',
    position: 'Senior Backend Developer',
    office: 'Jakarta',
    age: '25',
    startDate: '2018/12/01',
    salary: '$321,254'
  },
  {
    name: 'Lenora MacGyver',
    position: 'Junior HTML Developer',
    office: 'Carolina',
    age: '27',
    startDate: '2015/09/31',
    salary: '$852,254'
  },
  {
    name: 'Edyth McCullough',
    position: 'Senior Javascript Developer',
    office: 'Edinburgh',
    age: '25',
    startDate: '2012/03/29',
    salary: '$433,060'
  },
  {
    name: 'Ibrahim Stroman',
    position: 'Senior Backend Developer',
    office: 'amsterdam',
    age: '29',
    startDate: '2010/05/01',
    salary: '$424,785'
  },
  {
    name: 'Katelynn Reichert',
    position: 'Senior Frontend Developer',
    office: 'Jakarta',
    age: '27',
    startDate: '2013/07/01',
    salary: '$785,210'
  },
  {
    name: 'Logan Kiehn',
    position: 'Senior Designer',
    office: 'New Caledonia',
    age: '25',
    startDate: '2014/05/30',
    salary: '$532,126'
  },
  {
    name: 'Rogers Stanton',
    position: 'Product Manager',
    office: 'NewYork',
    age: '26',
    startDate: '2011/09/30',
    salary: '$421,541'
  },
  {
    name: 'Alanis Torp',
    position: 'Senior Product Manager',
    office: 'NewYork',
    age: '28',
    startDate: '2009/09/30',
    salary: '$852,541'
  },
  {
    name: 'Jarvis Bauch',
    position: 'Junior Product Manager',
    office: 'California',
    age: '25',
    startDate: '2015/10/30',
    salary: '$654,444'
  },
  {
    name: 'Trey Ritchie',
    position: 'Junior Product Manager',
    office: 'Carolina',
    age: '29',
    startDate: '2017/12/31',
    salary: '$541,111'
  },
  {
    name: 'Ronny Dietrich',
    position: 'Junior Web Developer',
    office: 'Amsterdam',
    age: '27',
    startDate: '2015/10/31',
    salary: '$651,456'
  },
  {
    name: 'Isabella Christiansen',
    position: 'Junior React Developer',
    office: 'Kuala Lumpur',
    age: '29',
    startDate: '2008/05/31',
    salary: '$566,123'
  }
])

onMounted(() => {
  const dataTableOne = document.querySelectorAll('#dataTableTwo')

  if (dataTableOne.length) {
    new DataTable('#dataTableTwo', {
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
      ]
    })
  }
})
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
  >
    <div class="data-table-common data-table-two max-w-full overflow-x-auto">
      <table class="table w-full table-auto" id="dataTableTwo">
        <thead>
          <tr>
            <template v-for="(column, index) in columns" :key="index">
              <th v-if="!column.type">
                <div class="flex items-center justify-between gap-1.5">
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
                <div class="flex items-center justify-between gap-1.5">
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
              <td>{{ dataItem.office }}</td>
              <td>{{ dataItem.age }}</td>
              <td>{{ dataItem.startDate }}</td>
              <td>{{ dataItem.salary }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
