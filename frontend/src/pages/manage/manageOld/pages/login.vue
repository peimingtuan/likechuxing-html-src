<template>
    <div class="login-box">
        <!--<form action="">-->
        <div class="login-item">
            <div class="label-title">手机号</div>
            <div class="row-flex-item">
                <input autofocus type="tel" v-model="phone" />
            </div>
            <button  class="get-code" @click="getCode">{{getCodeBtnText}}</button>
        </div>
        <div class="login-item">
            <div class="label-title">验证码</div>
            <div class="row-flex-item">
                <input type="number" maxlength="4" @input="checkCode" v-model="code"/>
            </div>
        </div>
        <div class="btn-area">
            <button class="submit" :class="{disabled:!isCodeLegal}" @click="login">提交</button>
        </div>
        <!--</form>-->
    </div>
</template>

<script>
    import {getManageUrl} from "../../../../../other_modules/url-constructor";
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import {mapState} from 'vuex'

  export default {
    name: "login",
    data(){
      return {
        phone: '',
        code: '',
        count: 61,
        steps: ['获取验证码', '发送中...', '发送成功', 'count'],
        step: 0,
        isNotGetCode: true,
        count_flag: null
      }
    },
    computed: {
      getCodeBtnText(){
        if(this.count === 61){
          return '获取验证码'
        }else{
          return '获取验证码('+this.count+'s)'
        }
      },
      isPhoneLegal: function () {
        return /^1[3456789]\d{9}$/.test(this.phone)
      },
      isCodeLegal: function () {
        let code = /^\d{4}$/.test(this.code)
        // 同时检测手机号
        return this.isPhoneLegal && code
      }
    },
    methods:{
      countDown: function () {
        if (this.count === 61) {
          this.step = 3
        }

        if (this.count > 1) {
          this.count--
          this.count_flag = setTimeout(this.countDown, 1000)
        } else {
          this.step = 0
          this.count = 61
        }
      },
      getCode: function () {
        if (this.step !== 0) {
          return
        }

        if (!this.isPhoneLegal) {
          this.$_LIKE_toast('请输入正确手机号')
          return
        }

        this.step = 1

        this.$store.dispatch('user/getCode',this.phone).then(res => {
          if(res.status === 0){
            this.isNotGetCode = false
            this.step = 2
            this.countDown()
          }else{
            this.step = 0
            this.$_LIKE_toast(res.msg)
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      checkCode: function (e) {
        if (this.isCodeLegal) {
          // 失去焦点，隐藏手机键盘
          e.target.blur()
        }
      },
      login: function () {
        // 是否请求过发送验证码
        if (this.isNotGetCode) {
          this.$_LIKE_toast('请先获取获取验证码')
          return
        }

        // 登录
        let loading = this.$_LIKE_loading('登录中...')

        this.$store.dispatch('user/login',{
          phone: this.phone,
          code: this.code
        }).then(() => {

          loading.close()
          this.$router.replace('/')

        }).catch(err=>{

          loading.close()
          if(err && err.msg){
            this.$_LIKE_toast(err.msg)
          }

        })
      }
    },
    mounted() {
      this.$store.dispatch('user/logout')
    },
    beforeDestroy() {
      clearTimeout(this.count_flag)
    }
  }
</script>

<style lang=less scoped>
    .login-box{
        padding: 50px 15px;
        font-size: 14px;
    }
    .login-item{
        display: -webkit-flex;
        display: flex;
        position: relative;
        margin-top:20px;
        background-color: #fff;
    }
    .row-flex-item{
        flex:1;
        padding-left:10px;
    }
    .login-item::after{
        position: absolute;
        bottom: 0;
        left: 0;
        content: "";
        width:100%;
        height:0;
        border-top: 1px solid #e8e8e8;
    }
    .label-title{
        line-height: 2.5em;
    }
    input{
        width: 100%;
        line-height: 2.5em;
        font-size: 14px;
        border:none;
    }
    .btn-area{
        margin-top: 30px;
    }
    .submit{
        display: block;
        width: 100%;
        border:none;
        outline: none;
        margin:15px 0;
        height: 2.5em;
        font-size: 15px;
        text-align: center;
        background-color:deepskyblue;
        color:#fff;
        &.disabled{
            opacity: 0.4;
        }
    }
    .get-code{
        background: none;
        border: none;
        color:deepskyblue;
        line-height: 2.5em;
    }
</style>