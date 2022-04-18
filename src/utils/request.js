import axios from "axios"
import qs from "qs";
// 引入接口地址
const baseURL =
    import.meta.env.VITE_BASE_URL;
import {
    ElMessage
} from "element-plus";
import {
    getToken
} from "./token"
import router from "../router/index"

// 创建axios实例
const instance = axios.create({
    time: 60 * 10000,
    baseURL: baseURL,
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

// 请求拦截
instance.interceptors.request.use((config) => {
    // 判断token是否存在，这个token是存在redis中的，存在tokenKey，给请求头加上这个值
    const tokenKey = getToken()
    if (tokenKey !== "" && tokenKey !== undefined && tokenKey !== null) {
        config.headers.common['authorization'] = tokenKey
    }
    return config;
}, error => {
    return Promise.reject(error)
})

instance.interceptors.response.use(response => {
    const {
        data,
        status
    } = response
    if (status === 200 || status === 422) {
        return Promise.resolve(data)
    }
    // 返回401的话，证明是没有登录的，然后路由重定向到登录页
    if (status === 401) {
        router.replace({
            path: "/login"
        })
        ElMessage.error(data.msg)
    }
    return Promise.reject(data)
}, error => {
    console.log("error", error.response)
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