import api from "../../common/interface"

/**
 * 获取港口图片
 * @param {*} name 
 * @returns 
 */
export const getImageSearchOne = name => api.get(`/image/search/one?name=${name}`, {})