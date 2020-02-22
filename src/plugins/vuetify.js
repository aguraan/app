import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    lang: {
        current: 'ru'
    },
    theme: {
        themes: {
            light: {
                'login-header': colors.grey.lighten2,
                'login-tabs-header': colors.grey.lighten4
            },
            dark: {
                
            }
        }
    }
})
