<template>
  <div class="ReasonList">
    <div v-if="deposit_reasons.length > 0" class="reason_con">
      <div class="title">请选择退保证金原因(可多选)</div>
      <div class="group" v-for="group in deposit_reasons">
        <div class="group-title">{{group.title}}</div>
        <ul>
          <li v-for="item in group.reasons"
              class="item" :class="{active:chosen.includes(item.id)}"
              @click="()=>chooseReason(item.id)"
          >{{item.des}}</li>
        </ul>
      </div>

      <div class="textarea_con" :class="{'show': chosen.includes(100)}">
        <textarea  placeholder="请输入不超过50个字的描述" rows="3" v-model="refund_reason_des" maxlength="50"></textarea>
        <span>{{reasonLength}}/50</span>
      </div>
    </div>
    <div class="btn_con">
      <button class="btn" @click="refund">退保证金</button>
      <button class="btn" @click="toMain">不退了</button>
    </div>
  </div>
</template>

<script>
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import security from '../../common/security'
  import {mapState} from 'vuex'
  import {Alert,Loading,Toast} from '../../../other_modules/vue-plugins/like-base'

  export default {
    data () {
      return {
        chosen:[],
        refund_reason_des: ''
      }
    },
    computed: {
      reasonLength () {
      	return this.refund_reason_des.length
      },
      ...mapState('user',[
        'deposit_reasons'
      ])
    },
    methods: {
      chooseReason: function (id) {
        let index = this.chosen.indexOf(id)
        if(index>-1){
          this.chosen.splice(index,1)
        }else{
          this.chosen.push(id)
        }
      },
      toMain () {
        this.$router.go(-3)
      },
      refund () {
        if (this.chosen.length === 0) {
          Toast('请选择原因')
          return
        }

        let loading = Loading('退款中...')
        let that = this
        let data = {
          refund_reason: '^' + this.chosen.map(item => item.id).join('^') + '^',
          refund_reason_des: security.text(this.refund_reason_des).replace(/\s+/g, '')
        }
        myAjax.postV2(API.deposit.payBack, data).then(function (res) {
        	loading.close()
        	if (res.status === 0) {
        	  Toast({
              msg: res.msg,
              toastCallback: function () {
                that.$router.push('/index')
              }
            })
          }
        }.bind(this))
      }
    },
    created: function () {

    }
  }
</script>

<style lang="less" scoped>
  .ReasonList {
    background-color: #fff;
    .reason_con {
      margin: 0 0.2rem;
      padding: 0.2rem 0;
      text-align: left;
    }

    .title {
      font-size: 0.16rem;
      color: #111;
    }

    .group{
      margin:0.1rem 0;
      .group-title{
        font-size: 0.12rem;

      }
      .item {
        display: inline-block;
        color:#999;
        padding: 0.02rem 0.05rem;
        border:solid 1px #999;
        font-size: 0.14rem;
        margin: 0.08rem 0.08rem 0.08rem 0;
        &.active{
          color:#111;
          border-color:#111;
        }
      }
    }
  }





  .textarea_con {
    padding-bottom: 0.8rem;
    display: none;
    color:#999;
    font-size: 0.11rem;
    position: relative;
    &.show {
      display: block;
    }
    span{
      position: absolute;
      right:0.16rem;
      bottom:0.86rem
    }
    textarea {
      border: solid 1px #e3e3e3;
      width: 100%;
      box-sizing: border-box;
      padding: 0.08rem 0.1rem 0.18rem;
    }
  }

  .btn_con {
    padding: 0.15rem 0;
    background-color: #fff;
    position: fixed;
    left: 0.2rem;
    right: 0.2rem;
    bottom: 0;
    text-align: left;
    .btn {
      width: 45%;
      height: 0.46rem;
      border-radius: 3px;
      font-size: 0.15rem;
      color: #666;
      background-color: #FFF;
      border: solid 1px #DFDFDF;
      &:nth-of-type(2) {
        float: right;
        color: #fff;
        background-color: #111;
      }
    }
  }
</style>
