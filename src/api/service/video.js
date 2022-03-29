import api from "../../common/interface"
import request from '@/utils/request';

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const getVideoSearch = params => api.post(`/video/serach`, params)

/**
 * 获取视频
 * @param {*} params 
 * @returns 
 */
export const videoSearchFindOne = params => api.post(`/video/search/findOne`, params)

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