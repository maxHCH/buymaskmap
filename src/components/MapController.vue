<template>
  <div class="map-navigation">
    <ul>
      <li @click="$emit('zoomIn')">+</li>
      <li @click="$emit('resetMap')">•</li>
      <li @click="$emit('zoomOut')">-</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MapController",
};
</script>

<style lang="scss" scope>
.map-navigation {
  position: absolute;
  right: 30px;
  top: 20px;
  z-index: 999;
  width: 30px;
  box-shadow: 0px 0px 50px 2px rgba(0, 0, 0, 0.35);
  background-color: #fff;
  ul {
    padding: 0;
    padding-left: 0 !important; 
    margin: 0;
    list-style: none;

    li {
      width: 30px;
      height: 28px;
      font-size: 16px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
    }
    li:hover {
      background-color: rgb(246, 249, 255);
      
    }
  }
}
</style>