import AppLayout from '../components/layouts/index.vue';

// 独立路由 - 不使用主布局
export const standaloneRoutes = [
	{
		path: '/login',
		name: 'login',
		meta: {
			title: '登录',
		},
		component: () => import('../views/login/index.vue'),
	},
	{
		path: '/register',
		name: 'register',
		meta: {
			title: '用户注册',
			keepAlive: true,
		},
		component: () => import('../views/user/user-register/index.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: '404',
		meta: {
			title: '404-您访问的页面不存在',
		},
		component: () => import('../views/error/index.vue'),
	},
];

// 主应用路由 - 使用布局
export const mainRoutes = [
	{
		path: '/',
		component: AppLayout,
		children: [
			{
				path: '',
				redirect: { name: 'home' },
			},
			{
				path: 'home',
				name: 'home',
				meta: {
					title: '首页',
					keepAlive: true,
				},
				component: () => import('../views/home/index.vue'),
			},
			{
				path: 'minato-route',
				name: 'minato-route',
				meta: {
					title: '工程场景',
					keepAlive: true,
				},
				component: () => import('../views/minato-route/index.vue'),
			},
			{
				path: 'project-route',
				name: 'project-route',
				meta: {
					title: '工况选配',
					keepAlive: true,
				},
				component: () => import('../views/project-route/index.vue'),
			},
			{
				path: 'appearance-route',
				name: 'appearance-route',
				meta: {
					title: '现象观察',
					keepAlive: true,
				},
				component: () => import('../views/appearance-route/index.vue'),
			},
			{
				path: 'measure-point-route',
				name: 'measure-point-route',
				meta: {
					title: '测点数据',
					keepAlive: true,
				},
				component: () => import('../views/measure-point-route/index.vue'),
			},
			{
				path: 'user',
				component: () => import('../views/user/index.vue'),
				redirect: { name: 'user-info' },
				children: [
					{
						path: 'user-info',
						name: 'user-info',
						meta: {
							title: '用户中心',
							keepAlive: true,
						},
						component: () => import('../views/user/user-info/index.vue'),
					},
					{
						path: 'user-update',
						name: 'user-update',
						meta: {
							title: '信息修改',
							keepAlive: true,
						},
						component: () => import('../views/user/user-update/index.vue'),
					},
					{
						path: 'user-reset-email',
						name: 'user-reset-email',
						meta: {
							title: '重置邮箱',
							keepAlive: true,
						},
						component: () => import('../views/user/user-reset-email/index.vue'),
					},
					{
						path: 'user-reset-password',
						name: 'user-reset-password',
						meta: {
							title: '重置密码',
							keepAlive: true,
						},
						component: () =>
							import('../views/user/user-reset-password/index.vue'),
					},
				],
			},
		],
	},
];

// 暴露路由
export const routes = [...standaloneRoutes, ...mainRoutes];
