<template>
  <div v-show="dataReady">
     <div class="container">   <!-- :style="pageHeigth" -->
      <div class="head">
        <img class="mainImg" src="../images/main3.png" alt="">
        <RollPlay />
      </div>
      <div class="content">
        <div v-show="showPage" class="page1">
          <div>
            <p>邀好友用车，领取 50元+每笔订单的 5% 返现<br/>接力邀请再得 30元+3% ，返现无上限！</p>
            <table width="100%" cellpadding="1" cellspacing="1">
              <tr>
                <td><span></span></td>
                <td>您邀10个好友A</td>
                <td>A邀10个好友B</td>
              </tr>
              <tr>
                <td>首单奖金</td>
                <td>50x10=500</td>
                <td>30x10x10=3000</td>
              </tr>
              <tr>
                <td>订单返现</td>
                <td>5000x10x5%=2500</td>
                <td>5000x10x10x3%=15000</td>
              </tr>
            </table>
            <div class="getPay"><span></span>平均水平下，您每年可得约2万元人民币</div>
          </div>
        </div>
        <div v-show="!showPage" class="page2">
          <div v-if="is_complde_rental===1">
            <p>我的赏金</p>
            <div class="price">¥<span>{{uMoney}}</span></div>
            <div class="links">
                <router-link to="/balanceHistory" class="balanceHistory">赏金记录</router-link>
                <router-link to="/inviteHistory" class="inviteHistory2">我的邀请记录</router-link>
            </div>
          </div>
          <div v-else class="disShare">
            <div class="links">
                <router-link to="/balanceHistory" class="balanceHistory">赏金记录</router-link>
                <router-link to="/inviteHistory" class="inviteHistory2">邀请记录</router-link>
            </div>
            <p>我的赏金</p>
            <div class="price">¥<span>{{uMoney}}</span></div>
          </div>
        </div>
        <div class="share" v-if="is_complde_rental">
          <fieldset>
            <legend>立刻邀请好友得奖金</legend>
          </fieldset>
          <div class="shareImg">
            <div v-show="isShareWx" @click="handleClickFriends()"><img class="wx_icon" src="../images/main_wx.png" alt=""><span> 微信好友</span></div>
            <div v-show="isShareWx" @click="handleClickCircle()"><img class="wx_icon" src="../images/main_wxf.png" alt=""><span> 朋友圈</span></div>
            <div @click="handleClickCode()"><img class="wx_icon" src="../images/main_code.png" alt=""><span> 二维码分享</span></div>
          </div>
        </div>
        <div v-show="showPage" class="pageBotton1" :class="fromCoupon ? 'fromCoupon': ''">
          <router-link to="/detail" class="inviteHistory">如何获得更多奖励</router-link>
          <router-link to="/inviteHistory" class="inviteHistory" v-show="!fromCoupon">我的邀请记录</router-link>
        </div>
        <div v-show="!showPage" class="pageBotton2">
          <div class="desc-btn" @click="toggleRule">
              <span>{{is_complde_rental?'如何获得更多奖励':'奖励说明'}}</span>
              <span class="icon" :class="showRule?'active':''"></span>
          </div>
          <Rules :showRule="showRule" :footStyle="footStyle"/>
        </div>
      </div>
    </div>
    <div class="foot" :style="IphoneXStyle" v-show="!fromCoupon">
        <div class="footMoney">已获得奖励：<span>{{uMoney}}</span>元</div>
        <div class="extract" @click="handleClickErt()"><span>立刻提现</span></div>
    </div>
    <div v-show="isShowCode" class="mark" @touchmove.stop="move">
      <div class="code">
        <div class="codeTitle">
          <img src="../images/invite_btn3.png" alt="">
        </div>
        <div class="showCode">
          <img ref="imgs" src="" alt="">
          <div class="text">截图分享给好友，一起分现金！</div>
        </div>
        <div class="closeCode" @click="handleClickCloseCode"><img src="../images/close.png" alt=""></div>
      </div>
    </div>
    <Pop :type="type" v-if="show_pop" @popDestroy="popDestroy"/>
  </div>
</template>

<script>
  import RollPlay from '../components/rollPlay'
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import QRCode from 'qrcode'
  import Pop from '../components/pop'
  import env from '../../../../../other_modules/like-env'
  import appArguments from '../../../../../other_modules/app-arguments'
  import myAjax from "../../../../../other_modules/like-request/withAxiosV2";
  import {getApiUrl} from "../js/getApiUrl";
  import { IsWeiXin, IsIos } from "../../../../js/UserAgent.js";
  import {mapGetters} from 'vuex'
  import WxShare from '../js/thisWxShare'
  import format from "../../../../../other_modules/like-function/format";
  import Rules from '../components/rules'

  export default {
    name: "mainPage",
    components:{
      RollPlay,
      Pop,
      Rules
    },
    data(){
      return{
        showPage : true,   // 没有赏金页面
        isShowCode: false,  // 二维码的显示
        isShareWx : false,
        uMoney:"0.00", // 用户赏金
        type:'scan',
        show_pop:false,
        showRule: false,
        footStyle:"padding-bottom: 0",
        IphoneXStyle:"",
        drawState:0,
        dataReady:false,
        loading : "",
        // pageHeigth:"height:6.67rem"
        fromCoupon:false,
        is_complde_rental:1
      }
    },
    computed:{
      ...mapGetters(['publicArguments'])
    },
    methods:{
      move(e){
        e.preventDefault()
      },
      // 二维码
      handleClickCode(){
        this.createCode();   // 二维码的生产
        this.isShowCode = true;
      },
      // 关闭二维码
      handleClickCloseCode(){ 
        this.isShowCode = false;
      },
      //分享微信好友
      handleClickFriends(){
        this.share(11,2)
      },
      // 分享到朋友圈
      handleClickCircle(){
        this.share(11,1)
      },
      share(shareType,destination){
        let data = {
            share_type: shareType,
            destination: destination
        }
        appMutual.share.wx(data)
      },
      // 领取赏金的提示；
      handleClickErt(){
        //1.是否有有钱可提        
        if(Number(this.uMoney)>0){  
          switch (this.drawState) {
            case 0:
              this.$router.push("/drawInfo");
              break;

            case 1:
              this.type="time"
              this.show_pop=true
              break;

            case 2:
              this.$_LIKE_toast("您的违章尚未处理，缴纳保证金后可申请提现。")
              break;

            case 3:
              this.$_LIKE_toast("您的自助缴费单尚未支付，缴纳后可申请提现")
              break;
            case 4:
              this.$_LIKE_toast("您有订单待支付，结算后可申请提现")
              break;

            default:
              this.$_LIKE_toast("系统繁忙，请稍后")
              break;
          }
        }else{
          this.$_LIKE_toast("您无现金可提，赶快邀请好友吧")
        }  
      },
      // 生产二维码
      createCode(){
        let host = env.isDev ?  "https://h5test.likechuxing.com/" :  "https://activity.likechuxing.com/"
        let _that = this
        let codeHref = host + "activity/inviteFriends4?scan=1&inviter_uuid="+this.publicArguments.uuid
        QRCode.toDataURL(codeHref, { errorCorrectionLevel: 'H' }, function (err,url) {
          _that.$refs.imgs.setAttribute("src",url)
        })
      },
      popDestroy(){
        this.show_pop = false
      },
      handleErr(err){
        this.loading.close();
        this.dataReady = true; 
        console.log(err)
        if(err && err.msg){
          this.$_LIKE_toast(err.msg)
        }
      },
      toggleRule () {
        this.showRule = !this.showRule
      },
     
    },
  // 判断用户进入的页面
    created(){
      myAjax.get(getApiUrl('/time/get')).then((res)=>{
        if(res.status===0){
          this.$store.commit('setServerTime',res.data.timestamp)
        }
      })
      
      // 是否是微信   
      this.loading = this.$_LIKE_loading()
      if(IsWeiXin()){
        this.isShareWx = false;
      }else{
        this.isShareWx = true;
      }

      
      
      if(!this.publicArguments.uuid){
        if(!appArguments.uuid){
          if(env.isInLike){
            appMutual.jump.loginAndCloseThisWebview({
              destroy_current:1
            })
          }
        }else{
          this.$store.commit('setUuid',appArguments)
        }
      }else{
        WxShare(this.publicArguments.uuid)
      }
      
      // if(appArguments.channel !== '0_9106'){
      myAjax.post(getApiUrl('/activity-invite-cash/invite-detail'),this.publicArguments).then(res=>{
        if(res.status === 6001){
          if(IsWeiXin()){
            this.$router.replace("/register");
            this.$_LIKE_toast("您的账号在app中已经登录，请重新登录");
            this.loading.close();
            return;
          }
        }
        if(res.status === 0){
          this.loading.close();
          this.uMoney = format.money(res.data.cash);
          this.drawState = res.data.limit_type
          this.is_complde_rental = res.data.is_complde_rental
          if(Number(res.data.history_money)>0 || Number(res.data.cash) > 0){
            this.showPage = false;
          }else{
            this.showPage = true;
          }
          this.dataReady = true;
        }else{
          this.loading.close();
          this.dataReady = true;
          throw res
        }
      }).catch(this.handleErr)
      // }else{
      //   this.loading.close();
      //   this.dataReady = true;
      //   this.fromCoupon=true;
      //   WxShare(this.publicArguments.uuid)
      // }


      if((window.screen.width/window.screen.height)<0.5 && IsWeiXin() && IsIos()){
        this.IphoneXStyle="paddingBottom:.15rem;height:.69rem;"
      }
    },
    mounted(){
      if(!env.isWeiXin && !env.isInLike){
        this.type='scan'
        this.show_pop=true;
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{

    display: flex;
    flex-direction: column;
    // height: 100%;
    .mainImg{
      width: 100%;
      height: 2.22rem;
    }
    .content{
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 0.8rem;
      .page1{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #908F8F;
        padding-bottom: .3rem;
        div{
          padding: .3rem .23rem 0 .2rem;
          box-sizing: border-box;
          width: 100%;
          p{
            font-size:16px;
            color:#19191F;
            line-height:19px;
            text-align: left;
            padding-left: .04rem;
          }
          table{
            // border: 1px solid #FFF;
            
            color: #000E20;
            font-size: 12px;
            padding: .22rem 0 .1rem;
            tr{
              height: .28rem;
              td{
                span{
                  display: block;
                  width:.08rem;
                  height:.02rem;
                  background: #FFF;
                  opacity:0.6;
                  margin: 0 auto;
                }
              }
            }
            tr:nth-of-type(1){
              background:#FE1A15;
              color: #FFF;
            }
            tr:nth-of-type(2){
              background:#FE9E9C
            }
            tr:nth-of-type(3){
              background:#FFDDDC
            }
          }
          .getPay{
            margin: 0;
            padding: 0;
            font-size: 12px;
            color: #908F8F;
            text-align: left;
            position: relative;
            padding-left: .15rem;
            span{
              position: absolute;
              width:.04rem;
              height:.04rem;
              border-radius: .04rem;
              opacity: 0.67;
              left: .06rem;
              top: .06rem;
              background: #AEACAC;
              padding: 0;
            }
          }
    
        }
      }
      .page2{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        text-align: center;
        font-size: 16px;
        color: #908F8F;
        .disShare{
          .links{
             margin-top: .45rem;
             margin-bottom: 0;
             .balanceHistory{
                color:#908F8F;
                margin-left: 0rem;
                background: url(../images/main_right3.png) no-repeat right center;
                background-size: 7px 13px;
             }
             .inviteHistory2{
                color:#908F8F;
                margin-right: 0rem;
                background: url(../images/main_right3.png) no-repeat right center;
                background-size: 7px 13px;
             }
          }
          p{
             padding-top: .72rem;
             font-size: 30px;
             line-height: 30px;
            //  padding-bottom: .2rem
          }
          .price{
            margin-top: .2rem;
            font-size: 35px;
            span{
              font-size: 58px;
            }
          }
        }
        p{
          padding-top: .42rem;
          padding-bottom: .16rem;
          height: .2rem;
          font-size: 21px;
          color: #4A4A54;
          letter-spacing: .01rem;
        }
        .price{
          // font-family: PingFang SC;
          margin-left: -0.15rem;
          color:#FE1A15;
          font-size: 19px;
          margin-bottom: .33rem;
          span{
            display: inline-block;
            font-size: 36px;
            line-height: .3rem;
            padding-left: .1rem;
            letter-spacing: .02rem;
          }
        }

        .links{
          position: relative;
          width: 100%;
          margin-bottom: .32rem;
          color:#4a4a54;
          font-size: 16px;
          .balanceHistory{
            background: url(../images/main_right.png) no-repeat right center;
            background-size: 7px 13px;
            padding-right: .15rem;
            position: absolute;
            left: 0;
            margin-left: .5rem;
          }
          .inviteHistory2{
            margin-right: .1rem;
            margin-left: 1.9rem;
            padding-right: .15rem;
            background: url(../images/main_right.png) no-repeat right center;
            background-size: 7px 13px;
          }
        }
      }
      .inviteHistory{
        font-size: 16px;
        color: #908F8F;
        padding-top: .18rem;
      }
      .share{
        display: flex;
        flex-direction: column;
        align-items: center;
        // margin-top: .35rem;
        width: 100%;
        padding: 0 .27rem 0 .24rem;
        box-sizing: border-box;
        color: #908F8F;
        fieldset{
          border: none;
          border-top: 0.01rem solid #CAC9C9;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          legend{
            font-size: 13px;
            padding: 0 .23rem;
            background: #FFF;
          }
        }
        .shareImg{
          display: flex;
          width: 100%;
          text-align: center;
          font-size: 13px;
          div{
            flex: 1;
            span{
              display:block;
              padding-top: .08rem;
            }
          }
          
        }
      }
      .pageBotton1{
        box-sizing: border-box;
        padding: .3rem .32rem 0;
        width: 100%;
        .inviteHistory{
          background: url(../images/main_right2.png) no-repeat;
          background-size: 6px 11px;
          background-position: right center;
          padding-right: .15rem;
          padding-top: 0; 
          color: #2c2c31;
          font-size: 13px;
          // margin-top: .25rem;          
          &:nth-child(2){
            float: right;
          }
          &:nth-child(1){
            float: left;
          }
        }
        &.fromCoupon{
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .pageBotton2{
        .desc-btn {
          display: flex;
          justify-content: center;
          align-items: center;
          padding-top: .4rem;
          span:nth-child(1){
            font-size: 13px;
          }
          .icon {
            width: .075rem;
            height: .05rem;
            background: url('../images/arrow.png') no-repeat;
            background-size: 100% 100%;
            margin-left: .065rem;
            transition: transform .35s;
            &.active {
                transform: rotate(180deg)
            }
          }
        }
      }
    }
  }
  .wx_icon{
    width: 0.42rem;
    height: 0.42rem;
  }
  .foot{
    width: 100%;
    display: flex;
    align-items: center;
    background: #FE1A15;
    height: .54rem;
    box-sizing: border-box;
    padding-left: .25rem;
    position: fixed;
    bottom:0;
    .footMoney{
      font-size: 18px;
      color: #FFF;
    }
    .extract{
      flex: 1;
      span{
        float: right;
        margin-right: .25rem; 
        // // right: 0;
        /* display: inline-block; */
        width: 1.03rem;
        height: .3rem;
        background: #FFF;
        color: #FE1A15;
        /* line-height: .3rem; */
        font-size: 18px;
        // font-weight: bold;
        letter-spacing: 0.01rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .02rem;
      }
    }
  }
  .mark{
      position: fixed;
      top: 0;
      z-index: 9;
      width: 100%;
      height: 100%;
      background: #252525;
      background:rgba(37,37,37,0.5);
      .code{
        margin-left: .4rem;
        margin-top: .85rem;
        position: absolute;
        width: 2.95rem;
        /* //height: 3.75rem; */

        border-radius: .03rem;
        .codeTitle{
          img{
            width: 2.95rem;
            height: 1.23rem;
            border-radius: 3px 3px 0 0
          }
        }
        .showCode{
          border-radius: 0 0 3px 3px;
          background: #FFF;
          text-align: center;
          img{
            width: 2.54rem;
          }
          .text{
            margin-top: -0.05rem;
            font-size: 13px;
            color:#888;
            padding-bottom: 0.15rem;
          }
        }
        .closeCode{
          display: flex;
          justify-content: center;
          img{
            transform: scale(0.5);
          }
        }
      }
    }
</style>