import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './modules/routes'
import VueApexCharts from 'vue3-apexcharts'

import './index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(VueApexCharts)
app.mount('#app')
