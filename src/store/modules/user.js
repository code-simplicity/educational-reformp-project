import {
  getUserInfo,
  login,
  logout,
  checkToken
} from "@/api/service/user";
import {
  findUserInfo,
  setUserInfo,
  removeUserInfo
} from "@/utils/userInfo";

import Constants from "../../utils/Constants";

import {
  ElMessage
} from "element-plus";
// state
const state = () => ({
  // 用户信息
  userInfo: findUserInfo(),
});

// getter
const getters = {
  // 获取用户信息
  userInfo(state) {
    return state.userInfo;
  },
};

// mutations
const mutations = {
  // 用户信息
  infoChange(state, userInfo) {
    state.userInfo = userInfo;
    setUserInfo(userInfo);
  },
};

// actions
const actions = {
  // 登录
  login({
    dispatch
  }, params) {
    return new Promise((resolve) => {
      login(params).then((res) => {
        if (res.status === Constants.status.SUCCESS) {
          ElMessage.success({
            message: res.msg
          });
          dispatch("checkUserLoginStatus")
          resolve(res)
        } else {
          ElMessage.error({
            message: res.msg
          })
        }
      });
    });
  },
  // 获取用户信息
  getUserInfo({
    commit
  }, params) {
    return new Promise((resolve) => {
      getUserInfo(params).then((res) => {
        if (res.status === Constants.status.SUCCESS) {
          commit("infoChange", res.data);
          resolve(res.data);
        }
      });
    });
  },

  loginOut() {
    logout()
      .then((res) => {
        if (res.status === Constants.status.SUCCESS) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      })
      .finally(() => {
        removeUserInfo();
      });
  },

  // 检查用户是否登录
  async checkUserLoginStatus({
    commit,
    dispatch
  }) {
    await checkToken().then((res) => {
      if (res.status === Constants.status.SUCCESS) {
        dispatch("getUserInfo", res.data.id).then((result) => {
          commit("infoChange", result)
        })
        if (res.status === Constants.status.SUCCESS) {
          ElMessage.success(res.msg)
        } else {
          ElMessage.error(res.msg)
        }
      }
    })
  }
};

// 统一暴露
export default {
  // 开启命名空间
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};