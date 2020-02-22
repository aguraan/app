import API from '@/API'

export default {
    login(email, password) {
        return API.post('/auth/login', { email, password })
    },
    logout(refreshToken, fingerprint) {
        return API.post('/auth/logout', { refreshToken, fingerprint })
    },
    register(givenName, familyName, email, password, fingerprint) {
        return API.post('/auth/register', {
            givenName,
            familyName,
            email,
            password,
            fingerprint
        })
    },
    createSession(token, fingerprint) {
        return API.post('/auth', { token, fingerprint })
    },
    refreshTokenRequest(refreshToken, fingerprint) {
        return API.post('/auth/refresh-token', { refreshToken, fingerprint })
    },
    checkConfirmation(token) {
        return API.get('/auth/email-confirm', {
            params: { token }
        })
    },
    changePassword(token, newPassword) {
        return API.post('/auth/change-password', { token, newPassword })
    },
    sendPasswordResetEmail(email) {
        return API.get('/auth/password-reset-email', {
            params: { email }
        })
    },
    sendConfirmationEmail(email) {
        return API.get('/auth/send-confirmation-email', {
            params: { email }
        })
    },
}