import axios from 'axios'
import store from '@/store'
import { 
    START_OPERATION,
    END_OPERATION,
    SNACKBAR_ERROR,
    REFRESH_TOKEN_REQUEST
} from '@/mutation.types'

/* eslint-disable */

const API = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://app.scheme.com.ua',
    // `onUploadProgress` allows handling of progress events for uploads
    onUploadProgress: progressEvent => {
        // Do whatever you want with the native progress event
    },
    
    // `onDownloadProgress` allows handling of progress events for downloads
    onDownloadProgress: progressEvent => {
        // Do whatever you want with the native progress event
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
        console.log({ percentCompleted })
    },
})

const RETRY_DEFAULT_COUNT = 0
const REREQUEST_COUNT = 1
let retryCount = RETRY_DEFAULT_COUNT

API.interceptors.request.use( async config => {

    // retryCount = RETRY_DEFAULT_COUNT

    const _config = {
        method: config.method,
        url: config.url.split('?')[0]
    }
    const operation = store.getters.makeOperation(_config)
    store.commit(START_OPERATION, operation)

    console.log(operation)

    if (config.url !== '/auth/refresh-token' && config.url !== '/auth/logout') {

        if (store.getters.refreshToken() && store.getters.isAccessTokenExpired()) { // if (!store.getters.isAuthorized(router.currentRoute)) {
            await store.dispatch(REFRESH_TOKEN_REQUEST)
        }
    }
    config.headers.Authorization = `Bearer ${ store.getters.accessToken }`

    return config
})

API.interceptors.response.use(response => {

    const config = {
        method: response.config.method,
        url: new URL(response.config.url).pathname
    }
    const operation = store.getters.makeOperation(config)
    store.commit(END_OPERATION, operation)

    console.log('Success', response.data)

    return response
}, async error => {

    
    const config = {
        method: error.config.method,
        url: new URL(error.config.url).pathname
    }
    const operation = store.getters.makeOperation(config)
    store.commit(END_OPERATION, operation)
    
    const { response: { data }, message } = error
    const text = (data && data.message) || message
    store.commit(SNACKBAR_ERROR, { text })
    
    console.dir(error)

    /**
     * На случай, если токен просрочиться во время ожидания ответа от сервера
     * 
     */
    if (error.response.status === 401 && store.getters.refreshToken()) {

        if (retryCount < REREQUEST_COUNT) {
            retryCount++;
            await store.dispatch(REFRESH_TOKEN_REQUEST)

            error.config.url = new URL(error.config.url).pathname

            return API.request(error.config)
        }
    }

    return Promise.reject(error)
})

export default API