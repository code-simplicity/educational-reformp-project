import api from "../../common/interface"

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const getVideoSearch = params => api.post(`/video/serach`, params)

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const videoSearchFindOne = params => api.post(`/video/search/findOne`, params)

/**
 * 获取一个视频
 * @param {*} name 
 * @returns 
 */
export const getVideoSearchOne = name => api.get(`/video/search/one?name=${name}`, {})