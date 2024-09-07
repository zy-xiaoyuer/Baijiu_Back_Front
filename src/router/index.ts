import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
 import LoginView from '@/views/LoginView.vue'
import UserList from '@/views/UserHomeView.vue'
import Poemview from '@/views/DynastyWinePoemView.vue'
import VesselTotalView from '@/views/WineVesselTotalView.vue'
import VesselView from '@/views/WineVesselView.vue'
import PictureView from '@/views/WinePictureView.vue'
import LocationWinePoemView from '@/views/LocationWinePoemView.vue'
import WelcomeView from '@/views/WelcomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
      path: '/',
      redirect: '/login', // 设置默认路由重定向到登录页
     
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView,
    children: [  
        {  
          path: '/userinfo',  
          component: UserList
        },
         {  
          path: '/winepoem',  
          component: Poemview
        },
        {  
          path: '/winevesseltotal',  
          component:  VesselTotalView
        },
         {  
          path: '/winevessel',  
          component:  VesselView
        },
        {  
          path: '/winepicture',  
          component:PictureView 
        },
        {  
          path: '/winelocation',  
          component:LocationWinePoemView
        },
        {  
          path:'',  //默认子路由
          component:WelcomeView
        },
      ]  
  },
  
  {
    path:'/login',
    name:'login',
    component:LoginView
  },
 


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
