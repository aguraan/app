import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import general from './general.store'
import auth from './auth.store'
import route from './route.store'
import user from './user.store'

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        general,
        auth,
        route,
        user
    }
})