// 获取波形统计图
import api from "../../common/interface"

/**
 * 获取波形统计图
 * @param {*} point_id 
 * @returns 
 */
export const getWavestatsSearchPointId = point_id => api.get(`/wavestats/search/point_id?point_id=${point_id}`, {})