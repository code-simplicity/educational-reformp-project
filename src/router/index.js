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

import {
  getToken
} from "../utils/token"

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 做登录拦截
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  // 生成动态的title
  to.meta.title ? changeTitle(to.meta.title) : "";
  const tokenkey = getToken()
  if (tokenkey) {
    next()
  } else {
    next()
  }
});

router.afterEach(() => {
  //后置路由,顶部加载进度
  NProgress.done();
});

export default router;