import Vue from 'vue'
import Vuetify, {
  VApp,
  VSelect,
  VRow,
  VCol,
  VCard,
  VTextField,
  VDivider,
  VRating,
  VToolbar,
} from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify,{
  components: {
    VApp,
    VSelect,
    VRow,
    VCol,
    VCard,
    VTextField,
    VDivider,
    VRating,
    VToolbar,
  },
  directives: {
    Ripple,
  },
})

const opts = {}

export default new Vuetify(opts)