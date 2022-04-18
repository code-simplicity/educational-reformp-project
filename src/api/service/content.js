import request from '../../utils/request';

/**
 * 获取所有内容
 * @param {*} params 
 * @returns 
 */
export const contentFindAll = (params) => {
  return request({
    url: "/portal/user/content/findAll",
    method: "get",
    params
  })
}

/**
 * 获取内容
 * @param {*} params 
 * @returns 
 */
export const contentSearchChooseId = (data) => {
  return request({
    url: "/portal/user/content/choose_id",
    method: "post",
    data
  })
}