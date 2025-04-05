import { createRouter, createWebHashHistory } from 'vue-router';
import { routes } from './router';
import store from '../store'; // 导入 Vuex store

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes,
});

// 路由守卫 - 设置页面标题等
router.beforeEach(async (to, from, next) => {
	// 设置页面标题
	document.title = to.meta?.title || '水运工程仿真实验系统';

	// 检查用户会话状态
	const isAuthenticated = store.getters['user/isLoggedIn'];

	// 如果路由需要认证
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
	if (requiresAuth && !isAuthenticated) {
		// 用户未登录且需要认证，重定向到登录页
		next('/login');
	} else {
		// 用户已登录或页面不需要认证
		next();
	}
});

export default router;
