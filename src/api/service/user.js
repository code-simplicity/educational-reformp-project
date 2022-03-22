import api from "../../common/interface";

/**
 * 登录
 * id
 * password
 * @param {*} params
 * @returns
 */
export const login = (params) => api.post(`/user/login`, params);

/**
 * 退出登录
 * @returns
 */
export const logout = () => api.get(`/user/logout`, {});

/**
 * 添加得分
 * @param {*} params
 * @returns
 */
export const getUserAddScore = (params) => api.post(`/user/add/score`, params);

/**
 * 获取用户信息
 * @param {*} id
 * @returns
 */
export const getUserInfo = (id) => api.get(`/user/info?id=${id}`, {});