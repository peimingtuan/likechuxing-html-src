<template>
    <div class="Main">
        <Map />
        <ControlBox />
        <SliderBar v-if="show_slider && hotData.length > 0"/>
    </div>
</template>

<script>
  import Map from './components/map'
  import ControlBox from './components/controlBox'
  import SliderBar from './components/SlideBar'

  import {mapState} from 'vuex'

  export default {
    name: "index",
    computed:{
      ...mapState(['hotData','show_slider'])
    },
    components:{
      Map,
      ControlBox,
      SliderBar
    }
  }
</script>

<style lang=less scoped>

</style>