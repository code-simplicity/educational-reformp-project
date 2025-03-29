import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
})

// 路由守卫 - 设置页面标题等
router.beforeEach((to, from, next) => {
	// 设置页面标题
	document.title = to.meta?.title || '水运工程仿真实验系统'
	
	// 可以在这里添加身份验证逻辑
	// const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	// const isAuthenticated = localStorage.getItem('token')
	
	// if (requiresAuth && !isAuthenticated) {
	//   next('/login')
	// } else {
	//   next()
	// }
	
	next()
})

export default router
