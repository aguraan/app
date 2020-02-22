import AdminSettings from '@/views/admin/Settings'
import DashboardPage from '@/views/admin/Dashboard'

const routes = [
    {
        path: 'dashboard',
        name: 'admin_dashboard',
        component: DashboardPage,
    },
    {
        path: 'settings',
        name: 'admin_settings',
        component: AdminSettings,
    },
]

export default routes