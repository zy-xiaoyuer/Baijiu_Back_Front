import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
 import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserHomeView from '@/views/UserHomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path:'/login',
    name:'login',
    component:LoginView
  },
   {
    path:'/register',
    name:'register',
    component:RegisterView
  },
 {
    path:'/userinfo',
    name:'UserInfo',
    component:UserHomeView
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
