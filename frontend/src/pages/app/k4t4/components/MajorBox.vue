<template>
  <div class="MajorBox shadow">
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">
      <div class="branches" v-if="data.branch_start && data.car_list.length>0">
        <div class="point-box start">
          <div class="content">
            <div class="text-con start">{{data.branch_start.name}}</div>
            <div class="text-con desc"
                 v-if="data.car_current && data.car_current.parking_fee>0">
              预估停车费 <span class="warn">{{data.car_current.parking_fee}}</span> 元
            </div>
          </div>
          <div class="icon-con">
            <div class="icon-btn icon-full" v-if="data.branch_start.walk_overall_view" @click="toOverall">全景</div>
            <div class="icon-btn icon-nav" @click="callNavApp">导航</div>
          </div>
        </div>

        <div class="border-bottom"></div>

        <div class="point-box" @click="toEndBranch">
          <div class="content">
            <div class="text-con end">{{data.branch_end ? data.branch_end.name : '可还车时选择'}}</div>
            <div class="text-con desc" v-if="data.branch_end && data.branch_end.parking_fee_in>0">还车附加费 <span
              class="warn">{{data.branch_end.parking_fee_in}}</span> 元
            </div>

            <div class="icon-con2">
              <div class="icon-btn icon-close" @click="clearEndBranch" v-if="data.branch_end"></div>
              <div class="icon-btn icon-arrow" v-else></div>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {appMutual} from '../../../../../other_modules/app-mutual'

  export default {
    name: "major-box",
    props:[
      'data'
    ],
    data(){
      return{
        des_lng:'',
        des_lat:''
      }
    },
    computed:{
      ...mapState([
        'user_lng',
        'user_lat',
        'mapCenter'
      ])
    },
    methods:{
      callNavApp(){
        appMutual.send.callNavigation({
          lng_start:this.user_lng,
          lat_start:this.user_lat,
          lng_des:this.data.branch_start.walk_lng,
          lat_des:this.data.branch_start.walk_lat,
          policy:1
        })
      },
      toOverall() {
        appMutual.send.url({
          url:this.data.branch_start.walk_overall_view,
          destroy_current:0,
          request_type:0,
          need_param:0
        })
      },
      toEndBranch() {
        this.$emit('toEndBranch')
      },
      clearEndBranch(e) {
        e.stopPropagation()
        this.$store.commit('setBranchEnd', null)
        return false
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
        min-height: 0.6rem;
        padding: 0.1rem 0.1rem 0.1rem 0.15rem;
        box-sizing: border-box;
        position: relative;
        display: flex;
        align-items:center;
        .front {
          flex:none;
          width: 0.3rem;
          color: #999;
        }
        .content{
          flex:none;
          margin-left: 0.3rem;
          .text-con {
            &::before{
              color: #999;
              display: inline-block;
              width: 0.3rem;
              margin-left: -0.3rem;
            }
            &.start::before{
              content:'取：'
            }
            &.end::before{
              content:'还：'
            }
          }
        }

        .icon-con {
          position: absolute;
          height: 0.36rem;
          border-left:solid 1px #f2f2f2;
          padding: 0 0.05rem;
          right: 0;
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
              background-image: url('../images/导航copy@3x.png');
            }
            &.icon-full::before {
              background-image: url('../images/全景copy@3x.png');
            }
          }
        }

        .text-con {
          width: 2.2rem;
          text-align: left;
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
              background-image: url('../images/右copy3@3x.png');
            }
            &.icon-close {
              background-image: url('../images/清除字@3x.png');
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
              background-image: url('../images/导航copy@3x.png');
            }
            &.icon-full{
              background-image: url('../images/全景copy@3x.png');
            }
            &.icon-arrow {
              background-image: url('../images/右copy3@3x.png');
            }
          }
        }
      }

      .border-bottom{
        border-bottom: solid 1px #f2f2f2;
      }
    }
  }
</style>
