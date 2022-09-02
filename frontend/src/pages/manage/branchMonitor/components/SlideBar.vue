<template>
    <el-card class="box-card sliderBar" :body-style="style">
        <span class="box">
            <el-slider
                    class="slider"
                    v-model="value"
                    :max="23"
            />
        </span>
        <span class="box time">时间：{{value}}:00</span>
    </el-card>
</template>

<script>
  import {mapState} from 'vuex'
  import mapControl from '../js/mapControl'

  export default {
    name: "SlideBar",
    data(){
      return {
        style:{
          padding:'0px 20px'
        }
      }
    },
    computed:{
      value:{
        get(){
          return this.$store.state.current_time
        },
        set(val){
          mapControl.drawHot(this.$store.state.hotData[val])
          this.$store.commit('setCurrentTime',val)
        }
      },

    },
    update(){
      console.log(this.value)
    }
  }
</script>

<style lang=less scoped>
.sliderBar{
    position: absolute;
    bottom:20px;
    left:10px;
    opacity: 0.8;
    .box{
        display: inline-block;
        line-height: 38px;
        vertical-align: middle;
        &.time{
            padding-left: 15px;
        }
    }
    .slider{
        width: 300px;
        height: 40px;
    }
}
</style>