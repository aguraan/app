import API from '@/API'

export default {

    getUserById(id) {
        return API.get(`/api/users/${ id }`)
    },
    updateUserById(id, userUpdate) {
        return API.patch(`/api/users/${ id }`, { userUpdate })
    },
    getGoogleAccountById(id) {
        return API.get(`/api/accounts/google/${ id }`)
    },
    updateGoogleAccountById(id, googleUpdate) {
        return API.patch(`/api/accounts/google/${ id }`, { googleUpdate })
    }
}