// bim模型
import request from '@/utils/request';

/**
 * 获取单选列表,根据分类
 * @param {*} params
 * @returns
 */
export const getBimFindAll = (params) => {
    return request({
        url: "/portal/user/bim/finAll",
        method: "get",
        params
    })
}