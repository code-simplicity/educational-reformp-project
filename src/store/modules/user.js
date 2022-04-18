import {
  getUserInfo,
  login,
  logout,
  updateUserInfo
} from "../../api/service/user";
import {
  findUserInfo,
  setUserInfo,
  removeUserInfo
} from "../../utils/userInfo";

import {
  getToken,
  setToken,
  removeToken
} from "../../utils/token"

import Constants from "../../utils/Constants";

import utils from "../../utils/utils"

import {
  ElMessage
} from "element-plus";
// state
const state = () => ({
  // 用户信息
  userInfo: findUserInfo(),
  // token拿去是通过前端从cookie中读取
  tokenData: getToken()
});

// getter
const getters = {
  // 获取用户信息
  userInfo(state) {
    return state.userInfo;
  },
  tokenData(state) {
    return state.tokenData
  }
};

// mutations
const mutations = {
  // 用户信息
  infoChange(state, userInfo) {
    state.userInfo = userInfo;
    setUserInfo(userInfo);
  },
  // token
  tokenData(state, tokenKey) {
    state.tokenData = tokenKey
    setToken(tokenKey)
  }
};

// actions
const actions = {
  // 登录
  async login({
    commit,
  }, params) {
    const result = await login(params)
    if (result.code === Constants.status.SUCCESS) {
      const {
        tokenKey,
        ...data
      } = result.data
      commit("tokenData", tokenKey)
      commit("infoChange", data)
      ElMessage.success({
        message: result.msg
      });
      return result
    } else {
      ElMessage.error({
        message: result.msg
      })
    }
  },

  async getUserInfoById({
    commit
  }, id) {
    const result = await getUserInfo(id)
    commit("infoChange", result.data);
  },

  /**
   * 退出登录
   */
  loginOut() {
    logout()
      .then((res) => {
        if (res.code === Constants.status.SUCCESS) {
          removeToken()
          removeUserInfo();
          utils.clearAllCookie()
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      })
      .finally(() => {
        removeUserInfo();
        removeToken()
        utils.clearAllCookie()
      });
  },

  /**
   * 修改用户信息
   * @param {*} params 
   */
  async updateUser({
    dispatch
  }, params) {
    const result = await updateUserInfo(params)
    if (result.code === Constants.status.SUCCESS) {
      dispatch("getUserInfoById", params.id)
      ElMessage.success(result.msg)
    } else {
      ElMessage.error(result.msg)
    }
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