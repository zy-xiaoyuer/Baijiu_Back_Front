import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import axios from 'axios';
import apiServe from '@/api'
const app = createApp(App)
app.use(store).use(router).use(ElementPlus).mount('#app')
app.config.globalProperties.$http = apiServe
app.config.globalProperties.$axios = axios


