<template>
    <div class="Main">
        <Map />
        <ControlBox />
    </div>
</template>

<script>
  import Map from './components/map'
  import ControlBox from './components/controlBox'

  export default {
    name: "index",
    components:{
      Map,
      ControlBox
    }
  }
</script>

<style lang=less scoped>

</style>