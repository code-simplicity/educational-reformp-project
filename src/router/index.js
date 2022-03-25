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

// import {
//   checkToken
// } from "../api/service/user"

import store from "@/store";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// const whiteList = ["/login"];

// 做登录拦截
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // 生成动态的title
  to.meta.title ? changeTitle(to.meta.title) : "";
  const userInfo = store.getters["user/userInfo"]
  if (userInfo) {
    next()
  } else {
    if (to.path === "/forget") {
      next("/forget")
    } else {
      next()
    }
    store.dispatch("user/checkUserLoginStatus")
    next()
  }

});

router.afterEach(() => {
  //后置路由,顶部加载进度
  NProgress.done();
});

export default router;