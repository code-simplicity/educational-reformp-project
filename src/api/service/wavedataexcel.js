// 获取excel
import request from '@/utils/request';

/**
 * 获取excel
 * @param {*} params 
 * @returns 
 */
export const getWaveDataExcelByPortMapPointId = params => {
    return request({
        url: "/portal/user/wavedataexcel/finOne/byportmapid",
        method: "get",
        params
    })
}