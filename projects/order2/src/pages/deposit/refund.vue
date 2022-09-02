<template>
  <div class="DepositReturn">
    <div class="header">
      <div class="title">
        用车保证金
        <img src="../../assets/images/icon_deposit_desc.png" id="deposit_desc" @click="toDescribe"/>
      </div>
      <div class="money">{{formatMoney}}<span>元</span></div>
    </div>
    <div class="tips">
      <p>1. 账户中未使用的优惠券会被清空。</p>
      <p>2. 账户中未兑换的积分会被清零</p>
      <p>3. 最后一次用车15天后，可申请退保证金。</p>
      <p>4. 保证金原路退回，1-3个工作日到账。</p>
    </div>
    <router-link to="/user/deposit/history">
      <div class="deposit_log">保证金记录 ></div>
    </router-link>
    <div class="btn_con">
      <p class="text">近期已新增车辆及网点，请<span class="strong" @click="toMain">返回首页</span>查看</p>
      <button class="btn btn-primary btn-block" :class="{disabled:!deposit_can_refund}" @click="returnMoney">退保证金</button>
    </div>
  </div>
</template>

<script>
  import format from '../../common/Format'
  import {mapState} from 'vuex'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import PAGE from '../../common/pageAddress'
  import {Alert,Loading,Toast,Confirm} from '../../../other_modules/vue-plugins/like-base'

  export default {
    computed: {
      ...mapState('user',[
        'deposit',
        'deposit_can_refund'
      ]),
      formatMoney () { return format.money(this.deposit) }
    },
    methods: {
      toDescribe: function () {
        SDK.openWindow(PAGE.describeDeposit.href)
      },
      returnMoney () {
        if(!this.deposit_can_refund){
          return
        }

        let loading = Loading()

        let that = this
        myAjax.postV2(API.deposit.payBack,{
          action:'reason_list'
        }).then(res=>{
          loading.close()
          if(res.status === 0){
            this.$store.commit('user/setDepositReasons',res.data.reasons)

            Confirm({
              title:'退保证金后您将失去以下权益',
              msg:res.data.tips,
              cancelButtonText:'再想想',
              confirmButtonText:'继续退',
              confirmButtonCallback:function(){
                that.$router.push({
                  name: 'reasonList'
                })
              }
            })

          }else{
            switch (res.status){
              case 1007:
                this.$_LIKE_alert({
                  title:'提示',
                  msg:'您有'+res.data.cnt+'条违章，请下载APP处理',
                  confirmButtonText:'知道了'
                })
                break;
              case 1008:
                this.$_LIKE_alert({
                  title:'提示',
                  msg:'您有'+res.data.cnt+'条缴费单，请下载APP处理',
                  confirmButtonText:'知道了'
                })
                break;
              default:
                Toast(res.msg)
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      toMain(){
        this.$router.go(-2)
      }
    },
    created: function () {
      if(!this.deposit){
        this.$store.dispatch('user/getDeposit')
      }
    },
  }
</script>

<style lang="less" scoped>
  .DepositReturn {
    background-color: #f7f7f7;
  }

  .header {
    padding: 0.54rem 0 0.4rem;
    color: #111;
  }

  .title {
    font-size: 0.15rem;
    line-height: 0.3rem;
    position: relative;
    #deposit_desc {
      margin-left: 0.08rem;
      height: 0.15rem;
      position: absolute;
      top: 50%;
      margin-top: -0.08rem;
    }
  }

  .deposit_log{
    margin-top: 0.2rem;
    font-size: 0.12rem;
    color:#999
  }

  .money {
    color: #ED3800;
    font-size: 0.36rem;
    span {
      font-size: 0.13rem;
    }
  }

  .btn_con{
    padding: 0.15rem 0;
    position: absolute;
    left:0.2rem;
    right:0.2rem;
    bottom:0;
    .text{
      margin-bottom: 0.3rem;
      font-size: 0.12rem;
      color:#999;
      .strong{
        color:#111;
      }
    }
    .btn{
      font-size: 0.15rem;
      height: 0.46rem;
    }
  }

  .tips {
    margin-top: 0.4rem;
    padding: 0 0.2rem;
    color: #999;
    font-size: 0.13rem;
    text-align: left;
    line-height: 0.22rem;
  }
</style>
