<template>
  <div class="EndBranch">
    <div ref="map" class="map-container"></div>

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
          <p v-if="end_branch.parking_fee_in > 0">还车附加费 <span class="warn">{{end_branch.parking_fee_in}}</span> 元</p>
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
  import {mapState, mapGetters} from 'vuex'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {endBranchConfirmMap} from '../../common/mapControl/index'

  export default {
    name: "end-branch",
    data() {
      return {
        end_branch: null,
        branchList: []
      }
    },
    computed: {
      ...mapState('rental', [
        'check_end_branch_id',
        'check_end_branch_name',
        'check_end_branch_address'
      ]),
      ...mapState('user', [
        'lat',
        'lng'
      ]),
      ...mapGetters('user', [
        'user_poi'
      ])
    },
    methods: {
      locationUser() {
        let that = this
        this.$store.dispatch('user/location').then(() => {
          endBranchConfirmMap.drawUserLoc(that.user_poi, true)
        })
      },
      confirmEndBranch() {
        this.$store.commit('rental/setCheckEndBranch', {
          branch_id: this.end_branch.id,
          branch_name: this.end_branch.name,
          branch_address: this.end_branch.address
        })

        this.$router.go(-1)
      },
      marker_click(branch) {
        this.end_branch = branch
        this.drawBranch()
      },
      drawBranch() {
        let end_branch = this.end_branch
        if(!end_branch.lat)end_branch = null
        // 画附近网点
        endBranchConfirmMap.drawBranch({
          list: this.branchList,
          active_branch: end_branch,
          marker_click: this.marker_click,
          hide_cnt:true
        })
      },
      getBranchNearby() {
        myAjax.postV2(API.branch.getNearbyBranch, {
          lat: this.lat,
          lng: this.lng,
          from: 3
        }).then(res => {
          if (res.status === 0) {
            this.branchList = res.data
            this.drawBranch()
          } else {
            this.$_LIKE_toast(res.msg)
          }
        })
      },
      init() {

        endBranchConfirmMap.initMap(this.$refs.map, {
          resizeEnable: true,
          zoom: 15,
          // 当前位置为中心
          center: this.user_poi.getLngLat()
        })
        // 画用户位置
        endBranchConfirmMap.drawUserLoc(this.user_poi)

      }
    },
    mounted() {
      this.end_branch = {
        id: this.check_end_branch_id,
        name: this.check_end_branch_name,
        address: this.check_end_branch_address
      }
      this.$store.dispatch('user/location').then(() => {
        this.init()
        this.getBranchNearby()
      })

    },

    beforeDestroy() {
      this.$store.commit('branch/setFlagLoc', null)
      endBranchConfirmMap.destroy()
    }
  }
</script>

<style lang="less" scoped>
  .EndBranch {
    background-color: #fff;
    .map-container {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .datouzhen {
      position: absolute;
      bottom: 50%;
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
      &.loc {
        left: auto;
        right: 0.1rem;
        top: -0.3rem;
        background-image: url('../../assets/images/location.jpg');
      }
    }

    .header-control {
      z-index: 2;
      position: absolute;
      left: 0.1rem;
      top: 0.1rem;
      line-height: 0.2rem;
      padding: 0.1rem 0;
      color: #999;
      text-align: left;
      &::before {
        content: '';
        margin-left: 0.15rem;
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
        color: #999;
        .name {
          font-size: 0.16rem;
          color: #111;
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
        margin-top: 0.06rem;
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
