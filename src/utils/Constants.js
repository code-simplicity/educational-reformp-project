// 图片地址
import config from "../api/config";
const {
  api_base_url
} = config;
const baseURL = api_base_url;

const status = {
  // 成功
  SUCCESS: 20000,
  // 失败
  FAILED: 40000,
  // api调用过于频繁
  API_BUSY: 40001
}
export default {
  baseURL,
  status
};