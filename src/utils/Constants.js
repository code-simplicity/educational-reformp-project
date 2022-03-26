const status = {
  // 成功
  SUCCESS: 20000,
  // 失败
  FAILED: 40000,
  // api调用过于频繁
  API_BUSY: 40001,
}

const tokenKey = "app_cookie_data"

export default {
  status,
  tokenKey
}