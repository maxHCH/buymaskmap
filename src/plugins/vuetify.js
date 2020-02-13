import Vue from 'vue'
import Vuetify, {
  VApp,
  VSelect,
  VContainer,
  VRow,
  VCol,
  VCard,
  VTextField,
  VDivider,
  VProgressLinear,
  VBtn,
  VCardActions,
  VSwitch
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify,{
  components: {
    VApp,
    VSelect,
    VContainer,
    VRow,
    VCol,
    VCard,
    VTextField,
    VDivider,
    VProgressLinear,
    VBtn,
    VCardActions,
    VSwitch
  },
  directives: {
    Ripple,
  },
})

const opts = {}

export default new Vuetify(opts)