import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import general from './general'

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        general
    }
})