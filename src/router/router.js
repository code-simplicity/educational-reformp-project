import Layout from '@/views/layout/index'

// 引入路由
const Login = () => import('../views/login')
const Home = () => import('../views/home')
const MinatoRoute = () => import('../views/minato-route')
// 登录路由
export const loginRouter = [{
    path: '/login',
    name: 'Login',
    meta: {
        title: '登录'
    },
    component: Login
}]

// 其他路由
export const mainRouter = [{
    path: '/',
    redirect: {
        name: 'home'
    },
    meta: {
        title: '首页',
        keepAlive: true
    },
    component: Layout,
    children: [{
            path: 'home',
            name: 'home',
            meta: {
                title: '首页',
                keepAlive: true
            },
            component: Home
        },
        {
            path: 'MinatoRoute',
            name: 'MinatoRoute',
            meta: {
                title: '港区漫游',
                keepAlive: true
            },
            component: MinatoRoute
        }

    ]
}]

// 暴露路由
export const routes = [...loginRouter, ...mainRouter]