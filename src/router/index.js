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
//路由拦截
// router.beforeEach((to, from, next) => {

//     //验证浏览器本地存储是否有token（或从vuex、Cookie、localStorage中获取，依据自己的存储），用于判断是否登录
//     if (!window.localStorage.getItem('_token_')) { //没有token，表示未登录，则重定向到login
//         next({
//             //这里是你登录页面的路由名称，或直接使用 path:'/login'
//             name: 'login',
//         })
//     } else {
//         next()
//     }
// })

export default router