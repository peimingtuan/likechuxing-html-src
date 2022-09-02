<template>
    <div class="Main">
        <div ref="map" class="map"></div>
        <ControlBox/>
    </div>
</template>

<script>
    import mapControl from './js/mapControl'
    import ControlBox from './component/controlBox'

  export default {
    name: "index",
    components:{
      ControlBox
    },
    mounted(){
        mapControl.initMap(this.$refs.map)
    }
  }
</script>

<style lang="less">
    .Main{
        .map{
            width: 100%;
            height: 100vh;
        }
    }
</style>