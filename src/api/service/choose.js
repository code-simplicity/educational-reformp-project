// 左侧选择栏
import request from '@/utils/request';

/**
 * 获取单选列表,根据分类
 * @param {*} params
 * @returns
 */
export const getChooseFindAll = (params) => {
    return request({
        url: "/portal/user/choose/findAll",
        method: "get",
        params
    })
}