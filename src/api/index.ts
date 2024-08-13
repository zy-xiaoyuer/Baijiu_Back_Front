import http from '@/utils/requestUtil'

 
export default {
  /**
   * 根据用户邮箱、密码查询用户信息
   */
  getUserPassword(data: any) {
    return http.post(
      '/api/getUserPassword',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
  },
 
  /**
   * 保存用户信息
   */
  saveUser(data: any) {
    return http.post(
      '/api/saveUser',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    )
  },
}
