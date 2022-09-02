<template>
    <div class="dispatchOut">
        <!--地图容器-->
        <div ref="map" class="map-container"></div>
        <!--大头针-->
        <FlagPin ref="pin"/>

        <div class="icon-func big shadow" @click="toManual">
            <span class="qes">通勤车使用指南</span></div>
        <div class="fun-widget">
            <div class="footer-control">
                <div class="icon-func icon loc shadow" @click="getLocation"></div>
                <MinorBox :cars="cars" @changeCar="changeCar"/>
                <MajorBox :data="majorBoxData" @toEndBranch="toEndBranch"/>
                <BottomBar :type="bottomBarType" @btnClick="orderCar" />
            </div>
        </div>

    </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import FlagPin from '../components/flagPin'
  import BottomBar from '../components/BottomBar'
  import MajorBox from '../components/MajorBox'
  import MinorBox from '../components/MinorBox'
  import SDK from '../js/SDK.polyfill'

  import appArguments from '../../../../../other_modules/app-arguments'
  import {MAP_MAIN} from "../js/mapControl";
  import POI from '../js/class/POI'
  import {Alert, Toast, Loading} from '../../../../../other_modules/vue-plugins/like-base/'
  import {appMutual} from '../../../../../other_modules/app-mutual/'

  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'

  const mainMap = new MAP_MAIN()

  export default {
    name: "dispatchOut",
    data(){
      return {
        dispatchOut:[15,22],
      }
    },
    components: {
      FlagPin,
      BottomBar,
      MajorBox,
      MinorBox
    },
    computed: {
      ...mapState([
        'uuid',
        'sign',
        'user_lng',
        'user_lat',
        'branch_start',
        'branch_end',
        'cars',
        'car_current',
        'mapCenter'
      ]),
      ...mapGetters([
        'user_poi',
        'branch_in_list_nearby',
        'bottomBarType',
        'majorBoxData'
      ])
    },
    methods: {
      orderCar(){
        let data = {
          begin_branch_id:this.branch_start.id,
          price_km:this.car_current.price_km,
          price_min:this.car_current.price_min,
          price_extra:this.car_current.price_extra,
          car_id:this.car_current.id
        }
        if(this.branch_end)data.end_branch_id = this.branch_end.id

        let loading = this.$_LIKE_loading()
        this.$store.dispatch('orderCar',data).then(res=>{
          loading.close()
          appMutual.send.indexRefresh({
            destroy_current:1
          })
        }).catch(err=>{
          loading.close()
          if(err.msg){
            Toast(err.msg)
          }
        })
      },

      toEndBranch(){
        this.$store.commit('setMapCenterEndBranch',this.mapCenter)

        this.$router.push({
          path:'/endBranch',
          query:{
            // target = in/out来告诉endBranch页面是显示限行范围内还是外的网点
            target:'out'
          }
        })
      },

      getLocation () {
        SDK.getLocation().then(poi=>{
          this.$store.commit('setUserLngLat',poi)

          mainMap.drawUserLoc(poi,true)
        })
      },

      // 点击网点图标的回调
      branchClick (branch) {
        let car_cnt = Number(branch.car_cnt)

        if(car_cnt>0){
          this.$store.commit('setBranchStart',branch)
          this.$store.dispatch('getCars',branch.id).catch(err=>{
            if(err && err.msg){
              Toast(err.msg)
            }
          })
        }else{
          this.$store.commit('setBranchStart',null)
          this.$store.commit('setCars',[])
          this.$store.commit('setCarCurrent',null)
          Toast('该网点暂无车辆，试试别的网点吧')
        }

        mainMap.drawBranch({
          list:this.branch_in_list_nearby,
          active_branch:car_cnt>0?this.branch_start:null,
          marker_click:this.branchClick
        })
      },

      changeCar(car){
        this.$store.commit('setCarCurrent',car)
      },

      toManual(){
        this.$router.push('/detail')
      }
    },
    created(){
      this.$store.commit('setBase',{
        uuid: appArguments.uuid,
        sign: appArguments.sign,
        user_lng: appArguments.user_lng || '',
        user_lat: appArguments.user_lat || '',
        city_id: appArguments.city_id,
        mapCenter:new POI(appArguments.user_lng,appArguments.user_lat)
      })

      this.$store.dispatch('getBranchesIn').then(()=>{
        mainMap.drawBranch({
          list:this.branch_in_list_nearby,
          active_branch:this.branch_start,
          marker_click:this.branchClick
        })
      }).catch(err=>{
        if(err && err.msg ){
          Toast(err.msg)
        }
      })
    },
    mounted () {
      myAjax.getting.then(()=>{
        let time_current = new Date((Math.floor(new Date().getTime() / 1000) + myAjax.time_offset)*1000)
        let hours = time_current.getHours()
        if(hours <this.dispatchOut[0] || hours >= this.dispatchOut[1]){
          this.$_LIKE_alert({
            icon:'tips',
            msg:'晚通勤车取车时间为每天 '+this.dispatchOut[0]+':00 ~ '+this.dispatchOut[1]+':00，欢迎准时参加',
            confirmButtonText:'好的',
            confirmButtonCallback:function(){
                  appMutual.jump.indexAndCloseThisWebview()
            }
          })
        }
      })
      mainMap.initMap(this.$refs.map, {
        resizeEnable: true,
        zoom: 15,
        center: this.user_poi.getLngLat(),
        onDragEnd: (poi) => {
          // 拖动地图结束后的回调
          this.$refs.pin.jump()
          this.$store.commit('setMapCenter',poi)
          mainMap.drawBranch({
            list:this.branch_in_list_nearby,
            active_branch:this.branch_start,
            marker_click:this.branchClick
          })
        }
      })
      // 画用户位置
      mainMap.drawUserLoc(this.user_poi)
    }
  }
</script>

<style lang=less>
    .dispatchOut {
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
            position: absolute;
            left: auto;
            &.loc{
                width: 0.3rem;
                height: 0.3rem;
                right: 0.1rem;
                top: -0.3rem;
                background: url('../images/location.jpg') no-repeat center;
                background-size: 100%;
            }
            &.big{
                box-sizing: border-box;
                background-color: #fff;
                font-size: .14rem;
                color: #454545;
                position: absolute;
                top:0.18rem;
                right:0;
                z-index: 2;
                display: flex;
                align-items: center;
                padding: .1rem .1rem .1rem .15rem;
                border-radius: 0.17rem 0 0 0.17rem;
                .qes{
                    margin-top:2px;
                    display: inline-block;
                    vertical-align: bottom;
                    line-height: 1.3;
                    padding-right: 0.2rem;
                    background: url('../images/intro.png') no-repeat right;
                    background-size: auto 90%;
                }
            }
        }

        .footer-control {
            z-index: 2;
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            background:url('../images/back.png') repeat-x center;
            background-size: auto 100%;
            //background: linear-gradient(-180deg, transparent 0%, #fff 70%);
            padding: 0 0.1rem 0.1rem;
            .slide-con {
                position: relative;
                z-index: 1;
            }

        }
    }
</style>