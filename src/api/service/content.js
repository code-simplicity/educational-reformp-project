import api from "../../common/interface"

/**
 * 获取文本介绍
 * @param {*} id 
 * @returns 
 */
export const getContentSearch = id => api.get(`/content/search?id=${id}`, {})

/**
 * 根据选择表id查询对应内容
 * @param {*} choose_id 
 * @returns 
 */
export const getContentSearchChooseId = (choose_id) => api.get(`/content/search/choose_id?choose_id=${choose_id}`, {})