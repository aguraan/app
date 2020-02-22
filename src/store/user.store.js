import {
    SET_USER,
    UPDATE_USER,
    SET_GOOGLE_DATA,
    GET_GOOGLE_DATA,
    UPDATE_GOOGLE_DATA,
    SELECT_THEME,
    SET_DARK_MODE,
} from '@/mutation.types'
import apiService from '@/API/api.service'
import vuetify from '@/plugins/vuetify'
import storage from '@/plugins/storage'

export default {
    state: {
        user: null,
        googleData: null,
        selectedTheme: storage.get('theme') || 0,
        darkMode: storage.get('dark') || false,
    },
    getters: {
        user: ({ user }) => user,
        googleData: ({ googleData }) => googleData,
        selectedTheme: ({ selectedTheme }) => selectedTheme,
        darkMode: ({ darkMode }) => darkMode,
    },
    mutations: {
        [SET_USER]: (state, user) => {
            const ru = {
                ADMIN: 'Администратор',
                FIGHTER: 'Боец',
                USER: 'Клиент',
                GUEST: 'Гость'
            }
            state.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                roleRu: ru[user.role],
                username: user.username,
                givenName: user.givenName,
                familyName: user.familyName,
                middleName: user.middleName,
                name: user.name,
                picture: user.picture,
                google_id: user.google_id,
                facebook_id: user.facebook_id,
                settings: user.settings,
                created: user.created
            }
            
            state.selectedTheme = user.settings.theme
            state.darkMode = user.settings.dark

            storage.set('theme', user.settings.theme)
            storage.set('dark', user.settings.dark)

            vuetify.framework.theme.dark = user.settings.dark
        },
        [SET_GOOGLE_DATA]: (state, data) => state.googleData = data,
        [SELECT_THEME]: (state, selectedTheme) => state.selectedTheme = selectedTheme,
        [SET_DARK_MODE]: (state, val) => {
            vuetify.framework.theme.dark = val
            state.darkMode = val
        },
    },
    actions: {
        [UPDATE_USER]: ({ commit }, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await apiService.updateUserById(payload.id, payload.userUpdate)
                    commit(SET_USER, response.data.user)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [GET_GOOGLE_DATA]: ({ commit }, id) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await apiService.getGoogleAccountById(id)
                    commit(SET_GOOGLE_DATA, response.data.account)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [UPDATE_GOOGLE_DATA]: ({ commit }, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await apiService.updateGoogleAccountById(payload.id, payload.googleUpdate)
                    commit(SET_GOOGLE_DATA, response.data.account)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        // [PRELOAD_ADMIN_DATA]: ({ dispatch, getters }) => {
        //     return new Promise( async (resolve, reject) => {
        //         if (getters.user.id) {
        //             dispatch(GET_GOOGLE_DATA, getters.user.id)
        //         }
        //         try {
                    
        //         } catch (error) {
                    
        //         }
        //     })
        // }
    }
}