<template>
    <div class="Main">
        <div class="mask" v-if="step===0">加载中...</div>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown"
                leave-active-class="animated faster slideOutUp">
            <div class="box" v-if="step>0">
                <div class="desc">
                    <p>在"个人中心"-"身份认证"中</p>
                    <p>提交驾照和身份信息，并认证成功</p>
                    <p>即可获得<span class="strong">50元</span>话费奖励。</p>
                </div>
                <img src="./images/step.png" class="img" />
                <div class="desc">
                    话费将在24小时内自动发送至您的登录账户中。
                </div>
            </div>
        </transition>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown delay"
                leave-active-class="animated faster slideOutUp">
            <div class="header" v-if="step>0"><div class="title"></div></div>
        </transition>
        <ul class="detail" v-if="step===3">低版本活动说明页...</ul>
    </div>
</template>

<script>
  import myAjax from '../../../component/myAjax/'
  import getApiUrl from '../../../js/getApiUrl'
  import {appMutual} from '../../../../other_modules/app-mutual'

  export default {
    name: "mainPage",
    data(){
      return {
        uuid:'',
        sign:'',
        step:0,
        license_status:3
      }
    },
    methods:{
      toLicense(){
        if(appMutual.appArguments.app_version === 2107){
          appMutual.jump.license({
            destroy_current:1,
            callback_url: '',
            license_status:this.license_status
          })
        }else{
          this.step = 1
        }
      }
    },
    created(){
      if(appMutual.appArguments.uuid && appMutual.appArguments.sign){
        this.uuid = appMutual.appArguments.uuid
        this.sign = appMutual.appArguments.sign
        myAjax.post(getApiUrl('/user/information'),{
          uuid:this.uuid,
          sign:this.sign,
          auth:0
        },res=>{
          this.license_status = Number(res.data.license.status)
          this.toLicense()
        })
      }else{
        this.$_LIKE_alert({
          title:"请先登录",
          confirmButtonCallback:()=>{
            appMutual.jump.loginAndCloseThisWebview({
              destroy_current:1,
              callback_url:""
            })
          }
        })
      }
    }
  }
</script>

<style lang="less">
    .Main{
        background-size: 100% auto;
        position: relative;
        overflow: hidden;
        .box {
            width: 100%;
            height: 5.4rem;
            padding-top: 2rem;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 0 0 0.2rem 0.2rem;
            .desc{
                font-size: 0.12rem;
                text-align: center;
                line-height: 0.2rem;
                .strong{
                    font-size:0.16rem;
                    color:#f81131;
                }
            }
            .img{
                width:2.6rem ;
            }
            .opt-box {
                text-align: center;
                margin-top: 0.1rem;
                &.step1{
                    margin-top:0.5rem;
                }
            }
            .input, .btn {
                width: 2.8rem;
                height: 0.44rem;
                outline: none;
                border-radius: 0.22rem;
                box-sizing: border-box;
                border: solid 1px #111;
                text-align: center;
                margin: 0.1rem 0;
                font-size: 0.15rem;
            }
            .btn {
                font-size: 0.2rem;
                border-color: #f81131;
                background: #f81131 linear-gradient(to right, #f81131, #f91557);
                &:active {
                    transition: transform 100ms;
                    transform: scale(0.99);
                }
            }
        }
        .header {
            position: absolute;
            top: 0;
            width: 4.35rem;
            height: 1.7rem;
            background: #f81131 linear-gradient(to right, #f81131, #f91557);
            border-radius: 0 0 50% 50%;
            left: -0.3rem;
            box-shadow: 0 10px 20px 0 rgba(248, 17, 49, 0.3);
            .title {
                margin: 0.15rem auto 0.2rem;
                width: 2.6rem;
                height: 1.3rem;
                background: url(./images/title.png) no-repeat center;
                background-size: 75% auto;
            }
            .desc {
                color: #e5e5e5;
                font-size: 0.15rem;
                text-align: center;
            }
        }
        .delay{
            animation-delay: 0.2s;
        }
        .mask {
            position: fixed;
            top: 0;
            left: 0;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.44);
            color: #fff;
            padding-top: 3rem;
            text-align: center;
        }
        .detail{

        }
    }
</style>