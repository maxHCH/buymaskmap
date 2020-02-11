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
          label="輸入街道名搜尋"
          single-line
          solo
          v-model.trim="searchKey"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider light></v-divider>
  </div>
</template>

<script>
import { VSelect, VRow, VCol, VTextField,VDivider } from 'vuetify/lib'
import { getCountyInfo } from '@/api/api.js'
export default {
  name: 'SideBarNav',
  components: {
    VSelect,VRow,VCol,VTextField,VDivider
  },
  data(){
    return{
      info: [],
      county: '桃園市',
      city: '中壢區',
      searchKey: '',
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
  min-height: 100%;
  padding: 20px;
  background-color: rgb(243, 242, 242);
  .side-bar--select {
    cursor: pointer;
    display: inline-block;
    position: relative;
    font-size: 16px;
  }
}

</style>