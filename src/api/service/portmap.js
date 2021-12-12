// 港口地图
import api from "../../common/interface";

/**
 * 获取港口列表
 * @param {*} data
 * @returns
 */
export const getPortMapFind = (data) => api.post(`/portmap/find`, data);

/**
 * 获取港口地图, 通过id
 * @param {*} id
 * @returns
 */
export const getPortMapSearch = (id) => api.get(`/portmap/search?id=${id}`, {});