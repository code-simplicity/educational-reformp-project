// 点位表
import request from '../../utils/request';

/**
 * 查询port_point_map_id下的点位图
 * @param {*} data
 * @returns
 */
export const getPointByPointMapFindAll = (data) => {
    return request({
        url: "/portal/user/point/by-pointmapid/findAll",
        method: "post",
        data
    })
}