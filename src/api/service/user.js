import request from '@/utils/request';

/**
 * 用户登录
 * @data {*} data
 * @returns
 */
export const login = (data) => {
    return request({
        url: "/portal/user/login",
        method: "post",
        data
    })
}

/**
 * 退出登录
 * @returns
 */
export const logout = () => {
    return request({
        url: "/portal/user/logout",
        method: "get",

    })
}

/**
 * 用户注册
 * @param {*} data 
 * @returns 
 */
export const addUser = (data) => {
    return request({
        url: "/portal/user/add",
        method: "post",
        data
    })
}

/**
 * 获取用户信息
 * @param {*} id 
 * @returns 
 */
export const getUserInfo = (id) => {
    return request({
        url: `/portal/user/info?id=${id}`,
        method: "get"
    })
}

/**
 * 更新用户信息
 * @param {*} data 
 * @returns 
 */
export const updateUserInfo = (data) => {
    return request({
        url: "/portal/user/update/info",
        method: "put",
        data
    })
}

/**
 * 重置用户密码
 * @param {*} data 
 * @returns 
 */
export const resetPassword = (data) => {
    return request({
        url: "/portal/user/reset-password",
        method: "put",
        data
    })
}

/**
 * 添加用户等分
 * @param {*} data 
 * @returns 
 */
export const addUserScore = (data) => {
    return request({
        url: "/portal/user/add/score",
        method: "post",
        data
    })
}

/**
 * 发送图灵验证码
 * @returns 
 */
export const sendCaptcha = () => {
    return request({
        url: "/captcha",
        method: "get"
    })
}

/**
 * 检查token是否存在
 * @returns 
 */
export const checkToken = () => {
    return request({
        url: "/portal/user/check-token",
        method: "get"
    })
}

/**
 * 重置邮箱
 * @param {*} data 
 * @returns 
 */
export const resetEmailUser = (data) => {
    return request({
        url: "/portal/user/reset-email",
        method: "put",
        data
    })
}

/**
 * 重置密码
 * @param {*} data 
 * @returns 
 */
export const resetPasswordUser = (data) => {
    return request({
        url: "/portal/user/reset-password",
        method: "put",
        data
    })
}

/**
 * 发送邮箱验证码
 * @param {*} data 
 * @returns 
 */
export const sendMailCode = (data) => {
    return request({
        url: "/portal/userEx/sendMailCode",
        method: "post",
        data
    })
}