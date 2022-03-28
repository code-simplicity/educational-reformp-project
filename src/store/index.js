import {
    createStore,
    createLogger
} from 'vuex'

import user from './modules/user'
import app from './modules/app'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
    modules: {
        user,
        app
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})