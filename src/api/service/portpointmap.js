// 港口点位图
import api from "../../common/interface"

/**
 * 获取港口点位地图
 * @param {*} params 
 * @returns 
 */
export const getPortPointMapSearch = params => api.post(`/portpointmap/search`, params)