import api from "../../common/interface"


/**
 * 登录
 * id
 * password
 * @param {*} params 
 * @returns 
 */
export const login = (params) => api.post(`/user/login`, params)

/**
 * 退出登录
 * @returns 
 */
export const logout = () => api.get(`/user/logout`, {})