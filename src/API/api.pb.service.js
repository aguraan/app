import axios from 'axios'
import store from '@/store'
import { 
    START_OPERATION,
    END_OPERATION,
} from '@/mutation.types'

const API = axios.create({
    baseURL: 'https://api.privatbank.ua'
})

/* eslint-disable */

API.interceptors.request.use( async config => {

    const _config = {
        method: config.method,
        url: config.url.split('?')[0]
    }
    const operation = store.getters.makeOperation(_config)
    store.commit(START_OPERATION, operation)
    console.log('start', operation)

    return config
})

API.interceptors.response.use(response => {

    const config = {
        method: response.config.method,
        url: new URL(response.config.url).pathname
    }
    const operation = store.getters.makeOperation(config)
    store.commit(END_OPERATION, operation)
    console.log('end', operation)

    console.log('Success', response.data)

    return response
}, error => {

    const config = {
        method: error.config.method,
        url: new URL(error.config.url).pathname
    }
    const operation = store.getters.makeOperation(config)
    store.commit(END_OPERATION, operation)

    console.dir(error)

    return Promise.reject(error)
})

export default {
    getExchangeRates() {
        return API.get('/p24api/pubinfo?exchange&json&coursid=11')
    }
}