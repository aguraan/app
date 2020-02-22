import {
    SNACKBAR_ON,
    SNACKBAR_OFF,
    SNACKBAR_SUCCESS,
    SNACKBAR_ERROR,
    SET_ACCESS_TOKEN,
    LOGOUT,
    REFRESH_TOKEN_REQUEST,
    SET_REFRESH_TOKEN,
    CONFIRMATION_CHECK,
    CHANGE_PASSWORD,
    PASSWORD_RESET_REQUEST,
    CONFIRMATION_REQUEST,
    LOGIN,
    CREATE_SESSION_REQUEST,
    REGISTER,
    GOOGLE_AUTH,
    FACEBOOK_AUTH,
    START_OPERATION,
    END_OPERATION,
    SET_USER,
    SET_REMEMBER_ME
} from '@/mutation.types'
import { extractPayload } from '@/helpers'
import authService from '@/API/auth.service'
import storage from '@/plugins/storage'
import fingerprint from '@/helpers/fingerprint'
import popup from '@/popup'

popup.defaults.baseUrl = process.env.NODE_ENV !== 'development' ? 'http://localhost:3000' : 'https://app.scheme.com.ua'

export default {
    state: {
        snackbar: false,
        snackbarText: '',
        snackbarColor: 'info',
        accessToken: '',
        accessTokenPayload: null,
        rememberMe: storage.get('rememberMe') || false,
    },
    getters: {
        snackbarText: ({ snackbarText }) => snackbarText,
        snackbarColor: ({ snackbarColor }) => snackbarColor,
        snackbar: ({ snackbar }) => snackbar,
        rememberMe: ({ rememberMe }) => rememberMe,
        accessToken: ({ accessToken }) => accessToken,
        accessTokenPayload: ({ accessTokenPayload }) => accessTokenPayload,
        isAccessTokenExpired: ({ accessTokenPayload }) => () => {
            /* eslint-disable */
            if (accessTokenPayload) {
                const { exp } = accessTokenPayload
                const now = Date.now() / 1000
                // const date = new Date()
                // const diff = date.getTimezoneOffset() * 60
                // console.log({ diff })
                // const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()) / 1000
                // const now = Math.floor(Date.now() / 1000) + diff
                // if (exp > now) return false
                console.log({ exp, now })
                return exp < now
            }
            return true
        },
        isAuthenticated: ({ accessToken }) => () => !!accessToken,
        // isAuthenticated: ({ accessTokenPayload, user }, getters) => {
        //     if (accessTokenPayload && user && getters.refreshToken()) {
        //         const { userId } = accessTokenPayload
        //         if (userId === user.id) return true
        //     }
        //     return false
        // },
        isAuthorized: ({ accessTokenPayload }, getters) => route => {
            if (accessTokenPayload && !route.matched[0].meta.blocked && route.matched[0].meta.requiresAuth /** !getters.isAccessTokenExpired() */) {
                const { role } = accessTokenPayload
                // if (role.toLowerCase() !== route.matched[0].name) return false
                return role.toLowerCase() === route.matched[0].name
            }
            return false
        },
        refreshToken: () => () => storage.get('refreshToken')
    },
    mutations: {
        [SNACKBAR_ON]: state => state.snackbar = true,
        [SNACKBAR_OFF]: state => state.snackbar = false,
        [SNACKBAR_SUCCESS]: (state, payload = {}) => {
            state.snackbar = true
            state.snackbarColor = 'success'
            state.snackbarText = payload.text || ''
        },
        [SNACKBAR_ERROR]: (state, payload) => {
            state.snackbar = true
            state.snackbarColor = 'error'
            state.snackbarText = payload.text || ''
        },
        [SET_ACCESS_TOKEN]: (state, accessToken) => {
            state.accessToken = accessToken
            state.accessTokenPayload = extractPayload(accessToken)
        },
        [SET_REFRESH_TOKEN]: (state, refreshToken) => storage.set('refreshToken', refreshToken),
        [SET_REMEMBER_ME]: (state, val) => {
            storage.set('rememberMe', val)
            state.rememberMe = val
        }
    },
    actions: {
        [LOGIN]: (context, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.login(payload.email, payload.password)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [LOGOUT]: ({ getters }) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const murmur = await fingerprint()
                    await authService.logout(getters.refreshToken(), murmur)
                    resolve()
                } catch (error) {
                    reject(error)
                } finally {
                    storage.clear()
                    window.location.replace('/login')
                }
            })
        },
        [REGISTER]: (context, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const { givenName, familyName, email, password, fingerprint } = payload
                    const response = await authService.register(givenName, familyName, email, password, fingerprint)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [CREATE_SESSION_REQUEST]: (constext, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.createSession(payload.token, payload.fingerprint)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [REFRESH_TOKEN_REQUEST]: ({ commit, getters, dispatch }) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const murmur = await fingerprint()
                    const response = await authService.refreshTokenRequest(getters.refreshToken(), murmur)
                    const { accessToken, refreshToken, user } = response.data

                    commit(SET_ACCESS_TOKEN, accessToken)
                    commit(SET_REFRESH_TOKEN, refreshToken)
                    commit(SET_USER, user)
                    
                    resolve(response)
                } catch (error) {
                    await dispatch(LOGOUT)
                    reject(error)
                }
            })
        },
        [CONFIRMATION_CHECK]: (context, token) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.checkConfirmation(token)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [CHANGE_PASSWORD]: (context, payload) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.changePassword(payload.token, payload.newPassword)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [PASSWORD_RESET_REQUEST]: (context, email) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.sendPasswordResetEmail(email)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [CONFIRMATION_REQUEST]: (context, email) => {
            return new Promise( async (resolve, reject) => {
                try {
                    const response = await authService.sendConfirmationEmail(email)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        },
        [GOOGLE_AUTH]: ({ getters, commit }, payload = { scope: null, consent: false }) => {
            return new Promise( async (resolve, reject) => {

                let url = '/auth/google'
                const search = new URLSearchParams(payload)
                const operation = getters.makeOperation({ method: 'get', url })

                url += `?${ search }`

                try {
                    commit(START_OPERATION, operation)
                    const response = await popup.open(url, 'google')
                    resolve(response)
    
                } catch (error) {
                    reject(error)
                } finally {
                    commit(END_OPERATION, operation)
                    popup.window.close()
                }
            })
        },
        [FACEBOOK_AUTH]: ({ getters, commit }) => {
            return new Promise( async (resolve, reject) => {

                let url = '/auth/facebook'
                const operation = getters.makeOperation({ method: 'get', url })

                try {
                    commit(START_OPERATION, operation)
                    const response = await popup.open(url, 'facebook')
                    resolve(response)
    
                } catch (error) {
                    reject(error)
                } finally {
                    commit(END_OPERATION, operation)
                    popup.window.close()
                }
            })
        },
    }
}