<template>
  <div class="Index">
    <div class="PAGE">
      <div id="rental-map" class="map-container"></div>

      <div class="fun-widget">
        <div class="icon-func icon user shadow" @click="toUserCenter"></div>

        <div class="footer-control">
          <div class="icon-func icon tel shadow" @click="tel" v-if="step>0"></div>
          <div class="icon-func icon loc shadow" @click="locationUser"></div>

          <MinorBox/>
          <MajorBox/>
          <BottomBar/>

        </div>
      </div>

      <CallNavApp v-if="show_callNavApp"/>
      <BranchExplain v-if="show_explain"/>
      <CarInfo v-if="show_carInfo"/>
      <CancelBox v-if="show_cancelBox"/>
    </div>
    <router-view class="PAGE"/>
  </div>
</template>

<script>
  import CallNavApp from '../../components/Widget/CallNavApp'
  import BranchExplain from '../../components/Widget/BranchExplain'
  import CarInfo from '../../components/Widget/CarInfo'
  import CancelBox from '../../components/Widget/CancelBox'

  import BottomBar from '../../components/Page/BottomBar'
  import MajorBox from '../../components/Page/MajorBox'
  import MinorBox from '../../components/Page/MinorBox'

  import POI from '../../common/class/POI'
  import {mapState, mapGetters} from 'vuex'

  export default {
    components: {
      CallNavApp,
      BranchExplain,
      CarInfo,
      CancelBox,
      MajorBox,
      MinorBox,
      BottomBar
    },
    computed: {
      ...mapState('Widget', [
        'show_explain',
        'show_carInfo',
        'show_callNavApp',
        'show_cancelBox'
      ]),
      ...mapState('branch', [
        'active_branch',
        'end_branch',
        'city_icon'
      ]),
      ...mapGetters('branch', [
        'branch_list_nearby'
      ]),
      ...mapGetters('user', [
        'user_poi'
      ]),
      ...mapState('user', [
        'is_login'
      ]),
      ...mapState('rental', [
        'step',
        'rental'
      ])
    },
    methods: {
      locationUser() {
        let that = this
        this.$store.dispatch('user/location').then(() => {
          rentalMap.drawUserLoc(that.user_poi, true)
        })
      },
      tel() {
        SDK.makePhoneCall('4006662333')
      },

      toUserCenter: function () {
        this.$router.push({
          path:'/user'
        })
      },
    },
    mounted: function () {
      this.$store.dispatch('rental/startAuto').then(()=>{
        rentalMap.initMap('rental-map', {
          resizeEnable: true,
          zoom: 15,
          // 当前位置为中心
          center: this.user_poi.getLngLat()
        })
        // 画用户位置
        rentalMap.drawUserLoc(this.user_poi)

        if(Boolean(this.step > 2 && this.end_branch)){
          rentalMap.drawEndBranch(this.end_branch)
        }else{
          rentalMap.drawStartBranch(this.active_branch)
        }
      })
    },
    beforeDestroy() {
      rentalMap.destroy()
      this.$store.dispatch('rental/stopAuto')
    }
  }
</script>

<style lang="less" scoped>
  .Index {
    .map-container {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .datouzhen {
      position: absolute;
      bottom: 60%;
      left: 50%;
      margin-left: -0.16rem;
      width: 0.32rem;
      height: 0.32rem;
      z-index: 2;
      pointer-events: none;
      background: url('../../assets/images/datouzhen.png') no-repeat center;
      background-size: auto 100%;
    }
    .icon {
      z-index: 2;
    }
    .icon-func {
      width: 0.3rem;
      height: 0.3rem;
      position: absolute;
      top: 0.1rem;
      left: 0.1rem;
      background: no-repeat center;
      background-size: 100%;
      &.tel {
        left: auto;
        right: 0.1rem;
        top: -0.66rem;
        background-image: url('../../assets/images/help_tel.jpg');
      }
      &.loc {
        left: auto;
        right: 0.1rem;
        top: -0.3rem;
        background-image: url('../../assets/images/location.jpg');
      }
      &.user {
        background-image: url('../../assets/images/user.jpg');
      }
    }

    .footer-control {
      z-index: 2;
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(-180deg, transparent 0%, #fff 70%);
      padding: 0 0.1rem 0.1rem;
      .slide-con {
        position: relative;
        z-index: 1;
      }

    }
  }
</style>
