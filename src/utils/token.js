/**
 * 获取token
 * @returns
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 *
 *设置token
 * @export
 * @param {*} token
 * @return {*}
 */
export function setToken(token) {
  return localStorage.setItem("token", token);
}

/**
 *
 *移除token
 * @export
 * @return {*}
 */
export function removeToken() {
  return localStorage.removeItem("token");
}
