/**
 * 获取token
 * @returns
 */
export const getToken = () => {
  return localStorage.getItem("app_cookie_data");
}

/**
 *
 *设置token
 * @export
 * @param {*} token
 * @return {*}
 */
export const setToken = async (token) => {
  return await localStorage.setItem("app_cookie_data", token);
}

/**
 *
 *移除token
 * @export
 * @return {*}
 */
export const removeToken = async () => {
  return await localStorage.removeItem("app_cookie_data");
}