import AppLayout from "../components/layouts/index.vue";

// 独立路由 - 不使用主布局
export const standaloneRoutes = [
	{
		path: "/login",
		name: "login",
		meta: {
			title: "登录",
			keepAlive: true,
		},
		component: () => import("../views/login/index.vue"),
	},
	{
		path: "/register",
		name: "register",
		meta: {
			title: "用户注册",
			keepAlive: true,
		},
		component: () => import("../views/user/user-register/index.vue"),
	},
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		meta: {
			title: "404-您访问的页面不存在",
			keepAlive: true,
		},
		component: () => import("../views/error/index.vue"),
	},
];

// 主应用路由 - 使用布局
export const mainRoutes = [
	{
		path: "/",
		component: AppLayout,
		children: [
			{
				path: "",
				redirect: { name: "home" },
			},
			{
				path: "home",
				name: "home",
				meta: {
					title: "首页",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/home/index.vue"),
			},
			{
				path: "minato-route",
				name: "minato-route",
				meta: {
					title: "工程场景",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/minato-route/index.vue"),
			},
			{
				path: "project-route",
				name: "project-route",
				meta: {
					title: "工况选配",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/project-route/index.vue"),
			},
			{
				path: "appearance-route",
				name: "appearance-route",
				meta: {
					title: "现象观察",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/appearance-route/index.vue"),
			},
			{
				path: "measure-point-route",
				name: "measure-point-route",
				meta: {
					title: "测点数据",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/measure-point-route/index.vue"),
			},
			{
				path: "user",
				name: "user",
				meta: {
					title: "用户信息",
					keepAlive: true,
					requiresAuth: true,
				},
				component: () => import("../views/user/index.vue"),
			},
		],
	},
];

// 暴露路由
export const routes = [...standaloneRoutes, ...mainRoutes];
