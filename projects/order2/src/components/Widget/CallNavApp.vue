<template>
    <SlideUpContainer class="CallNavApp" :show="show" @close="afterLeave">
      <div class="fun-con">
        <div class="box recommend" @click="openGaode">高德导航</div>
        <div class="box" @click="openBaidu">百度导航</div>
        <div class="box cancel" @click="closeWindow">取消</div>
      </div>
    </SlideUpContainer>
</template>

<script>
  import {mapState} from 'vuex'
  import SlideUpContainer from '../SlideUpContainer/slideUpContainer'
  import coordtransform from 'coordtransform'

  export default {
    components:{
      SlideUpContainer
    },
    data() {
      return {
        show:false
      }
    },
    computed:{
      ...mapState('Widget',{
        des_lng:state=>state.lng,
        des_lat:state=>state.lat
      }),
      ...mapState('user',[
        'lat',
        'lng'
      ])
    },
    mounted(){
      this.show = true
    },
    methods: {
      openGaode(){
        callMap.call({
          origin:[this.lng,this.lat],
          destination:[this.des_lng,this.des_lat]
        })
      },
      openBaidu(){
        let poi = coordtransform.gcj02tobd09(this.lng,this.lat)
        let des_poi = coordtransform.gcj02tobd09(this.des_lng,this.des_lat)
        window.open("baidumap://map/direction?origin="+poi[1]+','+poi[0]+"&destination="+des_poi[1]+','+des_poi[0]+"&mode=driving")
      },
      afterLeave() {
        this.$store.dispatch('Widget/toggle','callNavApp')
      },
      closeWindow() {
        this.show = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .CallNavApp {
    position: absolute;
    z-index: 90;

    .fun-con {
      background-color: #f2f2f2;
      .box {
        background-color: #fff;
        line-height: 0.48rem;
        &:nth-of-type(1) {
          border-bottom: solid 1px #f2f2f2;
        }
        &.cancel {
          margin-top: 0.06rem;
        }
        &.recommend::after{
          content: '';
          position: absolute;
          top:0.14rem;
          left:50%;
          margin-left: 2.4em;
          display: block;
          width: 0.36rem;
          height: 0.2rem;
          background: url(../../assets/images/recommond.png) no-repeat center;
          background-size: 100% auto;
        }
      }
    }
  }

</style>
