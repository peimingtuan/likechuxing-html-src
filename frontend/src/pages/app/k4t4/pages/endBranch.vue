<template>
  <div class="EndBranch">
    <div ref="map" class="map-container"></div>
    <FlagPin ref="pin" :show="true"/>

    <div class="header-control shadow" @click="toSearchPoint">搜索目的地附近的网点</div>

    <div class="footer-control">
      <div class="icon-func icon loc" @click="locationUser"></div>

      <transition name="custom-classes-transition"
                  enter-active-class="animated faster slideInUp"
                  leave-active-class="animated faster slideOutDown">
        <div v-if="end_branch!==null" class="slide-con">
          <div class="name">
            {{end_branch.name}}
            <div class="icon-btn icon-full" v-if="end_branch.walk_overall_view" @click="toOverall"></div>
          </div>
          <p>{{end_branch.address}}</p>
          <p v-if="end_branch.parking_fee_in!=='0.00'">还车附加费 <span class="warn">{{end_branch.parking_fee_in}}</span> 元</p>
        </div>
      </transition>

      <!--底部提示+按钮栏-->
      <div class="step-box step-0 shadow" v-if="end_branch===null">请在地图上选择还车网点</div>
      <div class="step-box step-0 shadow" v-else>
        <button class="btn btn-primary btn-block" @click="confirmEndBranch">确认选择</button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import {MAP_END_BRANCH} from "../js/mapControl";
  import FlagPin from '../components/flagPin'
  import SDK from '../js/SDK.polyfill'
  import {Alert, Toast, Loading} from '../../../../../other_modules/vue-plugins/like-base/'
  import Gps2distance from '../js/gps2distance'

  const gps2distance = new Gps2distance()

  const endBranchMap = new MAP_END_BRANCH()

  export default {
    name: "end-branch",
    components: {
      FlagPin
    },
    data(){
      return {
        end_branch:null
      }
    },
    computed: {
      ...mapGetters([
        'user_poi'
      ]),
      ...mapState([
        'branches_in',
        'branches_out',
        'mapCenterEndBranch'
      ]),
      branch_list_nearby(){
        // 选择换车网点时的附近列表，可能在限行范围里也可能在显影范围外，分情况
        let branches = this.$route.query.target === 'in' ? this.branches_in : this.branches_out
        return branches.filter(item => {
          return gps2distance.distance([[item.lng, item.lat], this.mapCenterEndBranch.getLngLat()]) <= 5})
      },
    },
    methods:{
      locationUser() {
          SDK.getLocation().then(poi=>{
            this.user_lng = poi.lng
            this.user_lat = poi.lat

            endBranchMap.drawUserLoc(poi,true)
          })
      },
      toOverall() {
        SDK.openWindow(this.end_branch.walk_overall_view)
      },
      confirmEndBranch(){
        this.$store.commit('setBranchEnd',this.end_branch)
        this.$router.go(-1)
      },
      toSearchPoint(){
        this.$router.push('/searchPoint')
      },
      marker_click(branch){
        this.end_branch = branch
      },
      init(){
        let that = this

        endBranchMap.initMap(that.$refs.map, {
          resizeEnable: true,
          zoom: 15,
          // 当前位置为中心
          center: this.mapCenterEndBranch.getLngLat(),
          //定义拖拽事件
          onDragEnd:(poi)=>{
            that.$refs.pin.jump()
            this.$store.commit('setMapCenterEndBranch',poi)
            endBranchMap.drawBranch({
              list:that.branch_list_nearby,
              active_branch:that.end_branch,
              marker_click:that.marker_click
            })
          }
        })

        // 画用户位置
        endBranchMap.drawUserLoc(this.user_poi)
      }
    },
    created(){
      let dispatch_target = this.$route.query.target === 'in'? 'getBranchesIn':'getBranchesOut'

      this.$store.dispatch(dispatch_target).then(()=>{
        // 画附近网点
        endBranchMap.drawBranch({
          list:this.branch_list_nearby,
          active_branch:this.end_branch,
          marker_click:(branch)=>{
            this.end_branch = branch
          }
        })
      }).catch(err=>{
        if(err && err.msg){
          Toast(err.msg)
        }else{
          Toast('获取网点列表失败')
        }
      })
    },
    mounted(){
        this.init()
    },

    beforeDestroy(){
      endBranchMap.destroy()
    }
  }
</script>

<style lang="less" scoped>
  .EndBranch{
    background-color: #fff;
    text-align: center;
    .map-container {
      position: absolute;
      width: 100%;
      height: 120%;
      top:-20%;
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
      &.loc {
        left: auto;
        right: 0.1rem;
        top: -0.3rem;
        background-image: url('../images/location.jpg');
      }
    }

    .header-control{
      z-index: 2;
      position: absolute;
      left: 0.1rem;
      top: 0.1rem;
      right:0.1rem;
      background-color: #fff;
      line-height: 0.2rem;
      padding: 0.1rem 0;
      color:#999;
      text-align: left;
      &::before{
        content: '';
        margin-left:0.15rem;
        display: inline-block;
        width: 0.2rem;
        height: 0.2rem;
        vertical-align: top;
        background: url('../images/搜索copy2@3x.png') no-repeat center;
        background-size: 80%;
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
      padding: 0 0.1rem 0.1rem;
      .slide-con {
        position: relative;
        z-index: 1;
        background: #fff;
        margin: 0.06rem 0;
        text-align: left;
        padding: 0.15rem;
        color:#999;
        .name {
          font-size: 0.16rem;
          color:#111;
        }
        .icon-btn {
          display: inline-block;
          width: 0.2rem;
          height: 0.2rem;
          background: no-repeat center;
          vertical-align: top;
          background-size: 75%;
          &.icon-full {
            background-image: url('../images/全景copy@3x.png');
          }
        }
      }
      .step-box {
        margin-top:0.06rem;
        position: relative;
        z-index: 2;
        width: 100%;
        background-color: #fff;
        height: 0.46rem;
        font-size: 0.16rem;
        .btn-block {
          height: 100%;
          font-size: 0.16rem;
        }
        &.step-0 {
          line-height: 0.46rem;
        }
      }
    }
  }
</style>
