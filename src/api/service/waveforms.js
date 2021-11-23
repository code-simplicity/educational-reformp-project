// 获取波形图
import api from "../../common/interface"

/**
 * 获取波形图
 * @param {*} point_id 
 * @returns 
 */
export const getWaveformsSearchPointId = point_id => api.get(`/waveforms/search/point_id?point_id=${point_id}`, {})