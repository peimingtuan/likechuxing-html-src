<template>
    <div class="like-map" ref="map"></div>
</template>

<script>
  import mapControl from '../mapControl'

  export default {
    name: "likeMap",
    props: {
      center: {required: true},
      showCurrent: {default: false}
    },
    mounted () {
      mapControl.init({
        elem: this.$refs.map,
        center: this.center,
        showCurrent: this.showCurrent
      })
    }
  }
</script>

<style lang=less scoped>
    .like-map {
        width: 100%;
        height: 100%;
    }
</style>