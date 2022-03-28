const state = () => ({
    isCollapse: false, // 侧边栏是否收缩
})

const mutations = {
    isCollapseChange(state, type) {
        state.isCollapse = type
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}