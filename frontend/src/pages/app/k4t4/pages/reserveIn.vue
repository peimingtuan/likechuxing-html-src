<template>
    <div class="reserveIn">
        <!--地图容器-->
        <div ref="map" class="map-container"></div>
        <div class="big shadow" @click="toManual">通勤车使用指南</div>
        <!--大头针-->
        <FlagPin ref="pin"/>
        <div class="fun-widget">
            <div class="footer-control">
                <div class="icon-func icon loc shadow" @click="getLocation"></div>
                <DatePicker :data="majorBoxData" @getTimeStamp="getTimeStamp"/>
                <MajorBox :data="majorBoxData" @toEndBranch="toEndBranch"/>
                <BottomBar :type="bottomBarType"  @btnClick="useCar"/>
            </div>
        </div>
    </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import FlagPin from '../components/flagPin'
  import BottomBar from '../components/BottomBar'
  import MajorBox from '../components/MajorBox'
  import DatePicker from '../components/DatePicker'
  import SDK from '../js/SDK.polyfill'

  import appArguments from '../../../../../other_modules/app-arguments'
  import {MAP_MAIN} from "../js/mapControl";
  import POI from '../js/class/POI'
  import {Alert, Toast, Loading} from '../../../../../other_modules/vue-plugins/like-base/'
  import {appMutual} from '../../../../../other_modules/app-mutual/'
 
  const mainMap = new MAP_MAIN()

  export default {
    components: {
      FlagPin,
      BottomBar,
      MajorBox,
      DatePicker
    },
    computed: {
      ...mapState([
        'uuid',
        'sign',
        'user_lng',
        'user_lat',
        'branches_out',
        'branch_start',
        'branch_end',
        'mapCenter',
        'bookTime'
      ]),
      ...mapGetters([
        'user_poi',
        'branch_out_list_nearby',
        'bottomBarType',
        'majorBoxData'
      ]),
      btnDisabled(){
        return !Boolean(this.branch_start && this.branch_end && this.bookTime)
      }
    },
    methods: {
      toManual(){
        this.$router.push('/detail')
      },
      getLocation () {
        SDK.getLocation().then(poi=>{
          this.$store.commit('setUserLngLat',poi)

          mainMap.drawUserLoc(poi,true)
        })
      },
      toEndBranch(){
        this.$store.commit('setMapCenterEndBranch',this.mapCenter)

        this.$router.push({
          path:'/endBranch',
          query:{
            // target = in/out来告诉endBranch页面是显示限行范围内还是外的网点
            target:'in'
          }
        })
      },
      useCar(){
        if(!this.bookTime){
          Alert({
              icon:'warn',
              msg:'请选择预订时间',
              confirmButtonText:'确定'
          })
          return
        }
        if(!this.branch_start){
          Alert({
              icon:'warn',
              msg:'请选择取车网点',
              confirmButtonText:'确定'
          })
          return
        }
        if(!this.branch_end){
          Alert({
              icon:'warn',
              msg:'请选择还车网点',
              confirmButtonText:'确定'
          })
          return
        }
        this.$store.dispatch('orderCar').then(res=>{
          console.log(res)
          if(res.status===0){
            Toast({
              msg:res.msg,
              toastCallback:()=>{
                appMutual.send.indexRefresh({
                  destroy_current:0
                })
                this.$router.replace('/reservedPage')
              }
            })
          }else if(res.status===1018){
            this.$store.commit('setIsPost',false)
            Toast({
              msg:res.msg,
              toastCallback:()=>{
                appMutual.send.indexRefresh({
                  destroy_current:0
                })
                this.$router.replace('/reservedPage')
              }
            })
          }else{
            this.$store.commit('setIsPost',false)
            Alert({
              icon:'warn',
              msg:res.msg,
              confirmButtonText:'确定'
            })
          }
        }).catch(err=>{
          console.log(err)
        })
        // this.$router.push('/reservedPage')
      },
      getTimeStamp(e){
        this.$store.commit('setBookTime',e)
      },
      // 点击网点图标的回调
      branchClick (branch) {
        this.$store.commit('setBranchStart',branch)
        mainMap.drawBranch({
          list:this.branch_out_list_nearby,
          active_branch:this.branch_start,
          marker_click:this.branchClick,
          hide_cnt:true
        })
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

      this.$store.dispatch('getBranchesOut').then(()=>{
        mainMap.drawBranch({
          list:this.branch_out_list_nearby,
          active_branch:this.branch_start,
          marker_click:this.branchClick,
          hide_cnt:true
        })
      }).catch(err=>{
        Toast(err.msg)
      })
    },
    mounted () {
      mainMap.initMap(this.$refs.map, {
        resizeEnable: true,
        zoom: 15,
        center: this.user_poi.getLngLat(),
        onDragEnd: (poi) => {
          // 拖动地图结束后的回调
          this.$refs.pin.jump()
          this.$store.commit('setMapCenter',poi)
          mainMap.drawBranch({
            list:this.branch_out_list_nearby,
            active_branch:this.branch_start,
            marker_click:this.branchClick,
            hide_cnt:true
          })
        }
      })
      // 画用户位置
      mainMap.drawUserLoc(this.user_poi)
    }
  }
</script>

<style lang=less>
    .reserveIn {
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
        .big{
            box-sizing: border-box;
            background-color: #fff;
            font-size: .14rem;
            color: #454545;
            position: fixed;
            top:0.18rem;
            right:0;
            z-index: 2;
            display: flex;
            align-items: center;
            width: 1.43rem;
            height: .34rem;
            padding-left: .15rem;
            border-radius: 0.17rem 0 0 0.17rem;
            &::after{
              content:'';
              position: absolute;
              right: .1rem;
              top: .1rem;
              width: .14rem;
              height:.14rem;
              background: url('../images/intro.png') no-repeat;
              background-size: 100% 100%;
            }
        }
        .icon-func {
            width: 0.3rem;
            height: 0.3rem;
            position: absolute;
            left: auto;
            right: 0.1rem;
            top: -0.3rem;
            background: url('../images/location.jpg') no-repeat center;
            background-size: 100%;
            position: absolute;
            left: auto;
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