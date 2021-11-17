import {
    createApp
} from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import api from './api/index'

// 引入常量
import Constants from './utils/Constants'

import '../src/assets/style/reset.scss'
import '../src/assets/style/common.css'

import router from './router/index'

// 创建app实例，vue3的写法
const app = createApp(App)

// 配置全局属性
app.config.globalProperties.$api = api
app.config.globalProperties.$Constants = Constants

app.use(ElementPlus)

app.use(router)

app.mount('#app')