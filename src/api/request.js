import axios from 'axios'
import {
    ElMessage
} from 'element-plus'
// import { diffTokenTime } from '../utils/auth'
//import store from '../store'


// 新建axios的实例对象
const service = axios.create({
    // 设置最大的连接时长为5秒
    timeout: 5000
})

//对于前端请求的的拦截器
//这部分是对于token的验证，如不需要的小伙伴可以注销掉
// service.interceptors.request.use(
//   (config) => {
//     // 在这里localStorage可以存储浏览器的数据，相等于cookie的使用
//     if (localStorage.getItem('token')) {
//       //从vuex的state静态库中取出token的建立时间再于现在的时间做比较如何超出最大的时长就注销
//       if (diffTokenTime()) {
//         //执行vuex下的method的注销方法
//         //app是开启了命名空间的封装类
//         store.dispatch('app/logout')
//         return Promise.reject(new Error('token 失效了'))
//       }
//     }
//     //在headers里面添加token，相当于权限附加
//     config.headers.Authorization = localStorage.getItem('token')
//     return config
//   },
//   (error) => {
//     return Promise.reject(new Error(error))
//   }
// )


// 对于后端响应的拦截器
service.interceptors.response.use(
    (response) => {
        //这里是对响应的简化 data = response.data
        const {
            data,
            meta
        } = response.data
        if (meta.status === 200 || meta.status === 201) {
            //回传的数据
            return data
        } else {
            ElMessage.error(meta.msg)
            return Promise.reject(new Error(meta.msg))
        }
    },
    (error) => {
        console.log(error.response)
        error.response && ElMessage.error(error.response.data)
        return Promise.reject(new Error(error.response.data))
    }
)
export default service