import api from "../../common/interface"

/**
 * 获取文本介绍
 * @param {*} id 
 * @returns 
 */
export const getContentSearch = id => api.get(`/content/search?id=${id}`, {})