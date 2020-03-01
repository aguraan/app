import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
import { REFRESH_TOKEN_REQUEST } from '@/mutation.types'

import MainAdmin from '@/views/admin/Index'
import MainFighter from '@/views/fighter/Index'
import MainUser from '@/views/user/Index'
import LoginPage from '@/views/common/login/Login'
import Page404 from '@/views/common/Page404'

import adminRoutes from './admin.routes'
import userRoutes from './user.routes'
import fighterRoutes from './fighter.routes'

Vue.use(Router)

const routes = [
    {
        path: '/admin',
        name: 'admin',
        component: MainAdmin,
        children: adminRoutes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/fighter',
        name: 'fighter',
        component: MainFighter,
        children: fighterRoutes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/user',
        name: 'user',
        component: MainUser,
        children: userRoutes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            blocked: true
        }
    },
    {
        path: '/*',
        name: 'page404',
        component: Page404
    }
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach( async (to, from, next) => {
    const { getters, dispatch } = store

    if (getters.isAccessTokenExpired() && getters.refreshToken()) {

        try {
            await dispatch(REFRESH_TOKEN_REQUEST)
        } catch (error) {
            next(error)
        }
    }

    if (to.matched[0].meta.requiresAuth) {

        if (getters.isAuthorized(to)) next()
        else if (getters.isAuthenticated()) next({ name: getters.user.role.toLowerCase() })
        else next('/login')

    } else {
        if (getters.isAuthenticated() && to.matched[0].meta.blocked) next(false)
        else next()
    }
    
})

export default router
