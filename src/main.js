import {
    createApp
} from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import api from './common/interface'

// 配置全局属性
app.config.globalProperties.$api = api
const app = createApp(App)

app.use(ElementPlus)

app.mount('#app')