<template>
  <div class="map-container">
    <div id="map-container"></div>
    <Loading v-if="isLoading"></Loading>
    <MapController @zoomIn="zoomIn" @zoomOut="zoomOut" @resetMap="resetMap"></MapController>
    <SideBarNav 
      @searchCounty="searchCountyMapHandler" 
      @searchCity="searchCityMapHandler"
      @flyToShop="flyToShopHandler"
      @streetKey="searchStreetHandler"
      @filterShop="filterShopHandler"
      @userLocation="userLocationHandler"
      :shopData="maskShopMarkerHandler"
    >
    </SideBarNav>
  </div>
</template>

<script>
import MapController from "@/components/MapController.vue"
import SideBarNav from '@/components/SideBarNav.vue'
import Loading from '@/components/Loading.vue'
import { getMaskInfo } from '@/api/api.js'
export default {
  name: "maskmap",
  components: {
    MapController,
    SideBarNav,
    Loading
  },
  data(){
    return {
      map: null,
      OSMUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      maskData: [],
      county: '桃園市',
      city: '中壢區',
      street: '',
      markers: [],
      filterObj: {
        adult: true,
        child: true
      },
      isLoading: false
    }
  },
  computed:{
    countyMarkerHandler(){
      const find = this.maskData.filter(item => {
        let c = item.properties.county
        let t = item.properties.town
        let a = item.properties.address
        return this.county === c && this.city === t && a.indexOf(this.street) !== -1
      })
      return find
    },
    filterMaskMarkerHandler(){
      const find = this.countyMarkerHandler.filter(item => {
        let a = item.properties.mask_adult
        let c = item.properties.mask_child
        if(this.filterObj.adult) return !!a
        else if (this.filterObj.child) return !!c
        return a > 0 && c > 0
      })
      return find
    },
    maskShopMarkerHandler(){
      return this.filterObj.adult || this.filterObj.child ? this.filterMaskMarkerHandler : this.countyMarkerHandler 
    },
    getIdHandler(){
      const d = this.maskData.filter(item => {
        return !item.properties.town
      })
      return d
    }
  },
  mounted() {
    this.setMapHandler()
    this.getMaskMapData()
  },
  methods : {
    async getMaskMapData(){
      this.isLoading = true
      try {
        const res = await getMaskInfo()
        if(res.status === 200){
          this.maskData = res.data.features
          this.isLoading = false
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
    flyToPositionHandler(){
      const coordinates = this.countyMarkerHandler[0].geometry.coordinates
      let zoom = !this.street ? zoom = 14 : zoom = 16 
      this.map.flyTo([coordinates[1],coordinates[0]], zoom)
    },
    flyToShopHandler(p,id){
      this.map.setView([p[1],p[0]], 18)
      setTimeout(()=>{
        const data  = this.markers.filter(item => item.options.id === id)
        data[0].openPopup()
      }, 1000)
    },
    openPopUpHandler(id){
      const data  = this.markers.filter(item => item.options.id === id)
      data[0].openPopup()
    },
    addMarker() {
      const cluster = this.$utils.map.createMakerCluster();
      let method = this.filterObj.adult || this.filterObj.child ?
                    this.filterMaskMarkerHandler : 
                    this.countyMarkerHandler 
      method.forEach(item => {
        let d = {
          coordinates : item.geometry.coordinates,
          info : item.properties
        }
        let colorIcon = this.$utils.map.blueIcon
        if(!d.info.mask_adult && !d.info.mask_child){
          colorIcon = this.$utils.map.greyIcon
        }
        let maker = this.$utils.map.createMakerByLatLng([d.coordinates[1],d.coordinates[0]],{icon:colorIcon,id:d.info.id})
        cluster.addLayer(maker.bindPopup(this.addPopupHandler(d)))
        this.markers.push(maker.bindPopup(this.addPopupHandler(d)))
      });
      this.map.addLayer(cluster)
    },
    addPopupHandler(d){
      let dynamicAdultClass = 'tooltip--mask'
      let dynamicChildClass = 'tooltip--mask'
      !d.info.mask_adult ? dynamicAdultClass = 'tooltip--mask-none' : dynamicAdultClass = 'tooltip--mask'
      !d.info.mask_child ? dynamicChildClass = 'tooltip--mask-none' : dynamicChildClass = 'tooltip--mask'
      let p = 
      `
      <h2>${d.info.name}</h2>
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
      this.markers = []
      this.addMarker()
      this.flyToPositionHandler()
    },
    searchStreetHandler(key){
      this.street = key
      this.flyToPositionHandler()
    },
    filterShopHandler(adult,child){
      this.filterObj = { adult, child}
    },
    userLocationHandler(location){
      this.userLocation = location
      let colorIcon = this.$utils.map.greyIcon
      let user = this.$utils.map.createMakerByLatLng([this.userLocation[0],this.userLocation[1]],{icon:colorIcon})
      this.map.addLayer(user.bindPopup('我的目前位置'))
      this.map.flyTo([this.userLocation[0],this.userLocation[1]], 15)
      user.openPopup()
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
  color : green;
  font-weight: bold;
  font-size: 14px;
}
</style>
