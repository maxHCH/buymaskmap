import Vue from 'vue'
import App from './App.vue'
import utils from './utils'
import vuetify from '@/plugins/vuetify'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$utils = utils

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
