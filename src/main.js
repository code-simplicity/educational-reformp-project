import {
    createApp
} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

import './assets/icon/iconfont.css'
import './assets/style/reset.scss'
import './assets/style/common.css'
import router from './router/index'
import store from './store/index'
// 注册全局组件
import MianLeft from './components/main-left/index.vue'
import MainCenter from './components/main-center/index.vue'
import MianRight from './components/main-right/index.vue'
// 动画库
import 'animate.css';
const app = createApp(App)
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