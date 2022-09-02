<template>
  <div class='CancelBox'>
    <!--mask层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster fadeIn"
      leave-active-class="animated faster fadeOut"
      v-on:after-leave="afterLeave">
      <div class="mask" v-on:touchmove="preventEvent" v-if="show"></div>
    </transition>

    <!--对话框层-->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">
      <div class="fun-con" v-if="show">
        <div class="box">
          <div class="title">
            取消订单
            <div class="close" @click="closeWindow"></div>
          </div>
          <div class="desc">取消订单将收取 <span class="warn">{{fee}}</span> 元超时费</div>
          <div class="desc">您当日还可以取消 <span class="warn">{{count}}</span> 次，超过将限制出行</div>
          <ul class="list">
            <li class="reason" v-for="item in reasons" :class="{chosen:chosen.indexOf(item.id)>-1}" @click="()=>toggleReason(item.id)">{{item.des}}</li>
          </ul>
          <div class="input">
            <textarea class="text" maxlength="50" placeholder="请输入您的建议" v-model.trim="reason_des" rows="4"></textarea>
            <span class="length" v-if="reason_des.length>0">{{reason_des.length}}/50</span>
          </div>
        </div>
        <div class="submit" :class="{active: chosen.length>0 || reason_des !== ''}" @click="cancel">提交</div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {Confirm,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    data() {
      return {
        show: false,
        chosen:[],
        reason_des:''
      }
    },
    computed:{
      ...mapState('rental',[
        'rental',
        'coupon_cnt',
        'count',
        'fee',
        'reasons'
      ])
    },
    mounted() {
      this.show = true
    },
    methods: {
      afterLeave() {
        this.$store.dispatch('Widget/toggle','cancelBox')
      },
      closeWindow() {
        this.show = false
      },
      preventEvent(e) {
        e.preventDefault()
        e.stopPropagation()
        return false
      },
      toggleReason(id){
        let index = this.chosen.indexOf(id)
        if(index>-1){
          this.chosen.splice(index,1)
        }else{
          this.chosen.push(id)
        }
      },
      cancel(){
        if(this.chosen.length === 0 && this.reason_des === ''){
          return
        }

        let loading = this.$_LIKE_loading('取消中...')
        this.closeWindow()
        if(this.reason_des !== ''){
          this.chosen.push(100)
        }
        myAjax.postV2(API.rental.cancel,{
          reason_ids:'^'+this.chosen.join('^')+'^',
          reason_des:this.reason_des
        }).then(res=>{
          loading.destroy()
          if(res.status === 0){
            this.$store.commit('rental/updateRentalStep',0)
            this.$store.commit('rental/updateRental',null)
            this.$store.commit('branch/setStartBranch',null)
            this.$store.commit('branch/setCarList',[])
            this.$router.push({
              path:'/index'
            })
            this.closeWindow()
          }else if([1001,1013].indexOf(res.status)){
            this.$store.commit('rental/updateRentalStep',0)
            this.$store.commit('pay/setRentalNo',res.data.rental_no,)
            this.$store.commit('rental/updateRental',null)
            this.$router.push('/pay/confirm')
          }else{
            Toast(res.msg)
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .CancelBox {
    position: absolute;
    z-index: 90;

    .mask {
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      background-color: rgba(0, 0, 0, 0.44);
    }

    .fun-con {
      position: fixed;
      bottom: 0;
      background-color: #fff;
      width: 100%;
      .box {
        background-color: #fff;
        line-height: 0.2rem;
        padding: 0.2rem;
        color:#999;
        text-align: left;
        .title{
          text-align: left;
          font-size: 0.17rem;
          line-height: 0.2rem;
          color:#494B51;
          position: relative;
          margin-bottom: 0.1rem;
          .close{
            width: 0.2rem;
            height: 0.2rem;
            position: absolute;
            top:0;
            right:0;
            background: url('../../assets/images/icon_close_btn.png') no-repeat center;
            background-size: 70%;
          }
        }
        .list{
          margin:0.1rem 0;
          .reason{
            display: inline-block;
            padding:0.05rem 0.1rem;
            font-size: 0.12rem;
            color:#999;
            border:solid 1px #999;
            border-radius: 2px;
            margin:0.05rem 0.1rem 0.05rem 0;
            &.chosen{
              color:#111;
              border-color:#111;
            }
          }
        }
        .input{
          position: relative;
          .text{
            box-sizing: border-box;
            padding: 0.1rem 0.15rem;
            resize:none;
            border-radius: 2px;
            border:none;
            width: 100%;
            background-color: #f2f2f2;
          }
          .length{
            position: absolute;
            right:0.05rem;
            bottom:0.05rem;
            font-size: 0.12rem;
            color:#999;
          }
        }

      }
      .submit{
        border-top:solid 1px #e5e5e5;
        line-height: 0.48rem;
        color:#dfdfdf;
        font-size: 0.16rem;
        &.active{
          color:#333;
        }
      }
    }
  }

</style>
