import axios from 'axios';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import {
  ElMessage
} from 'element-plus';

// 声明一个后端的父路径
const server = 'http://localhost:9000/';

// 创建 axios 实例
const http = axios.create({
  baseURL: server,
  timeout: 300 * 1000, // 请求超时时间设置为 300 秒
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
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    ElMessage.error(NETWORK_ERROR);
    return Promise.reject(NETWORK_ERROR);
  },
  (error) => {
    Nprogress.done();
    if (!error.response) {
      ElMessage.error(NETWORK_ERROR);
    } else {
      ElMessage.error(error.response.data.message || '请求出错');
    }
    return Promise.reject(error);
  }
);

// 导出一个通用的 GET 请求函数
export const getData = (url: string, params: object) => {  
  return axios.get(url, { params })  
    .then(response => {  
      // 假设后端直接返回了数据，没有 success 字段  
      if (response.data) {  
        // return {
        //   list: response.data,
        //   total: response.data.total
        // };
        return response.data; // 直接返回数据  
      }  
      throw new Error('No data received');  
    })  
    .catch(error => {  
      console.error('API request failed:', error);  
      ElMessage.error('API request failed: ' + error.message);  
      throw error;  
    });  
};

// 导出一个通用的 POST 请求函数，支持 JSON 和表单数据
export const postData = async (url: string, data: object, headers = {}) => {
  const response = await http.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
  });
  return response.data;
};

// 导出一个通用的 POST 请求函数，用于文件上传
export const uploadFile = async (url: string, data: any) => {
  const response = await http.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
  return response.data;
};

// 导出 http 实例
export default {
  http,
  uploadFile,
  postData,
  getData
};