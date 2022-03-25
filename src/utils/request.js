import axios from "axios"
import qs from "qs";

// 引入接口地址
import config from "../api/config";

import {
    ElMessage
} from "element-plus";

const {
    api_base_url
} = config;

// 创建axios实例
const instance = axios.create({
    time: 60 * 10000,
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

instance.interceptors.request.use(config => {
    config.withCredentials = true;
    return config;
}, error => {
    console.log("error", error)
    return new Promise.reject(error)
})

instance.interceptors.response.use(response => {
    const {
        data,
        status
    } = response
    if (status === 200) {
        return Promise.resolve(data)
    } else {
        // 返回错误信息
        showError(data)
        return Promise.reject(data)
    }
}, error => {
    console.log(error); // for debug
    const badMessage = error.message || error;
    const code = parseInt(
        badMessage
        .toString()
        .replace("Error: Request failed with status code ", "")
    );
    showError({
        code,
        message: badMessage
    });
    return Promise.reject(error)
})

function showError(error) {
    if (error.code === 40003) {
        // 登陆失败
    } else {
        ElMessage.error(error.msg)
    }
}
export default instance;