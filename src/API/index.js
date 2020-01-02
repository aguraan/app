import axios from 'axios'
import store from '@/store'
import { START_OPERATION, END_OPERATION } from '@/mutation.types'

const API = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: false,
})

API.interceptors.request.use(config => {
    store.commit(START_OPERATION)
    return config
})

API.interceptors.response.use(response => {

    store.commit(END_OPERATION)
    console.log('Success', response.data)

    return response
}, error => {

    store.commit(END_OPERATION)
    console.dir(error.toJSON())

    return Promise.reject(error)
})

export default API