// 配置接口地址
let api_base_url = "";
if (process.env.NODE_ENV === "development") {
  api_base_url = "https://www.bugdr.cn";
} else if (process.env.NODE_ENV === "production") {
  api_base_url = "https://www.bugdr.cn";
}

// 暴露接口地址
export default {
  api_base_url,
};