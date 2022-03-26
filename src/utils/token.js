/**
 * 获取token
 * @returns
 */
export function getToken() {
  return localStorage.getItem("app_cookie_data");
}

/**
 *
 *设置token
 * @export
 * @param {*} token
 * @return {*}
 */
export function setToken(token) {
  return localStorage.setItem("app_cookie_data", token);
}

/**
 *
 *移除token
 * @export
 * @return {*}
 */
export function removeToken() {
  return localStorage.removeItem("app_cookie_data");
}