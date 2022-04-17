import {
    createApp
} from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

import utils from './utils/utils'

import "./utils/flexible.js";

import './assets/icon/iconfont.css'

import '../src/assets/style/reset.scss'
import '../src/assets/style/common.css'

import router from './router/index'

import store from './store/index'

// 注册全局组件
import MianLeft from './components/main-left/index.vue'
import MainCenter from './components/main-center/index.vue'
import MianRight from './components/main-right/index.vue'

// 动画库
import 'animate.css';

// 粒子动画
// import Particles from "particles.vue3";

// 创建app实例，vue3的写法
const app = createApp(App)

app.config.globalProperties.$utils = utils

app.use(ElementPlus)

app.use(router)

app.use(store)

// app.use(Particles)

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