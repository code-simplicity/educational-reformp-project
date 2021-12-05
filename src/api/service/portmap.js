// 港口地图
import api from "../../common/interface";

/**
 * 获取港口地图
 * @param {*} data
 * @returns
 */
export const getPortMapFind = (data) => api.post(`/portmap/find`, data);
