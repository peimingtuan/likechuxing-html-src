<template>
    <div ref="map" class="map"></div>
</template>

<script>
  import mapControl from '../js/mapControl'


  export default {
    name: "mapCon",
    mounted () {
      mapControl.initMap(this.$refs.map)
    }
  }
</script>

<style lang=less scoped>
    .map {
        width: 100vw;
        height: 100vh;
    }
</style>