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

<style lang=less>
.map_icon{
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    border-radius: 50% 50% 50% 0;
    text-align: center;
    color:#fff;
    &.b{
        background-color: #292929;
    }
    &.b_plus{
        background-color: #409eff;
    }
}
</style>