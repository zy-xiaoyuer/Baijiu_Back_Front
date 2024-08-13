import axios from 'axios';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const http = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 300 * 1000, // 请求超时时间设置为300秒
});

const NETWORK_ERROR = '网络错误，请联系开发人员';

/**
 * 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    Nprogress.start();
    return config;
  },
  (error) => {
    Nprogress.done();
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (response) => {
    Nprogress.done();
    // 只对2xx的状态码进行处理
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    ElMessage.error(NETWORK_ERROR);
    return Promise.reject(NETWORK_ERROR);
  },
  (error) => {
    Nprogress.done();
    if (!error.response) {
      // 网络错误
      ElMessage.error(NETWORK_ERROR);
    } else {
      // 其他错误处理
      ElMessage.error(error.response.data.message || '请求出错');
    }
    return Promise.reject(error);
  }
);

// 导出一个通用的 GET 请求函数
export const getData = (url: string) => {
  return http.get(url).then((response) => {
    return response.data;
  });
};

// 导出 http 实例
export default http;