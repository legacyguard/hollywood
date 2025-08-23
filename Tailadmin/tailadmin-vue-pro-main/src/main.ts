import './assets/css/style.css'
import './assets/css/satoshi.css'
import './assets/css/simple-datatables.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'
import 'swiper/swiper-bundle.css'
import 'nouislider/dist/nouislider.css'
import 'dropzone/dist/dropzone.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
