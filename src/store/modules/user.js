import {
  getUserInfo,
  login,
  logout
} from "@/api/service/user";
import {
  findUserInfo,
  setUserInfo,
  removeUserInfo
} from "@/utils/userInfo";
import {
  getToken,
  setToken,
  removeToken
} from "@/utils/token";
import {
  ElMessage
} from "element-plus";
// state
const state = () => ({
  // 用户信息
  userInfo: findUserInfo(),
  // token
  token: getToken(),
});

// getter
const getters = {
  // 获取用户信息
  userInfo(state) {
    return state.userInfo;
  },

  // 获取token
  token(state) {
    return state.token;
  },
};

// mutations
const mutations = {
  // 用户信息
  infoChange(state, userInfo) {
    state.userInfo = userInfo;
    setUserInfo(userInfo);
  },
  // token
  Token(state, token) {
    state.token = token;
    setToken(token);
  },
};

// actions
const actions = {
  // 登录
  login({
    commit,
    dispatch
  }, params) {
    return new Promise((resolve) => {
      login(params).then((res) => {
        if (res.status === this.$Constants.state.SUCCESS) {
          ElMessage.success({
            message: res.msg
          });
          commit("Token", res.data.token);
          dispatch("getUserInfo", res.data.id).then(() => {
            resolve(res.data.id);
          });
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
        if (res.status === this.$Constants.state.SUCCESS) {
          commit("infoChange", res.data);
          resolve(res.data);
        }
      });
    });
  },

  loginOut() {
    logout()
      .then((res) => {
        if (res.status === this.$Constants.state.SUCCESS) {
          ElMessage.success(res.msg);
        } else {
          ElMessage.error(res.msg);
        }
      })
      .finally(() => {
        removeUserInfo();
        removeToken();
      });
  },
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