const state = () => ({
    hasAnimation: false, // 是否存在动画
    appSize: 'xl', // app的大小
    isCollapse: false, // 侧边栏是否收缩
})

const mutations = {
    // 改变state的值
    CHANGE_STATE(state, data) {
        state[data.key] = data.val
    }
}

const actions = {
    changeState({
        commit
    }, data) {
        commit("CHANGE_STATE", data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}