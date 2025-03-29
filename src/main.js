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
// 动画库
import 'animate.css';
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')