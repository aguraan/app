export default {
    state: {
        routeData: [
            { name: 'admin', title: 'Админ Панель', icon: 'mdi-alpha-a-circle' },
            { name: 'fighter', title: 'Главная Панель', icon: 'mdi-alpha-f-circle' },
            { name: 'user', title: 'Главная Панель', icon: 'mdi-alpha-u-circle' },
            { name: 'admin_dashboard', title: 'Канбан', icon: 'mdi-view-dashboard' },
            { name: 'admin_profile', title: 'Моя Страница', icon: 'mdi-account-details'},
            { name: 'admin_settings', title: 'Настройки', icon: 'mdi-settings' },
        ]
    },
    getters: {
        routeData: ({ routeData }) => routeData,
        mapRouteData: ({ routeData }) => names => names.map(name => routeData.find(data => data.name === name)),
        routeDataByName: ({ routeData }) => name => routeData.find(route => route.name === name),
    },
    mutations: {

    },
    actions: {

    }
}