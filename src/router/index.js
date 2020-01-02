import Vue from 'vue'
import Router from 'vue-router'

import Admin from '@/views/admin/Admin.vue'
import Fighter from '@/views/fighter/Fighter.vue'
import User from '@/views/user/User.vue'
import Page404 from '@/views/pages/Page404.vue'

import adminRoutes from './admin.routes'
import userRoutes from './user.routes'
import fighterRoutes from './fighter.routes'

Vue.use(Router)

const routes = [
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        children: adminRoutes
    },
    {
        path: '/fighter',
        name: 'fighter',
        component: Fighter,
        children: fighterRoutes
    },
    {
        path: '/user',
        name: 'user',
        component: User,
        children: userRoutes
    },
    {
        path: '*',
        name: 'page404',
        component: Page404
    }
]

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
