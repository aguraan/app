import API from '@/API'

export default {
    logout() {
        return API.get('/logout')
    }
}