import api from "../../common/interface";

/**
 * 获取文本介绍
 * @param {*} id
 * @returns
 */
export const getContentSearch = (id) => api.get(`/content/search?id=${id}`, {});

/**
 * 根据选择表id查询对应内容
 * @param {*} data
 * @returns
 */
export const getContentSearchChooseId = (data) =>
  api.post(`/content/search/choose_id`, data);

/**
 * 查询所有数据
 * @param {*} data
 * @returns
 */
export const contentFindAll = (data) => api.post("/content/findAll", data);
