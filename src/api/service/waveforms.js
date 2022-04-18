// 获取波形图
import request from '../../utils/request';


/**
 * 获取波形图
 * @param {*} data 
 * @returns 
 */
export const getWaveformsSearchPointId = data => {
    return request({
        url: "/portal/user/waveforms/point_id/findOne",
        method: "post",
        data
    })
}