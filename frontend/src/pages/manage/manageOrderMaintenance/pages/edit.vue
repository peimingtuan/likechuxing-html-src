<template>
    <div class="Edit">
        <!--车辆信息-->
        <CarBoxMaintain :data="car_maintain"/>

        <!--流程示意-->
        <div class="flow-box">
            <div class="title">
                工单流程
                <div class="fun-btn float-right" v-if="delete_show" @click="deleteOrder" >删除</div>
                <div class="fun-btn float-right" v-if="more_show" @click="()=>{this.more_slide_show=true}">更多</div>
            </div>
            <ProgressStep class="pro-step" :steps="steps" />
        </div>

        <div class="blur-con" v-if="notReachBranch">
            <div class="blur-mask" >
                <div class="big-btn" @click="checkPosition">已到网点</div>
                <p>到达当前车辆所在网点后<br />点击"已到网点"进行后续操作</p>
            </div>
        </div>


        <!--添加步骤-->
        <div class="blur-con" v-if="!notReachBranch">
            <OperatingSteps :data="operations" @itemClick="stepClick"/>

        </div>

        <div class="history-box" v-if="!notReachBranch">
            <p>操作历史</p>
            <div class="history-item" v-for="item in maintain_operate_history" :key="item.id">
                <div>{{item.time}} {{item.operate}}<span class="float-right" v-if="item.item_id>1 && item.item_id<7" @click="handleView(item.item_id)">查看</span></div>
                <div>{{item.real_name}}</div>
            </div>
        </div>

        <!--操作按钮-->
        <div v-if="!notReachBranch">
            <div class="btn-con-height"></div>
            <div class="btn-con" >
                <LikeButton
                        text="开门"
                        type="default"
                        :disabled="car_maintain.step<2"
                        disabled_msg="请先添加取车验车单"
                        @click="openDoor"
                        class="btn"
                />
                <LikeButton
                        text="锁门"
                        type="default"
                        :disabled="car_maintain.step<2"
                        disabled_msg="请先添加取车验车单"
                        @click="lockDoor"
                        class="btn"
                />
                <LikeButton
                        text="查询网点"
                        type="default"
                        class="btn"
                        @click="toMap"
                />
            </div>
        </div>

        <SlideUpBox title="更多" v-if="more_slide_show" class="OrderBy" ref="slideUpBox" @close="()=>{this.more_slide_show=false}">
            <div class="more-box">
                <div class="fun-item" @click="toFault">
                    1、新建故障工单，点这里！
                </div>
                <div class="fun-item" @click="toProblem">
                    2、新建车辆问题记录单，点这里！
                </div>
            </div>
        </SlideUpBox>

    </div>
</template>

<script>
  import {mapState} from 'vuex'
  import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  import CarBoxMaintain from "../components/CarBoxEditMaintain";
  import { Indicator } from 'mint-ui';
  import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  import ProgressStep from '../../../../../other_modules/like-manageOrder/component/ProgressStep'
  import OperatingSteps from '../../../../../other_modules/like-manageOrder/component/OperatingSteps'
  import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBoxV2'

  export default {
    name: "new",
    components:{
      CarBoxMaintain,
      LikeButton,
      ProgressStep,
      OperatingSteps,
      SlideUpBox
    },
    data(){
      return {
        steps:[
          {id:1,name:'取车验车',finish:false},
          {id:2,name:'保前信息',finish:false},
          {id:3,name:'保养信息',finish:false},
          {id:4,name:'费用信息',finish:false},
          {id:5,name:'还车验车',finish:false}
        ],

        operations:[
          {id:1,name:'添加取车验车单',status:1},
          {id:2,name:'录入保养前信息',status:0},
          {id:3,name:'录入保养信息',status:0},
          {id:4,name:'录入费用信息',status:0},
          {id:5,name:'添加还车验车单',status:0},
          {id:6,name:'结束工单',status:0},
        ],

        notReachBranch:false,
        more_slide_show:false,

        res_origin:{}

      }
    },
    computed:{
      ...mapState('maintain',['car_maintain','maintain_operate_history']),
      delete_show(){
        // 当创建者且未取车时可删
        return this.car_maintain.step<2 && this.car_maintain.is_mine
      },
      more_show(){
        // 还车后显示
        return this.car_maintain.step>5
      }
    },
    beforeCreate(){
      this.$store.commit('maintain/setCarMaintainInfo',{})
    },
    created(){
      this.$store.dispatch('maintain/getCarMaintain',this.$route.query.order_id).then(res=>{
        this.notReachBranch=Boolean(this.car_maintain.step===0)

        this.steps.forEach(item=>{
          if(item.id<this.car_maintain.step)item.finish=true
        })

        this.operations.forEach(item=>{
          if(item.id===this.car_maintain.step)item.status=1
          if(item.id<this.car_maintain.step)item.status=2
        })


        this.res_origin = res
      }).catch(err=>{
        if(/code 500/.test(err.message)){
          this.$_LIKE_alert({
            msg:'服务器接口500错误，请联系开发'
          })
        }else if(err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          throw err
        }
      })


      this.$store.dispatch('maintain/getMaintainOperateHistory',this.$route.query.order_id).then(()=>{

      }).catch(err=>{
        if(/code 500/.test(err.message)){
          this.$_LIKE_alert({
            msg:'服务器接口500错误，请联系开发'
          })
        }else if(err.msg){
          this.$_LIKE_toast(err.msg)
        }else{
          throw err
        }
      })
    },
    methods:{
      handleView(item_id){
        switch (Number(item_id)) {//为了后续追加页面，此处不使用default
          case 2:
            this.$router.push({//维修前拍照
              path: '/checkPhoto',
              query: {
                type: 'end',
                item_id: item_id,
                order_id: this.car_maintain.id
              }
            })
            break;
          case 3:
            this.$router.push({//保养前信息
              path: '/infoPrevious?order_id=' + this.car_maintain.id + '&view=1',
            })
            break;
          case 4:
            this.$router.push({//保养信息
              path: '/infoMaintain?order_id=' + this.car_maintain.id + '&view=1',
            })
            break;
          case 5:
            this.$router.push({//费用信息
              path: '/infoFee?order_id=' + this.car_maintain.id + '&view=1',
            })
            break;
          case 6:
            this.$router.push({//还车验车单
              path: '/checkPhoto',
              query: {
                type: 'end',
                item_id: item_id,
                order_id: this.car_maintain.id
              },
            })
            break;
        }
      },
      toFault(){
        sessionStorage.setItem('resultData',JSON.stringify(this.res_origin))
        window.location.href='/manage/manageOrder/faultWork/newbuiltfault.html?maintain_id='+this.car_maintain.id
      },
      toProblem(){
        window.location.href = '/manage/manageOrder/carProblemsList/proOrder.html#/proCheck?car_id='+this.car_maintain.car.id
      },

      deleteOrder(){
        this.$_LIKE_confirm({
          msg:"确定删除已创建的工单？",
          confirmButtonCallback:()=>{
            window.location.href='/manage/manageOrderMain/index.html#/order/delete?order_type=1&order_id='+this.car_maintain.id;
          }
        })
      },
      toMap(){
        this.$router.push({
          path:'/serviceMap',
          query:{
            order_id:this.order_id,
            type:'2'
          }
        })
      },
      stepClick(item){
        if(item.id !== this.car_maintain.step){
          return
        }
        switch (item.id){
          case 1:
            window.location.href = '/manage/manageOrderMain/index.html#/car/partsSelect?type=0&order_type=1&order_id='+this.car_maintain.id;
            break;
          case 2:
            this.$router.push({
              path:'/infoPrevious',
              query:{
                order_id:this.car_maintain.id
              }
            })
            break;
          case 3:
            this.$router.push({
              path:'/infoMaintain',
              query:{
                order_id:this.car_maintain.id
              }
            })
            break;
          case 4:
            this.$router.push({
              path:'/infoFee',
              query:{
                order_id:this.car_maintain.id
              }
            })
            break;
          case 5:
            window.location.href = '/manage/manageOrderMain/index.html#/car/partsSelect?type=1&order_type=1&order_id='+this.car_maintain.id;
            break;
          case 6:
            window.location.href = '/manage/manageOrderMain/index.html#/order/finish?order_type=1&order_id='+this.car_maintain.id;
            break;
        }
      },
      openDoor(){
        this.$store.dispatch('openDoor',this.car_maintain.plate_no || this.car_maintain.vin_h).then(res=>{
          this.$_LIKE_toast(res.msg)
        }).catch(err=>{
          console.log(err)
        })
      },
      lockDoor(){
        this.$store.dispatch('lockDoor',this.car_maintain.plate_no || this.car_maintain.vin_h).then(res=>{
          this.$_LIKE_toast(res.msg)
        }).catch(err=>{
          console.log(err)
        })
      },
      checkPosition(){
        Indicator.open()
        dd.getLocation().then(res=>{
          Indicator.close()
          return this.$store.dispatch('maintain/submit',{
            item_id:1,
            params:{
              lng:res.lng,
              lat:res.lat
            }
          })
        }).then(()=>{
          this.notReachBranch=false
        }).catch(err=>{
          Indicator.close()
          if(err.msg){
            this.$_LIKE_toast(err.msg)
          }else{
            this.$_LIKE_toast('出错了')
            console.log(err)
          }
        })
      }
    }
  }
</script>

<style lang=less scoped>
    @import '../css/color';
    .Edit{
        .flow-box{
            margin-top:0.1rem;
            padding: 0.1rem;
            background-color: #fff;
            color:#333;
            .fun-btn{
                line-height: 0.2rem;
                padding: 0 0.1rem;
                color:#666;
                font-size: 12px;
            }

            .pro-step{
                margin-top:0.1rem;
            }
        }

        .history-box{
            padding: 0.2rem 0.1rem;
            background-color: #fff;
            margin-top: 0.1rem;
            .history-item{
                margin:0.1rem;
                font-size: 12px;
                color:#666;
            }
        }

        .btn-con-height{
            height: 0.7rem;
        }
        .btn-con{
            position: fixed;
            display: flex;
            justify-content: space-between;
            bottom:0;
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 -2px 1px #eaeaea;
            .btn{
                width: 31%;
                margin:0
            }
            .btn-full{
                width: 100%;
                margin:0;
            }
        }

        .blur-con{
            position: relative;
            width: 100%;
            margin-top: 0.1rem;
            background-color: #fff;
            .blur-mask{
                padding: 0.5rem 0;
                font-size: 12px;
                color:#333;
                text-align: center;
            }
            .big-btn{
                font-size: 20px;
                color:#fff;
                margin:0 auto 0.15rem;
                border-radius: 0.6rem;
                width: 1.2rem;
                height: 1.2rem;
                line-height: 1.2rem;
                background: @major;
            }
            .blur{
                filter:blur(4px)
            }
        }

        .more-box{
            .fun-item{
                padding: 0.15rem 0.1rem;
                border-top:solid 1px #f0f0f0;
                color:#333;
            }
        }

    }
</style>