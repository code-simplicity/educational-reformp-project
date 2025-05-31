import { getUserInfo, login, logout, updateUserInfo } from "../../api/service/user";
import { findUserInfo, setUserInfo, removeUserInfo } from "../../utils/userInfo";

import { getToken, setToken, removeToken } from "../../utils/token";

import Constants from "../../utils/Constants";

import utils from "../../utils/utils";

import { ElMessage } from "element-plus";
// state
const state = () => ({
	// 用户信息
	userInfo: findUserInfo(),
	// token拿去是通过前端从cookie中读取
	tokenData: getToken(),
});

// getter
const getters = {
	// 获取用户信息
	userInfo(state) {
		return state.userInfo;
	},
	tokenData(state) {
		return state.tokenData;
	},
	// 添加判断用户是否登录的getter
	isLoggedIn(state) {
		return !!state.tokenData;
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
	tokenData(state, tokenKey) {
		state.tokenData = tokenKey;
		setToken(tokenKey);
	},
	// 清除用户状态 (新增)
	clearUserState(state) {
		state.userInfo = {};
		state.tokenData = "";
		removeUserInfo();
		removeToken();
		utils.clearAllCookie();
	},
};

// actions
const actions = {
	// 登录
	async login({ commit }, params) {
		try {
			const result = await login(params);
			if (result.code === Constants.status.SUCCESS) {
				const { tokenKey, ...data } = result.data;
				commit("tokenData", tokenKey);
				commit("infoChange", data);
				ElMessage.success({
					message: result.msg,
				});
			} else {
				ElMessage.error({
					message: result.msg,
				});
			}
			return result;
		} catch (error) {
			ElMessage.error({
				message: "登录请求失败",
			});
			return Promise.reject(error);
		}
	},

	async getUserInfoById({ commit }, id) {
		console.log("1", 1);
		try {
			const result = await getUserInfo(id);
			commit("infoChange", result.data);
			return result;
		} catch (error) {
			return Promise.reject(error);
		}
	},

	/**
	 * 退出登录 (重构此方法)
	 */
	async loginOut({ commit }) {
		try {
			// 关闭所有可能的 Element Plus 消息
			ElMessage.closeAll();

			// 调用登出API
			const res = await logout();

			if (res.code === Constants.status.SUCCESS) {
				ElMessage.success(res.msg);
			}

			// 无论API调用成功与否，都清除本地用户状态
			commit("clearUserState");

			return Promise.resolve();
		} catch (error) {
			console.error("登出过程发生错误:", error);

			// 即使发生错误，也清除用户状态
			commit("clearUserState");

			return Promise.resolve(); // 我们仍然解析promise，因为用户状态已被清除
		}
	},

	/**
	 * 修改用户信息
	 * @param {*} params
	 */
	async updateUser({ dispatch }, params) {
		try {
			const result = await updateUserInfo(params);
			if (result.code === Constants.status.SUCCESS) {
				await dispatch("getUserInfoById", params.id);
				ElMessage.success(result.msg);
			} else {
				ElMessage.error(result.msg);
			}
			return result;
		} catch (error) {
			ElMessage.error("更新用户信息失败");
			return Promise.reject(error);
		}
	},

	/**
	 * 检查并恢复用户会话 (新增)
	 */
	checkUserSession({ state, commit }) {
		// 如果有token但没有用户信息，尝试获取用户信息
		if (state.tokenData && !state.userInfo) {
			// 可以在这里添加逻辑来验证token并获取用户信息
			// 如果token无效，则清除状态
			// 示例: this.dispatch('getUserInfoById', tokenUserId)
		} else if (!state.tokenData) {
			// 如果没有token，确保用户状态被清除
			commit("clearUserState");
		}
		return !!state.tokenData; // 返回登录状态
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
