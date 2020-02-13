import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import utils from './utils'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false
Vue.prototype.$utils = utils

axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
