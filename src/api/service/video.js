import api from "../../common/interface"

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const getVideoSearch = params => api.post(`/video/serach`, params)