<template>
  <div id="app">
    <v-app>
      <Map></Map>
    </v-app>
  </div>
</template>

<script>
import Map from './components/Map.vue'
import { VApp } from 'vuetify/lib'

export default {
  name: 'App',
  components: {
    Map,
    VApp
  }
}
</script>
