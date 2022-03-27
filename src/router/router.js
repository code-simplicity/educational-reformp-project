import Layout from "@/views/layout/index";
import UserLayout from "@/views/user/index"

// 静态路由
export const constantRouter = [{
  path: "/login",
  name: "login",
  meta: {
    title: "登录",
  },
  component: () => import("@/views/login"),
}, ];

/**
 * 通配符路由匹配-404
 */
export const pageError = {
  path: '/:catchAll(.*)',
  name: '404',
  meta: {
    title: '404-您访问的页面不存在'
  },
  component: () => import("../views/error")
}

// 其他路由
export const asyncRouter = [{
    path: "/",
    redirect: {
      name: "home",
    },
    meta: {
      title: "首页",
      keepAlive: true,
    },
    component: Layout,
    children: [{
        path: "home",
        name: "home",
        meta: {
          title: "首页",
          keepAlive: true,
        },
        component: () => import("../views/home"),
      },
      {
        path: "minato-route",
        name: "minato-route",
        meta: {
          title: "港区漫游",
          keepAlive: true,
        },
        component: () => import("../views/minato-route"),
      },
      {
        path: "project-route",
        name: "project-route",
        meta: {
          title: "工况选配",
          keepAlive: true,
        },
        component: () => import("../views/project-route"),
      },
      {
        path: "appearance-route",
        name: "appearance-route",
        meta: {
          title: "现象观察",
          keepAlive: true,
        },
        component: () => import("../views/appearance-route"),
      },
      {
        path: "measure-point-route",
        name: "measure-point-route",
        meta: {
          title: "测点数据",
          keepAlive: true,
        },
        component: () => import("../views/measure-point-route"),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    redirect: {
      name: "user-info",
    },
    meta: {
      title: "用户中心",
      keepAlive: true,
    },
    component: UserLayout,
    children: [{
        path: "user-info",
        name: "user-info",
        meta: {
          title: "用户中心",
          keepAlive: true,
        },
        component: () =>
          import("@/views/user/user-info/index.vue")
      }, {
        path: "user-update",
        name: "user-update",
        meta: {
          title: "信息修改",
          keepAlive: true,
        },
        component: () =>
          import("@/views/user/user-update/index.vue")
      }, {
        path: "user-reset-email",
        name: "user-reset-email",
        meta: {
          title: "重置邮箱",
          keepAlive: true,
        },
        component: () =>
          import("@/views/user/user-reset-email/index.vue")
      },
      {
        path: "user-reset-password",
        name: "user-reset-password",
        meta: {
          title: "重置密码",
          keepAlive: true,
        },
        component: () =>
          import("@/views/user/user-reset-password/index.vue")
      }, {
        path: "register",
        name: "register",
        meta: {
          title: "用户注册",
          keepAlive: true,
        },
        component: () =>
          import("@/views/user/user-register/index.vue")
      },
    ]
  }
];

// 暴露路由
export const routes = [...constantRouter, ...asyncRouter, pageError];