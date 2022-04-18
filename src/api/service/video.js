import request from '../../utils/request';

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const videoFindAll = (params) => {
    return request({
        url: "/portal/user/video/findAll",
        method: "get",
        params
    })
}

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const videoSearchFindOne = (params) => {
    return request({
        url: "/portal/user/video/findOne",
        method: "get",
        params
    })
}