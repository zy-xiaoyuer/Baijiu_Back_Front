import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from  'element-plus/es/locale/lang/zh-cn'
import '../public/css/global.css'
//import *as ELIcons  from '@element-plus/icons-vue'

import axios from 'axios';
//import apiServe from '@/api'
const app = createApp(App)
//全局导入plus图标
//for (let iconName in ELIcons) { app.component(iconName, ELIcons[iconName]) }
app.use(store).use(router).use(ElementPlus,{locale:zhCn}).mount('#app')
//app.config.globalProperties.$http = apiServe
app.config.globalProperties.$axios = axios


