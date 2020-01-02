import {
    START_OPERATION,
    END_OPERATION,
} from '@/mutation.types'

export default {
    state: {
        operations: 0,
    },
    getters: {
        operations: ({ operations }) => operations,
        loading: ({ operations }) => !!operations,
    },
    mutations: {
        [START_OPERATION]: state => state.operations++,
        [END_OPERATION]: state => state.operations--,
    },
    actions: {

    }
}