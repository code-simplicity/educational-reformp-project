import api from "../../common/interface"

/**
 * 获取港口图片
 * @param {*} name 
 * @returns 
 */
export const getImageSearchOne = name => api.get(`/image/search/one?name=${name}`, {})

/**
 * 查询图片
 * @param {*} params 
 * @returns 
 */
export const postImageSearch = params => api.post(`/image/search`, params)