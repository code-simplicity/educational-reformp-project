<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
import AppLayout from '@/components/layouts/index.vue';

export default {
	name: 'App',
	components: {
		AppLayout,
	},
};
</script>

<style lang="scss">
/* 只保留全局样式和CSS变量 */
:root {
	/* 主题色 */
	--primary-color: #1677ff;
	--primary-hover: #4096ff;
	--secondary-color: #52c41a;
	--danger-color: #ff4d4f;

	/* 文本色 */
	--text-primary: #1f2937;
	--text-secondary: #4b5563;
	--text-light: #9ca3af;

	/* 背景色 */
	--bg-primary: #ffffff;
	--bg-secondary: #f3f4f6;
	--bg-tertiary: #e5e7eb;

	/* 边框色 */
	--border-color: #e5e7eb;

	/* 阴影 */
	--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

	/* 间距 */
	--spacing-xs: 4px;
	--spacing-sm: 8px;
	--spacing-md: 16px;
	--spacing-lg: 24px;
	--spacing-xl: 32px;

	/* 圆角 */
	--radius-sm: 4px;
	--radius-md: 8px;
	--radius-lg: 16px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

#app {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', Arial, sans-serif;
	line-height: 1.5;
	color: var(--text-primary);
	background-color: var(--bg-primary);
}

/* 导入基础样式和变量 */
:root {
	/* 主题色 */
	--primary-color: #1677ff;
	--primary-hover: #4096ff;
	--secondary-color: #52c41a;
	--danger-color: #ff4d4f;

	/* 文本色 */
	--text-primary: #1f2937;
	--text-secondary: #4b5563;
	--text-light: #9ca3af;

	/* 背景色 */
	--bg-primary: #ffffff;
	--bg-secondary: #f3f4f6;
	--bg-tertiary: #e5e7eb;

	/* 边框色 */
	--border-color: #e5e7eb;

	/* 阴影 */
	--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

	/* 间距 */
	--spacing-xs: 0.5rem;
	--spacing-sm: 1rem;
	--spacing-md: 1.5rem;
	--spacing-lg: 2rem;

	/* 圆角 */
	--radius-sm: 0.25rem;
	--radius-md: 0.5rem;
	--radius-lg: 1rem;
}

/* 重置样式 */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', Arial, sans-serif;
	line-height: 1.5;
	color: var(--text-primary);
	background-color: var(--bg-primary);
}

/* 导航栏样式 */
.navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 64px;
	background-color: var(--bg-primary);
	transition: all 0.3s ease;
	z-index: 1000;
}

.navbar-shadow {
	box-shadow: var(--shadow-sm);
}

.navbar-content {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 var(--spacing-md);
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.logo {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
	text-decoration: none;
	color: var(--text-primary);
}

.logo img {
	height: 32px;
}

.logo-text {
	font-size: 1.25rem;
	font-weight: 600;
}

.navbar-menu {
	display: flex;
	gap: var(--spacing-md);
}

.nav-item {
	text-decoration: none;
	color: var(--text-secondary);
	padding: var(--spacing-xs) var(--spacing-sm);
	border-radius: var(--radius-sm);
	transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
	color: var(--primary-color);
	background-color: var(--bg-secondary);
}

/* 用户信息样式 */
.user-info {
	display: flex;
	align-items: center;
	gap: var(--spacing-xs);
	cursor: pointer;
	padding: var(--spacing-xs) var(--spacing-sm);
	border-radius: var(--radius-md);
	transition: all 0.3s ease;
}

.user-info:hover {
	background-color: var(--bg-secondary);
}

.user-avatar {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	object-fit: cover;
}

/* 按钮样式 */
.btn {
	padding: 0.5rem 1rem;
	border-radius: var(--radius-md);
	font-weight: 500;
	text-decoration: none;
	transition: all 0.3s ease;
}

.btn-login {
	color: var(--primary-color);
	background-color: transparent;
}

.btn-login:hover {
	background-color: var(--bg-secondary);
}

.btn-register {
	color: white;
	background-color: var(--primary-color);
}

.btn-register:hover {
	background-color: var(--primary-hover);
}

/* 移动端菜单样式 */
.mobile-menu {
	position: fixed;
	top: 64px;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--bg-primary);
	transform: translateX(100%);
	transition: transform 0.3s ease;
	z-index: 999;
}

.mobile-menu.menu-open {
	transform: translateX(0);
}

.mobile-menu-items {
	padding: var(--spacing-md);
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

.mobile-nav-item {
	padding: var(--spacing-sm);
	text-decoration: none;
	color: var(--text-primary);
	border-radius: var(--radius-md);
	transition: all 0.3s ease;
}

.mobile-nav-item:hover,
.mobile-nav-item.router-link-active {
	background-color: var(--bg-secondary);
	color: var(--primary-color);
}

/* 页脚样式 */
.footer {
	background-color: var(--bg-secondary);
	padding: var(--spacing-lg) 0;
}

.footer-content {
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: var(--spacing-sm);
}

.footer-links {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: var(--spacing-lg);
}

.footer-section {
	display: flex;
	flex-direction: column;
	gap: var(--spacing-sm);
}

.footer-section h4 {
	color: var(--text-primary);
	margin-bottom: var(--spacing-sm);
}

.footer-section a {
	color: var(--text-secondary);
	text-decoration: none;
	transition: color 0.3s ease;
}

.footer-section a:hover {
	color: var(--primary-color);
}

.footer-bottom {
	max-width: 1200px;
	margin: var(--spacing-lg) auto 0;
	padding: var(--spacing-md);
	border-top: 1px solid var(--border-color);
	text-align: center;
	color: var(--text-light);
}

/* 响应式设计 */
@media (max-width: 768px) {
	.navbar-menu {
		display: none;
	}

	.footer-content {
		grid-template-columns: 1fr;
	}

	.logo-text {
		font-size: 1rem;
	}

	.user-name {
		display: none;
	}
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
	:root {
		--text-primary: #f3f4f6;
		--text-secondary: #d1d5db;
		--text-light: #9ca3af;
		--bg-primary: #1f2937;
		--bg-secondary: #374151;
		--bg-tertiary: #4b5563;
		--border-color: #4b5563;
	}
}
</style>
