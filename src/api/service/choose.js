// 左侧选择栏
import api from "../../common/interface";

/**
 * 获取单选列表,根据分类
 * @param {*} category
 * @returns
 */
export const getChooseFindAll = (data) => api.post(`/choose/findAll`, data);
// export const getChooseFindlist = (category) => api.get(`/choose/findlist?category=${category}`, {})
