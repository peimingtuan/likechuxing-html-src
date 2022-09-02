<template>
    <div class="invite" :style="isWeiXin?'':'padding-bottom:.6rem'">
        <div class="banner"></div>
        <div class="box">
            <div class="title">分享获得<span class="danger"><span class="bigger">30</span>元</span>红包</div>
            <div class="desc desc_invite">邀请好友获取优惠出行机会</div>
            <div class="desc" style="marginTop:0.3rem">{{isWeiXin?'我的专属优惠码':'我的专属优惠码，长按复制'}}</div>

            <div class="code" @click="toCopy">
                {{code}}
                <!--<span class="letter" v-for="item,index in code" :key="index">{{item}}</span>-->
            </div>

            <div class="invite-box" v-if="show_invite">
                <p>立刻分享</p>
                <div class="share-box" @click="share(2)">
                    <div class="icon wx"></div>
                    <div class="text">微信</div>
                </div>

                <div class="share-box float-right" @click="share(1)">
                    <div class="icon pyq"></div>
                    <div class="text">朋友圈</div>
                </div>

            </div>
            <div class="invite-info" v-else-if="isWeiXin">
              快点击屏幕右上方按钮<br/>分享给好友吧
            </div>
        </div>
        <div class="footer" v-if="isWeiXin">
            <router-link to="/detail">
                <span class="text">查看邀请规则</span>
           </router-link>
        </div>
        <div class="invite-foot" v-if="!isWeiXin">
          <p>已获得红包共：{{totalCoupon}}元</p>
          <router-link class="fot-btn" to="/inviteHistory">查看</router-link>
        </div>
    </div>
</template>

<script>
  import env from '../../../../../other_modules/like-env'
  import appArguments from '../../../../../other_modules/app-arguments'
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV3'
  import {getApiUrl,getH5Url} from "../../../../../other_modules/url-constructor";
  import wxShare from '../js/thisWxShare2'
  // require('../../../../component/vconsole')

  export default {
    name: "invite",
    data(){
      return {
        show_invite:true,
        uuid:'',
        sign:'',
        code:'--',
        dataReady:false,
        count:0,
        isWeiXin:env.isWeiXin,
        totalCoupon:0
      }
    },
    methods:{
      animatedCode(){
        if(!this.dataReady){
          let length = this.code.length
          if(length < 6){
            this.code+='-'
          }else{
            this.code = '--'
          }

          setTimeout(this.animatedCode,300)
        }
      },

      getCode(){
        myAjax.post(getApiUrl('/user/share-code'),{
          uuid:this.uuid,
          sign:this.sign
        }).then(res=>{
          if(res.status === 6001){
            this.toLogin()
          }else if(res.status === 0){
            this.code = res.data.code
            this.totalCoupon = res.data.total_coupon_cash
            this.dataReady = true
          }else{
            this.$_LIKE_toast(res.msg)
          }
        })
      },

      share(des){
        appMutual.share.wx({
          share_type: '4',
          activity_id:appArguments.entry || 0,
          destination: des
        })
      },

      toCopy(){
        if(env.isWeiXin){
          this.$_LIKE_toast('赶快点击右上角分享吧！')
        }else{
          if(this.dataReady){
            appMutual.send.copy(this.code)
  
            setTimeout(()=>{
              this.$_LIKE_toast('复制成功')
            },1000)
          }else{
            this.$_LIKE_toast('请稍等，邀请码马上就绪')
          }
        }
      },

      toLogin(){
        if(env.isInLike){
          appMutual.jump.loginAndCloseThisWebview({
            destroy_current:1
          })
        }
      }
    },
    created(){            
      // 如果是非app环境打开，隐藏微信分享按钮
      if(!env.isInLike) this.show_invite = false
      if(env.isWeiXin){
        if(appArguments.code && appArguments.mobile){
          wxShare(appArguments.mobile,appArguments.code,appArguments.channel)
          this.code = appArguments.code;
        }else {
          // window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car'
        }
      }else{
        appMutual.send.updateHeaderRight("邀请规则","toDetail")
        window.toDetail = ()=>{
          appMutual.send.url({
            url:getH5Url('/app/inviteCode/index.html#/detail'),   //
            request_type:'get',
            destroy_current:0   // 是否销毁之前页
          })
        }
        if(appArguments.uuid){
          this.uuid = appArguments.uuid
          this.sign = appArguments.sign
          this.animatedCode()
          this.getCode()
        }else {
          this.toLogin()
        }
      }
    },
  }
</script>

<style lang=less scoped>
.invite{
    color:#111;
    min-height: 100vh;
    position: relative;
    .banner{
        width: 100%;
        height: 2.78rem;
        background: url('../images/banner_1.png') no-repeat center;
        background-size: 100% 100%;
    }

    .box{
        width: 3.45rem;
        margin: -0.5rem auto 0;
        padding: 0.23rem 0;
        background-color: #fff;
        border-radius: 2px;
        text-align: center;

        .title{
            font-size: 28px;
            /* letter-spacing: 1px; */
            font-weight: bold;
            margin:0.11rem 0;
            .danger{
              position: relative;
              padding-left: 41px;
              .bigger{
                position: absolute;
                  font-size: 29px;
                  left: 5px;
                  top: 0px;
                  font-weight: 600;
              }
            }
        }

        .desc{
            margin:0.1rem 0;
            color:#999;
            font-size: 14px;
        }
        .desc_invite{
          color:#222;
          font-size: 18px;
        }
        .code{
            margin:0 auto;
            padding: .05rem 0;
            width: 1.1rem;
            line-height: 15px;
            border:dashed 1px #111;
            background: rgba(73,75,81,0.06);
            border-radius: 2px;
            text-align: center;
            font-size: 16px;
            .letter{
                display: inline-block;
                width: 0.8em;
            }
        }

        .invite-box{
            width: 2.5rem;
            margin:0.35rem auto 0;
            /* border-top:solid 1px #F2F2F2; */
            text-align: left;
            p{
              text-align: center;
              margin: 0 auto;
              width: 100%;
              color: #9B9B9B;
              font-size: 12px;
              &::before,&::after{
                content: '';
                border-top:solid 1px #F2F2F2;
                width: .72rem;
                display: inline-block;
                margin: 0 10px 2px;
              }
            }
            .share-box{
                display: inline-block;
                margin: 0.1rem 0.32rem;
                text-align: center;
                width: 0.44rem;
                .icon{
                    width: 100%;
                    height:0.44rem;
                    background: no-repeat center;
                    background-size: 100%;
                    &.wx{
                        background-image: url('../images/wx2.png');
                    }
                    &.pyq{
                        background-image: url('../images/pyq2.png');
                    }
                }
                .text{
                    font-size: 12px;
                    color:#999;
                    margin:0.04rem 0;
                }
            }
        }
        .invite-info{
          margin:0.45rem auto 0;
          text-align: center;
          color:#999;
        }
    }

    .footer{
        position: absolute;
        bottom:0.15rem;
        font-size: 12px;
        text-align: center;
        width: 100%;
        .text{
            color:#0A86F9;
        }
    }
    .invite-foot{
      position: fixed;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0 .15rem 0 .2rem;
      height: .5rem;
      background: #494B51;
      color: #fff;
      p{
        flex: 1;
        font-size: 16px;
        opacity: 0.9;
      }
      .fot-btn{
          border: 1px solid #FFF;
          padding: .03rem .13rem;
          border-radius: 2px;
          opacity: 0.9;
          color: #FFF;
      }
    }
}
</style>