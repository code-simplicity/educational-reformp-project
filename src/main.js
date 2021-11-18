import {
    createApp
} from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import api from './api/index'

// 引入常量
import Constants from './utils/Constants'

import utils from './utils/utils'

import "./utils/flexible.js";


import '../src/assets/style/reset.scss'
import '../src/assets/style/common.css'

import router from './router/index'

import store from './store/index'

// 注册全局组件
import MianLeft from './components/main-left/index.vue'
import MainCenter from './components/main-center/index.vue'
import MianRight from './components/main-right/index.vue'


// 创建app实例，vue3的写法
const app = createApp(App)

// 配置全局属性
app.config.globalProperties.$api = api
app.config.globalProperties.$Constants = Constants

app.config.globalProperties.$utils = utils

app.use(ElementPlus)

app.use(router)

app.use(store)

app.component(
    "MianLeft", MianLeft
)
app.component(
    "MainCenter", MainCenter
)
app.component(
    "MianRight", MianRight
)

app.mount('#app')