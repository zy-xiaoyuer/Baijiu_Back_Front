import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
 import LoginView from '@/views/LoginView.vue'
import UserList from '@/views/UserHomeView.vue'

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
          component: UserList// 当访问 /home/userinfo 时，显示 UserListView  
        }  
        // 其他子路由  
      ]  
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
 


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
