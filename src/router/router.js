import Layout from '@/views/layout/index'

// 引入路由
const Login = () => import('../views/login')
const Home = () => import('../views/home')
const MinatoRoute = () => import('../views/minato-route')
const ProjectRoute = () => import('../views/project-route')
const AppearanceRoute = () => import('../views/appearance-route')
// 登录路由
export const loginRouter = [{
    path: '/login',
    name: 'login',
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
            path: 'minato-route',
            name: 'minato-route',
            meta: {
                title: '港区漫游',
                keepAlive: true
            },
            component: MinatoRoute
        },
        {
            path: 'project-route',
            name: 'project-route',
            meta: {
                title: '工况选配',
                keepAlive: true
            },
            component: ProjectRoute
        },
        {
            path: 'appearance-route',
            name: 'appearance-route',
            meta: {
                title: '现象观察',
                keepAlive: true
            },
            component: AppearanceRoute
        }

    ]
}]

// 暴露路由
export const routes = [...loginRouter, ...mainRouter]