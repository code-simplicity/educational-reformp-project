// 港口点位图
import request from '../../utils/request';

/**
 * 获取港口点位地图
 * @param {*} data 
 * @returns 
 */
export const portPointMapSearchFindOne = (data) => {
    return request({
        url: "/portal/user/portpointmap/findOne",
        method: "post",
        data
    })
}