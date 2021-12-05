// 点位表
import api from "../../common/interface";

/**
 * 查询port_point_map_id下的点位图
 * @param {*} data
 * @returns
 */
export const getPointSearch = (data) => api.post(`/point/search`, data);
