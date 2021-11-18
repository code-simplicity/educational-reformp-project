import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import {
    routes
} from './router.js'


const router = createRouter({
    history: createWebHashHistory(),
    routes
})


// 做登录拦截
// router.beforeEach((to, from, next) => {
//     const loginStatus = window.localStorage.getItem('_login_status_')
//     console.log(`loginStatus`, loginStatus)

// })

export default router