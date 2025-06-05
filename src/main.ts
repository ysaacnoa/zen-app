import { createApp } from 'vue'
import App from './App.vue'
import { router } from './modules/routes'

import './index.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
