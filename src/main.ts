import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from  'element-plus/es/locale/lang/zh-cn'
import '../public/css/global.css'

import axios from 'axios';
const app = createApp(App)
app.use(store).use(router).use(ElementPlus,{locale:zhCn}).mount('#app')
app.config.globalProperties.$httpURL = "http://localhost:9000";
app.config.globalProperties.$axios = axios//全局引入



