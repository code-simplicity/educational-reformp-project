// state
const state = () => ({
    // 登录状态
    login_Status: null,

    // 用户信息
    user_Info: null
})

// getter
const getters = {
    // 获取登录状态
    login_Status: (state) => {
        return state.login_Status || JSON.parse(window.localStorage.getItem('_login_status_'))
    },

    // 获取用户信息
    user_Info: (state) => {
        return state.user_Info || JSON.parse(window.localStorage.getItem('_user_Info_'))
    }
}

// actions 
const actions = {

}

// mutations
const mutations = {
    // 是否登录
    LOGIN_STATUS(state, login_Status) {
        state.login_Status = login_Status
    },
    // 用户信息
    USER_INFO(state, user_Info) {
        state.user_Info = user_Info
    },
    LOGIN(state, res) {
        state.login_Status = true
        state.user_Info = res
        window.localStorage.setItem({
            key: '_user_Info_',
            data: res
        })
    }
}

// 统一暴露
export default {
    // 开启命名空间
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}