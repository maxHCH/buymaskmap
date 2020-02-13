<template>
  <div class="side-bar">
    <v-row>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          :items="countyHandler"
          label="縣市"
          solo
          dense
          v-model="county"
          @change="searchCountyHandler"
        />
      </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <v-select
          :items="cityList"
          label="鄉鎮市"
          solo
          dense
          v-model="city"
          @change="searchCityHandler"
          :loading="!cityList"
        />
      </v-col>
      <v-col class="d-flex" cols="12" sm="12">
        <v-text-field
          label="搜尋街道名稱 ex:中山東路"
          :disabled="!city"
          single-line
          solo
          v-model.trim="streetKey"
          @keyup.enter="searchStreetHandler"
        >
        </v-text-field>
      </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <v-switch 
          v-model="adultMask" 
          class="mt-0 pt-0 ml-2" 
          label="有成人口罩" 
          @change="filterShopHandler"
        >
        </v-switch>
      </v-col>
      <v-col class="d-flex" cols="12" sm="6">
        <v-switch
          v-model="childMask"
          class="mt-0 pt-0 ml-2" 
          label="有兒童口罩" 
          @change="filterShopHandler"
        >
        </v-switch>
      </v-col>
    </v-row>
    <v-divider light></v-divider>
    <v-row>
      <v-col col="12" sm="12" class="text-right side-bar--text">篩選出 {{ this.shopNumberHandler }} 家</v-col>
      <v-col cols="12" sm="12" v-for="item in shopData" :key="item.properties.id">
        <v-card class="mx-auto">
          <v-card-text>
            <h3>{{item.properties.name}}</h3>
            <p>{{item.properties.address}}</p>
            <p>{{item.properties.phone}}</p>
            <p :class="!item.properties.mask_adult?'card-color-none':'card-color-stock'">
              成人口罩剩餘：{{ item.properties.mask_adult }}
            </p>
            <p :class="!item.properties.mask_child?'card-color-none':'card-color-stock'">
              兒童口罩剩餘：{{ item.properties.mask_child }}
            </p>
            <p>
              店家備註： {{ !item.properties.note ? 
                          item.properties.service_note : item.properties.note 
                        }}
            </p>
            <p>最後更新時間：{{ item.properties.updated }}</p>
          </v-card-text>
          <v-btn 
          color="blue"
          dark class="mb-4 ml-4"
          @click="submitCoordinates(item.geometry.coordinates,item.properties.id)"
          >
            查詢地圖位置
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { VSelect, VRow, VCol, VTextField, VDivider, VCard, VCardText, VBtn, VSwitch} from 'vuetify/lib'
import { getCountyInfo } from '@/api/api.js'
export default {
  name: 'SideBarNav',
  components: {
    VSelect,
    VRow,
    VCol,
    VTextField,
    VDivider,
    VCard,
    VCardText,
    VBtn,
    VSwitch
  },
  props:{
    shopData: {
      type: Array,
      required: true,
    }
  },
  data(){
    return{
      info: [],
      county: '桃園市',
      city: '中壢區',
      streetKey: '',
      adultMask: true,
      childMask: true,
      cityList: []
    }
  },
  computed: {
    countyHandler(){
      const data = this.info.map( item => item.CityName) 
      return data
    },
    cityBaseHandler(){
      const data = this.info.filter( item => {
        return item.CityName === this.county
      })
      return data
    },
    shopNumberHandler(){
      return this.shopData.length
    }
  },
  mounted(){
    this.getCountyData()
  },
  methods:{
    async getCountyData(){
      try {
        const res = await getCountyInfo()
        if(res.status === 200){
          this.info = res.data
          this.getCityList()
        }
      }catch (error) {
        throw new Error(error)
      }
    },
    getCityList(){
      const data = this.cityBaseHandler[0].AreaList.map( item => {
        return item.AreaName
      })
      this.cityList = data
    },
    searchCountyHandler(){
      this.getCityList()
      this.$emit('searchCounty',this.county)
    },
    searchCityHandler(){
      this.$emit('searchCity',this.city)
    },
    searchStreetHandler(){
      this.$emit('streetKey',this.streetKey)
    },
    filterShopHandler(){
      this.$emit('filterShop',this.adultMask,this.childMask)
    },
    submitCoordinates(position,id){
      this.$emit('flyToShop',position,id)
    }
  }
}
</script>

<style lang="scss" scope>
.side-bar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  max-width: 350px;
  height: 100vh;
  padding: 20px;
  background-color: rgb(243, 242, 242);
  overflow-y: scroll;
  overflow-x: hidden;
  .side-bar--select {
    cursor: pointer;
    display: inline-block;
    position: relative;
    font-size: 16px;
  }
}
.card-color-none {
  color: red
}
.card-color-stock {
  color: green
}
.side-bar--text {
  color: rgba(0, 0, 0, 0.6);
}
</style>