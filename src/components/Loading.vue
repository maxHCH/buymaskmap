<template>
  <div class="loading-page">
    <VContainer>
      <VRow 
        class="fill-height loading-page-pos"
        align-content="center"
        justify="center"
        >
        <VCol class="subtitle-1 text-center loading-page--text" cols="12">
          載入中...
        </VCol>
        <VCol cols="6">
          <VProgressLinear 
            color="light-blue accent-4"
            indeterminate
            rounded
            height="6">
          </VProgressLinear>
        </VCol>
      </VRow>
    </VContainer>
  </div>
</template>

<script>
import { VProgressLinear, VContainer, VRow, VCol} from 'vuetify/lib'
export default {
  name: 'loading',
  components:{
    VProgressLinear,
    VContainer,
    VRow,
    VCol
  }
}
</script>

<style lang="scss" scope>
  .loading-page{
    z-index: 9999;
    position: absolute;
    top: 50%;
    min-width: 100%;
    height: 100%;
    background-color: #f8f8f8a3;
    transform: translate(0, -50%);
  }
  .loading-page--text{
    color: rgb(83, 83, 83);
    font-size: 16px;
  }
  .loading-page-pos {
    margin-top: 20%;
  }
</style>