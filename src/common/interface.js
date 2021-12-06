// 接口封装
import axios from "axios";
import qs from "qs";
// 引入接口地址
import config from "../api/config";

import { ElMessage } from "element-plus";

const { api_base_url } = config;

// 创建axios实例
let instance = axios.create({
  time: 60 * 1000,
  baseURL: api_base_url,
});

// 响应的数据格式
instance.defaults.responseType = "json";

instance.defaults.withCredentials = true;

// 格式化请求数据，返回结果为字符串
instance.defaults.transformRequest = [
  (data) => {
    return qs.stringify(data);
  },
];

instance.defaults.validateStatus = function () {
  return true;
};

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    ElMessage({
      message: "请求超时了.",
      type: "warning",
    });
    return Promise.reject(error);
  }
);

// 添加响应拦截器,做登录响应的拦截
instance.interceptors.response.use(
  (response) => {
    let data = response.data;
    let status = response.status;
    // const loginStatus = window.localStorage.getItem('_login_status_')
    // console.log(`loginStatus`, loginStatus)
    // if (loginStatus == null) {
    //     this.$router.replace({
    //         name: 'login'
    //     })
    //     ElMessage({
    //         message: '未登陆，请登录！',
    //         type: "error"
    //     })
    //     return
    // } else
    if (status === 200) {
      return Promise.resolve(data);
    } else {
      return Promise.reject(response);
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 请求方式
let ajaxMethod = ["get", "post"];

let api = {};
ajaxMethod.forEach((method) => {
  api[method] = function (url, data, config) {
    return new Promise(function (resolve, reject) {
      instance[method](url, data, config)
        .then((response) => {
          // 成功调用promise
          resolve(response);
        })
        .catch((error) => {
          //   调用promise失败
          reject(error);
        });
    });
  };
});
// 暴露
export default api;
