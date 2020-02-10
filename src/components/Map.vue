<template>
  <div class="map-container">
    <div id="map-container"></div>
    <NavigationCtrl @zoomIn="zoomIn" @zoomOut="zoomOut" @resetMap="resetMap"></NavigationCtrl>
  </div>
</template>

<script>
import NavigationCtrl from "@/components/NavigationCtrl.vue"
import { getMaskInfo } from '@/api/api.js'
export default {
  name: "maskmap",
  components: {
    NavigationCtrl
  },
  data(){
    return {
      map: null,
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maskData: []
    }
  },
  computed:{
    coordinatesHandler(){
      const data = this.maskData.map((item)=> item.geometry.coordinates)
      return data
    }
  },
  mounted() {
    this.setMapHandler()
    this.getMaskMapData()
  },
  methods : {
    async getMaskMapData(){
      const res = await getMaskInfo()
      if(res.status === 200){
        this.maskData = res.data.features
        this.addMarker()
      }
    },
    setMapHandler(){
      this.map = this.$utils.map.createMap("map-container",{
      zoomControl: false,
      maxZoom: 18
      })
      this.$utils.map.createTileLayer(this.map, this.OSMUrl, {})
      this.map.setView([24.953635,121.2234593], 15)
    },
    zoomIn(){
      this.map.zoomIn()
    },
    zoomOut(){
      this.map.zoomOut()
    },
    resetMap(){
      this.map.flyTo([24.953635,121.2234593], 15)
    },
    addMarker() {
      const cluster = this.$utils.map.createMakerCluster();
      if(!this.coordinatesHandler.length){
        return this.$utils.map.createMakerByXY(this.map, [24.953635,121.2234593]);
      }
      this.maskData.forEach(item => {
        let d = {
          coordinates : item.geometry.coordinates,
          info : item.properties
        }
        let maker = this.$utils.map.createMakerByLatLng([d.coordinates[1],d.coordinates[0]])
        cluster.addLayer(maker.bindTooltip(this.addTooltipHandler(d)))
      });
      this.map.addLayer(cluster);
    },
    addTooltipHandler(d){
      let dynamicAdultClass = 'tooltip--mask'
      let dynamicChildClass = 'tooltip--mask'
      !d.info.mask_adult ? dynamicAdultClass = 'tooltip--mask-none' : dynamicAdultClass = 'tooltip--mask'
      !d.info.mask_child ? dynamicChildClass = 'tooltip--mask-none' : dynamicChildClass = 'tooltip--mask'
      let toolitps = 
      `
      <h4> ${d.info.name} </h4> 
      <p class="${dynamicAdultClass}">成人：${d.info.mask_adult}</p> 
      <p class="${dynamicChildClass}">兒童：${d.info.mask_child}</p>
      `
      return toolitps
    },
    // addPopupHandler(d){
    //   let popup = this.$utils.map.createPopup(this.map, {
    //     maxWidth: 200,
    //     minWidth: 100,
    //     className: "shop-popup"
    //   })
    //   popup.setContent(
    //     `
    //     <h2>${d.info.name}</h2>
    //     <p>${d.info.address}</p>
    //     <p>${d.info.phone}</p>
    //     <p>最後更新時間： ${d.info.updated}</p>
    //     `
    //   );
    //   return popup
    // }
  }
};
</script>
<style lang="scss" scope>
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
#map-container {
  width: 100%;
  height: 100%;
}
.tooltip--mask-none{
  color: red;
}
.tooltip--mask {
  color : rgb(61, 161, 255)
}
</style>
