<template>
    <div class="Main">
        <Map></Map>
        <ControlBar />
        <ValueDisplay />
    </div>
</template>

<script>
  import Map from './components/map'
  import ControlBar from './components/controlBar'
  import ValueDisplay from './components/valueDisplay'

  export default {
    name: "index",
    components:{
      Map,
      ValueDisplay,
      ControlBar
    },
    created(){
      this.$store.dispatch('getCity')
    }
  }
</script>

<style lang=less scoped>

</style>