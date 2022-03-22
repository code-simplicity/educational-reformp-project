import {
  createRouter,
  createWebHashHistory
} from "vue-router";
import {
  changeTitle
} from "@/utils/title";
import {
  routes
} from "./router.js";
import NProgress from "@/utils/nprogress";
import store from "@/store";
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const whiteList = ["/login"];

// 做登录拦截
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.state.user.token || whiteList.indexOf(to.path) !== -1) {
    // 生成动态的title
    to.meta.title ? changeTitle(to.meta.title) : "";
    next();
  } else {
    // 全部重置到登录页
    next("/login");
    to.meta.title ? changeTitle(to.meta.title) : "";
  }
});

router.afterEach(() => {
  //后置路由,顶部加载进度
  NProgress.done();
});

export default router;