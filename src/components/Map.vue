<template>
  <div class="map-container">
    <div id="map-container"></div>
    <MapController @zoomIn="zoomIn" @zoomOut="zoomOut" @resetMap="resetMap"></MapController>
    <SideBarNav @searchCounty="searchCountyMapHandler" @searchCity="searchCityMapHandler"></SideBarNav>
  </div>
</template>

<script>
import MapController from "@/components/MapController.vue"
import SideBarNav from '@/components/SideBarNav.vue'
import { getMaskInfo } from '@/api/api.js'
export default {
  name: "maskmap",
  components: {
    MapController,
    SideBarNav
  },
  data(){
    return {
      map: null,
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maskData: [],
      county: '桃園市',
      city: '中壢區'
    }
  },
  computed:{
    coordinatesHandler(){
      const data = this.searchCounty.map((item)=> item.geometry.coordinates)
      return data
    },
    searchCounty(){
      const county = this.maskData.filter(item =>{
        return this.county === item.properties.county && this.city === item.properties.town
      })
      return county
    },
  },
  mounted() {
    this.setMapHandler()
    this.getMaskMapData()
  },
  methods : {
    async getMaskMapData(){
      try {
        const res = await getMaskInfo()
        if(res.status === 200){
          this.maskData = res.data.features
          this.addMarker()
        }
      }catch (error) {
        throw new Error(error)
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
      this.searchCounty.forEach(item => {
        let d = {
          coordinates : item.geometry.coordinates,
          info : item.properties
        }
        let colorIcon = this.$utils.map.blueIcon
        if(!d.info.mask_adult && !d.info.mask_child){
          colorIcon = this.$utils.map.greyIcon
        }
        let maker = this.$utils.map.createMakerByLatLng([d.coordinates[1],d.coordinates[0]],{icon:colorIcon})
        cluster.addLayer(maker.bindPopup(this.addPopupHandler(d)))
      });
      this.map.addLayer(cluster);
    },
    addPopupHandler(d){
      let dynamicAdultClass = 'tooltip--mask'
      let dynamicChildClass = 'tooltip--mask'
      !d.info.mask_adult ? dynamicAdultClass = 'tooltip--mask-none' : dynamicAdultClass = 'tooltip--mask'
      !d.info.mask_child ? dynamicChildClass = 'tooltip--mask-none' : dynamicChildClass = 'tooltip--mask'
      let p = 
      `
      <h2>${d.info.name}</h2>
      <hr>
      <p>${d.info.address}</p>
      <p>${d.info.phone}</p>
      <p class="${dynamicAdultClass}">成人口罩數量剩餘：${d.info.mask_adult}</p> 
      <p class="${dynamicChildClass}">兒童口罩數量剩餘：${d.info.mask_child}</p>
      <p>最後更新時間： ${d.info.updated}</p>
      `
      return p
    },
    searchCountyMapHandler(c){
      this.county = c
    },
    searchCityMapHandler(c){
      this.city = c
      this.addMarker();
    }
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
  font-weight: bold;
  font-size: 14px;
}
.tooltip--mask {
  color : rgb(61, 161, 255);
  font-weight: bold;
  font-size: 14px;
}
</style>
