<template>
  <div class="EndBranch">
    <div ref="map" class="map-container"></div>
    <FlagPin ref="pin" :show="true"/>

    <div class="header-control fun-bar shadow" @click="toSearchPoint">搜索目的地附近的网点</div>

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
  import {endBranchMap} from "../../common/mapControl";
  import FlagPin from '../../components/flagPin/index'

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
      ...mapState('user',[
        'city_id'
      ]),
      ...mapGetters('user',[
        'user_poi'
      ]),
      ...mapGetters('branch',[
        'branch_list_nearby'
      ]),
      ...mapState('branch', [
        'branch_list',
        //'end_branch',
        'flag_poi'
      ])
    },
    methods:{
      locationUser() {
        let that = this
        this.$store.dispatch('user/location').then(() => {
          endBranchMap.drawUserLoc(that.user_poi,true)
        })
      },
      toOverall() {
        SDK.openWindow(this.end_branch.walk_overall_view)
      },
      async confirmEndBranch(){
        this.$store.commit('branch/setEndBranch',this.end_branch)
        let step = this.$route.query.step
        if(step === 'rental'){
          // 如果来源是订单中修改，则需要提交到服务器
          await this.$store.dispatch('rental/modifyEndBranch',this.end_branch)
          await this.$store.dispatch('rental/getCurrentInfo')
        }
        this.$router.go(-1)
      },
      toSearchPoint(){
        this.$router.push({
          path:'/rental/searchPoint',
          query:{
            step:this.$route.query.step
          }
        })
      },
      marker_click(branch){
        this.end_branch = branch
      },
      init(){
        let that = this

        let target_poi = this.flag_poi? this.flag_poi:this.user_poi
        endBranchMap.initMap(that.$refs.map, {
          resizeEnable: true,
          zoom: 15,
          // 当前位置为中心
          center: target_poi.getLngLat(),
          //定义拖拽事件
          onDragEnd:(poi)=>{
            that.$refs.pin.jump()
            that.$store.commit('branch/setFlagLoc', poi)
            endBranchMap.drawBranch({
              list:that.branch_list_nearby,
              active_branch:that.end_branch,
              marker_click:that.marker_click
            })
          }
        })
        // 画附近网点
        endBranchMap.drawBranch({
          list:this.branch_list_nearby,
          active_branch:this.end_branch,
          marker_click:(branch)=>{
            this.end_branch = branch
          }
        })
        // 画用户位置
        endBranchMap.drawUserLoc(this.user_poi)

      }
    },
    mounted(){

      if(this.branch_list.length === 0){
        console.log('this.branch_list = 0')
        this.$store.dispatch('branch/getBranchList',{city_id:this.city_id}).then(()=>{
          this.init()
        })
      }else{
        this.init()
      }

    },

    beforeDestroy(){
      this.$store.commit('branch/setFlagLoc',null)
      endBranchMap.destroy()
    }
  }
</script>

<style lang="less" scoped>
  .EndBranch{
    background-color: #fff;
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
        background-image: url('../../assets/images/location.jpg');
      }
    }

    .header-control{
      z-index: 2;
      position: absolute;
      left: 0.1rem;
      top: 0.1rem;
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
        background: url('../../assets/images/搜索copy2@3x.png') no-repeat center;
        background-size: 80%;
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
            background-image: url('../../assets/images/全景copy@3x.png');
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
