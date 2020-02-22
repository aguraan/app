import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import storage from '@/plugins/storage'
import router from '@/router'
import store from '@/store'

// Vue.use(storage)

Vue.config.productionTip = false

new Vue({
  vuetify,
  storage,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
