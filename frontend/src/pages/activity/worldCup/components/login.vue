<template>
    <div class="Login" @touchmove="stop" :style="{top:top+'px'}">
        <div class="mask" ></div>
        <div class="login">
            <div class="close" @click="close"></div>
            <div class="msg">奖品信息将会发送到该手机号中</div>
            <input class="input" v-model="phone" maxlength="11" placeholder="输入手机号提交竞猜" />
            <button class="btn" @click="getCode">{{btn_text}}</button>
            <input v-if="step>1" ref="code" class="input" v-model="code" @input="fillCode" maxlength="4" placeholder="请输入验证码"/>
        </div>
    </div>
</template>

<script>
  import {Alert, Toast, Loading,Confirm} from '../../../../../other_modules/vue-plugins/like-base/'
  import appArguments from '../../../../../other_modules/app-arguments'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "../js/getApiUrl";

  function getScrollTop() {
    var scrollPos;
    if (window.pageYOffset) {
      scrollPos = window.pageYOffset; }
    else if (document.compatMode && document.compatMode != 'BackCompat')
    { scrollPos = document.documentElement.scrollTop; }
    else if (document.body) { scrollPos = document.body.scrollTop; }
    return scrollPos;
  }

  export default {
    name: "login",
    data(){
      return {
        top:0,
        step:1,
        btn_text:'提交!',
        phone:'',
        code:'',
        count:61
      }
    },
    methods:{
      close(){
        this.$emit('close')
      },
      stop(e){
        e.stopPropagation()
        e.preventDefault()
      },
      getCode(){
        if(!/^1[3456789]\d{9}$/.test(this.phone)){
          Toast('请输入正确手机号')
          return
        }

        if(this.count !== 61)return

        this.btn_text = '发送中...'
        this.count = 60
        let loading = Loading()
        myAjax.post(getApiUrl('/activity-world-cup/get-code'),{phone:this.phone}).then(res=>{
          loading.close()
          if(res.status === 0){
            this.step = 2
            this.btn_text = '已发送'
            this.countDown()
          }else{
            Toast(res.msg)
          }
        }).catch(err=>{
          loading.close()

        })
      },
      countDown(){
        let that = this

        if(this.count < 1){
          this.count = 61
          this.btn_text = '获取验证码'
        }else{
          this.count--
          setTimeout(function(){
            that.btn_text = that.count+"s"
            that.countDown()
          },1000)
        }
      },
      fillCode(){
        if(/\d{4}/.test(this.code)){
          this.$refs.code.blur()
          this.login()
        }
      },
      login(){
        let loading = Loading()
        myAjax.post(getApiUrl('/activity-world-cup/verify-code'),{
          phone:this.phone,
          code:this.code,
          inviter_uuid:appArguments.inviter_uuid || ''
        }).then(res=>{
          loading.close()
          if(res.status === 0){
            this.$emit('login',{
              uuid:res.data.uuid,
              sign:res.data.sign,
              new_user:res.data.new_user
            })
          }else{
            Toast(res.msg)
          }
        }).catch(err=>{
          loading.close()

        })
      }
    },
    created(){
      this.top = getScrollTop()
    }
  }
</script>

<style lang=less >
.Login{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    .mask{
        width: 100%;
        height: 100%;
    }
    .login{
        position: absolute;
        top:1.1rem;
        left:50%;
        margin-left:-1.35rem;
        width: 2.7rem;
        background-color: #082d60;
        border-radius: 10px;
        padding: 0.5rem 0.2rem;
        box-sizing: border-box;
        text-align: center;
        color:#fff;
        font-size: 14px;

        .msg{
            line-height: 0.2rem;
            margin:0.1rem 0;
        }
        .close{
            width: 0.22rem;
            height: 0.22rem;
            position: absolute;
            right:0.2rem;
            top:0.2rem;
            background: url('../images/close.png') no-repeat center;
            background-size: 100%;
        }
        .input,.btn{
            width: 100%;
            height: 0.4rem;
            border-radius: 0.2rem;
            outline: none;
            font-size: 16px;
            box-sizing: border-box;
            margin:0.05rem 0
        }
        .input{
            color:#fff;
            border: solid 1px #fff;
            padding: 0 0.2rem;
            background-color:#082d60 ;
        }
        .btn{
            border:none;
            background-color: #fff;
            color:#082d60;
            margin-bottom: 0.2rem;
        }
    }

}
</style>