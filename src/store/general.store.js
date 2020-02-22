import {
    START_OPERATION,
    END_OPERATION,
    EXCHANGE_RATES_REQUEST,
    SET_EXCHANGE_RATES,
} from '@/mutation.types'
import pbService from '@/API/api.pb.service'
export default {
    state: {
        operations: {},
        exchangeRates: null,
    },
    getters: {
        operations: ({ operations }) => operations,
        loading: ({ operations }) => Object.values(operations).some(value => value),
        makeOperation: () => config => `${ config.method }:${ config.url }`,
        exchangeRates: ({ exchangeRates }) => exchangeRates,
        bufferValue: ({ operations }) => {
            const values = Object.values(operations)
            const valuesLen = values.length

            if (!valuesLen) return 100

            const activeValuesLen = values.filter(item => item).length

            return 100 - activeValuesLen / valuesLen * 100
        },
    },
    mutations: {
        [START_OPERATION]: (state, operation) => state.operations = { ...state.operations, [operation]: true },
        [END_OPERATION]: (state, operation) => state.operations = { ...state.operations, [operation]: false },
        [SET_EXCHANGE_RATES]: (state, exchangeRates) => state.exchangeRates = exchangeRates,
    },
    actions: {
        [EXCHANGE_RATES_REQUEST]: ({ commit }) => {
            return new Promise( async (resolve, reject) => {
                try {
                    commit(SET_EXCHANGE_RATES, null)
                    const response = await pbService.getExchangeRates()
                    commit(SET_EXCHANGE_RATES, response.data)
                    resolve(response)
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}