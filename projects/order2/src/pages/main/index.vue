<template>
  <div class="Index">
    <div class="PAGE">
      <div ref="map" class="map-container"></div>
      <FlagPin ref="pin" :show="show_flag"/>

      <div class="fun-widget">
        <div class="icon-func icon user shadow" @click="toUserCenter"></div>

        <div class="footer-control">
          <div class="icon-func icon tel shadow" @click="tel" v-if="step>0"></div>
          <div class="icon-func icon loc shadow" @click="locationUser"></div>

          <MinorBox/>
          <MajorBox/>
          <BottomBar type="index"/>

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
  import FlagPin from '../../components/flagPin/index'

  import {mapState, mapGetters} from 'vuex'
  import {mainMap} from "../../common/mapControl";

  export default {
    components: {
      CallNavApp,
      BranchExplain,
      CarInfo,
      CancelBox,
      MajorBox,
      MinorBox,
      BottomBar,
      FlagPin
    },
    data() {
      return {
        // 显示大头针
        show_flag: false
      }
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
        'city_icon',
        'chose_city_id'
      ]),
      ...mapGetters('branch', [
        'branch_list_nearby'
      ]),
      ...mapGetters('user', [
        'user_poi'
      ]),
      ...mapState('user', [
        'is_login',
        'city_id'
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
          mainMap.drawUserLoc(that.user_poi, true)

          // 当前定位a城市，点icon到b城市，再点定位回a城市时把数据切回a城市
          if (Number(this.city_id) !== Number(this.chose_city_id)) {
            this.$store.commit('branch/setChoseCity', this.city_id)
            this.$store.commit('branch/setFlagLoc', null)
            this.$store.commit('branch/branchChosenClear')

            this.$store.dispatch('branch/getBranchList',{
              city_id:this.city_id
            }).then(res => {
              mainMap.drawBranch(this.branch_list_nearby)
            })
          }
        })
      },
      tel() {
        SDK.makePhoneCall('4006662333')
      },
      toUserCenter: function () {
        if (this.is_login) {
          this.$router.push({
            path: '/user'
          })
        } else {
          this.$router.push({
            path: '/user/login',
            query: {
              next: 'userCenter'
            }
          })
        }
      },
      indexInit() {
        let that = this

        // 获取用户定位
        this.$store.dispatch('user/location').then(() => {

          mainMap.initMap(that.$refs.map, {
            resizeEnable: true,
            zoom: 15,
            center: this.user_poi.getLngLat(),
            onDragEnd: (poi) => {
              that.$refs.pin.jump()
              that.$store.commit('branch/setFlagLoc', poi)
              mainMap.drawBranch(that.branch_list_nearby)
            }
          })
          // 画用户位置
          mainMap.drawUserLoc(this.user_poi)

          if (this.is_login) {
            this.$store.dispatch('user/checkUserRental').catch(err=>{
              if(err.msg && err.msg !== ''){
                this.$_LIKE_toast(err.msg)
              }
            })
          }

        }).then(() => {
          // 获取附近网点
          return this.$store.dispatch('branch/getBranchList',{
            city_id:this.city_id
          }).then(() => {
            // 画附近网点
            mainMap.drawBranch(this.branch_list_nearby)

            // 画大头针
            this.show_flag = true
          })

        }).then(() => {
          // 获取城市icon
          return this.$store.dispatch('branch/getCityIcon').then(() => {
            mainMap.drawCityIcon(this.city_icon)
          })

        }).catch(err => {

          if (err.hasOwnProperty('error') && err.error === 4) {
            this.$_LIKE_alert({
              title: '提示',
              msg: '立刻出行需要获取您的位置才能提供服务',
              confirmButtonCallback: function () {
                that.indexInit()
              }
            })
          } else {
            if(err.msg && err.msg!==''){
              this.$_LIKE_toast(err.msg)
            }
          }

        })
      }
    },
    mounted: function () {
      let href = window.location.href
      history.replaceState({}, 'index', '/close')
      history.pushState({}, 'this', href)

      this.indexInit()
    },
    beforeDestroy() {
      mainMap.destroy()
    }
  }
</script>

<style lang="less" scoped>
  .Index {
    .map-container {
      position: absolute;
      width: 100%;
      height: 120%;
      top: -20%;
      z-index: 1;
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
