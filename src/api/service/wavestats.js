// 获取波形统计图
import request from '@/utils/request';


/**
 * 获取波形统计图
 * @param {*} data 
 * @returns 
 */
export const getWavestatsSearchPointId = data => {
    return request({
        url: "/portal/user/wavestats/point_id/findOne",
        method: "post",
        data
    })
}