/**
 * 获取userInfo
 * @returns
 */
export function findUserInfo() {
  return JSON.parse(localStorage.getItem("user_info"));
}

/**
 *
 *设置userInfo
 * @export
 * @param {*} user_info
 * @return {*}
 */
export function setUserInfo(user_info) {
  return localStorage.setItem("user_info", JSON.stringify(user_info));
}

/**
 *
 *移除userInfo
 * @export
 * @return {*}
 */
export function removeUserInfo() {
  return localStorage.removeItem("user_info");
}