// 点位表
import api from "../../common/interface"

/**
 * 查询port_point_map_id下的点位图
 * @param {*} port_point_map_id 
 * @returns 
 */
export const getPointSearch = port_point_map_id => api.get(`/point/search?port_point_map_id=${port_point_map_id}`, {})