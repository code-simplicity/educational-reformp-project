// 港口地图
import api from "../../common/interface"

/**
 * 获取港口地图
 * @returns 
 */
export const getPortMapFind = () => api.get(`/portmap/find`, {})