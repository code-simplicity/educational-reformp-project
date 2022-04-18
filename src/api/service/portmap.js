// 港口地图
import request from '../../utils/request';

/**
 * 获取港口地图列表
 * @param {*} params
 * @returns
 */
export const getPortMapFindAll = (params) => {
    return request({
        url: "/portal/user/portmap/findAll",
        method: "get",
        params
    })
}