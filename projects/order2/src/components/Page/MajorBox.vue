<template>
  <div class="MajorBox shadow">
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">
      <div class="branches" v-if="step===0 && active_branch && car_list.length>0">
        <div class="point-box clearfix" :class="{double: !(active_car && active_car.parking_fee>0)}">
          <div class="front float-left">取：</div>
          <div class="content float-left border-bottom">
            <div class="text-con">{{active_branch.name}}</div>
            <div class="text-con desc"
                 @click="()=>this.$store.dispatch('Widget/toggle','branchExplain')"
                 v-if="active_car && active_car.parking_fee>0">
              预估停车费 <span class="warn">{{active_car.parking_fee}}</span> 元（结算时系统补还）
            </div>

            <div class="icon-con">
              <div class="icon-btn icon-full" v-if="active_branch.walk_overall_view" @click="toOverall">全景</div>
              <div class="icon-btn icon-nav" @click="()=>callNavApp(active_branch.walk_lng,active_branch.walk_lat)">导航</div>
            </div>
          </div>
        </div>

        <div class="point-box clearfix" @click="()=>toEndBranch('start')" :class="{double: !(end_branch && end_branch.parking_fee_in>0)}">
          <div class="front float-left" >还：</div>
          <div class="content float-left">
            <div class="text-con">{{end_branch ? end_branch.name : '可还车时选择'}}</div>
            <div class="text-con desc" v-if="end_branch && end_branch.parking_fee_in>0">还车附加费 <span
              class="warn">{{end_branch.parking_fee_in}}</span> 元
            </div>

            <div class="icon-con2">
              <div class="icon-btn icon-close" @click="clearEndBranch" v-if="end_branch"></div>
              <div class="icon-btn icon-arrow" v-else></div>
            </div>
          </div>
        </div>
      </div>
      <div class="branches" v-if="[1,2].includes(step) && rental">
        <div class="point-box clearfix">
          <div class="front float-left">取：</div>
          <div class="content float-left border-bottom">
            <div class="text-con">{{rental.begin_branch.name}}</div>
            <div class="text-con desc">{{rental.begin_branch.addr}}</div>
            <div class="text-con desc">{{rental.begin_branch.walk_addr}}</div>
            <div class="text-con desc">
              <span class="box" v-if="rental.begin_parking_floor">{{rental.begin_parking_floor}}</span>
              <span class="box" v-if="rental.begin_parking_no">{{rental.begin_parking_no}}</span>
            </div>

            <div class="icon-con">
              <div class="icon-btn icon-full" v-if="rental.begin_branch.walk_overall_view" @click="toOverall">全景</div>
              <div class="icon-btn icon-nav" @click="()=>callNavApp(active_branch.walk_lng,active_branch.walk_lat)">导航</div>
            </div>
          </div>
        </div>

        <div class="point-box clearfix" @click="()=>toEndBranch('rental')" :class="{double: !(end_branch && end_branch.parking_fee_in>0)}">
          <div class="front float-left" >还：</div>
          <div class="content float-left">
            <div class="text-con">{{end_branch ? end_branch.name : '可还车时选择'}}</div>
            <div class="text-con desc" v-if="end_branch && end_branch.parking_fee_in>0">还车附加费 <span
              class="warn">{{end_branch.parking_fee_in}}</span> 元
            </div>

            <div class="icon-con2">
              <div class="icon-btn icon-close" @click="clearEndBranch" v-if="end_branch"></div>
              <div class="icon-btn icon-arrow" v-else></div>
            </div>
          </div>
        </div>
      </div>
      <div class="branches" v-if="step===3">
        <div class="point-box clearfix" :class="{double: !end_branch}">
          <div class="front float-left" >还：</div>
          <!--有还车网点-->
          <div  class="content float-left" v-if="end_branch">
            <div class="text-con">{{end_branch.name}}</div>
            <div class="text-con desc">{{end_branch.add}}</div>
            <div class="text-con desc">{{end_branch.drive_addr}}</div>
            <div class="text-con desc" v-if="end_branch.parking_fee_in>0">还车附加费 <span
              class="warn">{{end_branch.parking_fee_in}}</span> 元
            </div>

            <div class="icon-con3">
              <div class="icon-btn icon-arrow float-right" @click="()=>toEndBranch('rental')"></div>
              <div class="icon-btn icon-nav float-right" @click="()=>callNavApp(end_branch.lng,end_branch.lat)"></div>
              <div class="icon-btn icon-full float-right" v-if="end_branch.driving_overall_view" @click="toOverall"></div>
            </div>
          </div>
          <!--没选换车网点-->
          <div class="content float-left" @click="()=>toEndBranch('rental')" v-else>
            <div class="text-con">还车时选择</div>
            <div class="icon-con2">
              <div class="icon-btn icon-arrow small float-right"></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  export default {
    name: "major-box",
    data(){
      return{
        des_lng:'',
        des_lat:''
      }
    },
    computed:{
      ...mapState('branch', [
        'active_branch',
        'car_list',
        'active_car',
        'end_branch'
      ]),
      ...mapGetters('branch', [
        'parking_fee',
        'balance_refund',
        'branch_list_nearby'
      ]),
      ...mapState('rental',[
        'step',
        'rental'
      ])
    },
    methods:{
      callNavApp(lng,lat){
        this.$store.commit('Widget/toggleCallNavApp',{lat:lat,lng:lng})
      },
      toOverall() {
        if(this.step === 3){
          SDK.openWindow(this.end_branch.driving_overall_view)
        }else{
          SDK.openWindow(this.active_branch.walk_overall_view)
        }
      },
      toEndBranch(step) {
        this.$router.push({
          path: '/rental/endBranch',
          query:{
            step:step
          }
        })
      },
      clearEndBranch(e) {
        e.stopPropagation()
        this.$store.dispatch('branch/updateEndBranch', null)
        return false
      },

    },
    updated: function () {
      let that = this
      if (this.step === 3) {
        //mainMap.drawStartBranch(that.active_branch)
        if (that.end_branch) {
          //mainMap.drawEndBranch(that.end_branch)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .MajorBox{
    text-align: center;
    margin: 0.06rem auto;
    overflow: hidden;
    .branches{
      background-color: #fff;
      .point-box{
        line-height: 0.2rem;
        //height: 0.6rem;
        padding: 0.1rem 0 0 0.15rem;
        box-sizing: border-box;
        position: relative;
        .front {
          width: 0.3rem;
          height: 0.4rem;
          color: #999;
        }
        .content{
          width: 3.1rem;
          padding-bottom: 0.1rem;
        }
        .border-bottom{
          border-bottom: solid 1px #f2f2f2;
        }
        .text-con {
          width: 2.2rem;
          text-align: left;
          overflow: hidden;
          &.desc {
            //width: 2.9rem;
            overflow: hidden;
            color: #999;
            font-size: 0.13rem;
          }
          .box{
            font-size: 0.12rem;
            border-radius: 2px;
            border:solid 1px #ccc;
            display: inline-block;
            line-height: 0.16rem;
            padding: 0 0.4em;
            text-align: center;
            margin-right:0.1rem;
          }
        }

        &.double {
          line-height: 0.4rem;
        }

        .icon-con {
          position: absolute;
          height: 0.36rem;
          border-left:solid 1px #f2f2f2;
          padding: 0 0.05rem;
          right: 0.05rem;
          top: 0.12rem;
          .icon-btn {
            display: inline-block;
            width: 0.36rem;
            height: 0.36rem;
            line-height: 0.16rem;
            color:#999;
            font-size: 0.12rem;
            &::before{
              content: '';
              display: block;
              width: 100%;
              height: 0.2rem;
              background: no-repeat center;
              background-size: auto 70%;
            }
            &.icon-nav::before {
              background-image: url('../../assets/images/导航copy@3x.png');
            }
            &.icon-full::before {
              background-image: url('../../assets/images/全景copy@3x.png');
            }
          }
        }

        .icon-con2 {
          position: absolute;
          height: 0.36rem;
          padding: 0 0.05rem;
          right: 0.05rem;
          top: 50%;
          margin-top: -0.18rem;
          .icon-btn {
            width: 0.36rem;
            height: 0.36rem;
            background: no-repeat center;
            background-size: auto 40%;
            &.icon-arrow {
              background-image: url('../../assets/images/右copy3@3x.png');
            }
            &.icon-close {
              background-image: url('../../assets/images/清除字@3x.png');
            }
          }
        }

        .icon-con3 {
          position: absolute;
          height: 0.2rem;
          padding: 0 0.05rem;
          right: 0.05rem;
          top: 0.1rem;
          .icon-btn {
            width: 0.2rem;
            height: 0.2rem;
            background: no-repeat center;
            background-size: auto 80%;
            margin:0 0.05rem;
            &.icon-nav {
              background-image: url('../../assets/images/导航copy@3x.png');
            }
            &.icon-full{
              background-image: url('../../assets/images/全景copy@3x.png');
            }
            &.icon-arrow {
              background-image: url('../../assets/images/右copy3@3x.png');
            }
          }
        }
      }
    }
  }
</style>
