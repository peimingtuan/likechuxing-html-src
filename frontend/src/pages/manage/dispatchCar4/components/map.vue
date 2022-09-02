<template>
    <div ref="map" class="map"></div>
</template>

<script>
  import mapControl from '../js/mapControl'
  import {mapState} from 'vuex'

  export default {
    name: "mapCon",
    computed: {
      ...mapState(['baseArea'])
    },
    mounted () {
      let notify = this.$notify({
        message: '加载地图中...',
        duration: 0
      })
      mapControl.initMap(this.$refs.map).then(() => {
        notify.close()
      })
    }
  }
</script>

<style lang=less scoped>
    .map {
        width: 100vw;
        height: 100vh;
    }
</style>