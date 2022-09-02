<template>
    <div class="container">
        <div class="header" :class="userSource=='wx'?'type2':'type1'"></div>
        <div class="body">
            <div class="form-group">
                <div class="form-item">
                    <div class="input-wrap">
                        <input type="number" v-model="phone" :style="inputStyle" placeholder="输入手机号接受邀请" class="phone"
                               :class="userType=='b'?'flex1':''">
                        <img @click="handleClickReset()" v-show="showIcon" class="resetBtn" src="../images/register_reset.png" />
                    </div>
                    <div class="code-box" v-show="userType=='a'" @click="getCode">
                        <span class="desc" v-show="!showCount">获取验证码</span>
                        <span class="desc" v-show="showCount">{{s}}s</span>
                    </div>
                </div>
                <div class="form-item" v-show="showCodeInput">
                    <input type="number" placeholder="输入验证码" v-model="code">
                </div>
            </div>
            <div class="btn" @click="verifyCode">
                <span>{{userSource=='wx'?'立刻领取红包':'登录领取新人红包'}}</span>
            </div>
        </div>
        <div class="desc-btn" @click="toggleRule">
            <span>活动规则</span>
            <span class="icon" :class="showRule?'active':''"></span>
        </div>
        <Rules :showRule="showRule"/>
        <Pop :type="type" v-if="show_pop" @popDestroy="popDestroy"/>
    </div>
</template>

<script>
  import {getApiUrl as api} from "../js/getApiUrl";
  import http from "../../../../../other_modules/like-request/withAxiosV2";
  import Rules from '../components/rules'
  import Pop from '../components/pop'
  import env from '../../../../../other_modules/like-env'
  import WxShare from '../js/thisWxShare'
  import userData from '../js/UserData'

  export default {
    name: "register",
    components: {
      Rules,
      Pop
    },
    data () {
      return {
        type: 'scan',
        show_pop: false,
        userType: '',
        userSource: '',
        channel: '',
        inviter_uuid: '',
        getCodeSuccess: false,
        phone: '',
        code: '',
        showCount: false,
        s: 60,
        showRule: false,
        phoneHistory:"",
        inputStyle:"",
        isGoRgtFinish:"1"
      }
    },
    computed: {
      showCodeInput () {
        let {userType, getCodeSuccess} = this;
        if (userType == 'a') {
          return true
        } else {
          if (getCodeSuccess) {
            return true
          } else {
            return false
          }
        }
      },
      showIcon(){
        if(this.userType === "b"){
          if(this.phone){
            return true
          }else{
            this.getCodeSuccess = false;
            this.code = "";
            return false
          }
        }else{
          return false;
        }
      }
    },
   
    
    created () {       
      if(userData.state.uuid){
        this.$store.commit('setUuid', userData.state)
        this.$router.replace({
          path: '/registerFinish',
        })
      }
      
      let query = this.getQuery(window.location.search).query;
      this.userType = "b";
      this.userSource = query.from;
      this.channel = query.channel;
      this.inviter_uuid = query.inviter_uuid
      // console.log(query);

      if(this.userType == "b"){
        this.inputStyle="paddingRight: .38rem;"
      }else{
        this.inputStyle=""
      }

      WxShare(query.inviter_uuid)
    },
    mounted () {
      if (!env.isWeiXin && !env.isInLike) {
        this.type = 'scan'
        this.show_pop = true;
      }
    },
    methods: {
      popDestroy () {
        this.show_pop = false
      },
      getCode () {

        let {phone, showCount} = this;
        let phoneReg = /^1[3456789]\d{9}$/
        if (showCount) {
          if(this.phone === this.phoneHistory){
            this.$_LIKE_toast(`请在${this.s}秒后重试`) 
            return
          }         
        }
        if (phone == '') {
          this.$_LIKE_toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(phone)) {
          this.$_LIKE_toast('请输入正确的手机号')
          return
        }
        this.countDown()        
        let data = {
          phone,
          activity_id: 1050,
          inviter_uuid:this.inviter_uuid
        }
        const _this = this;
        this.ClickBg ="";
        this.ClickColor="";
        http.post(api('web/invite-get-code'), data).then(res => {          
          if (res.status == 0 || res.msg === '验证码已发送,请注意查收') {
            this.$_LIKE_toast('发送成功')
            
            this.phoneHistory = phone;
            _this.getCodeSuccess = true
          } else {
            this.$_LIKE_toast(res.msg)
          }
        })

      },
      countDown () {
        this.showCount = true
        let s = 60        
        const _this = this;
        this.timer && clearInterval(this.timer)
        this.timer = setInterval(() => {
          s--;          
          if (s == 0) {
            clearInterval(this.timer)
            _this.showCount = false;
            s = 60;
          }
          _this.s = s
        }, 1000)
      },
      getCoupon () {      
        let {phone, channel, code, inviter_uuid} = this;
        let phoneReg = /^1[3456789]\d{9}$/
        if (phone == '') {
          this.$_LIKE_toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(phone)) {
          this.$_LIKE_toast('请输入正确的手机号')
          return
        }
        if (code == '') {
          this.$_LIKE_toast('验证码不能为空')
          return
        }
        if (code.length != 4) {
          this.$_LIKE_toast('请输入正确的验证码')
          return
        }
        if (channel == '' || !channel) {
          return
        }
        let data = {
          phone,
          code,
          activity_id: 1050,
          channel: channel,
          inviter_uuid
        }
        let _this = this;
        http.post(api('web/invite-verify-code'), data).then(res => {
          if (res.status === 0) {
            window._czc.push(["_trackEvent", 'login', this.userType, this.channel.split('_')[0]]);
            let userInfo = {
              phone: res.data.phone,
              new_user: res.data.new_user
            }
            let userSign = {
              uuid: res.data.uuid,
              sign: res.data.sign,
              new_user: res.data.new_user,
              phone:res.data.phone
            }
            _this.$store.commit('setUuid', userSign)
            _this.$store.commit('setUserInfo', userInfo)
             console.log(233)
            userData.save(userSign)
            console.log(233)
            _this.$router.replace({
              path: '/registerFinish',
            })
          } else {
            this.$_LIKE_toast(res.msg)
          }

        }).catch(err => {
          console.log('http', err)
        })
      },
      verifyCode () {
        let {userType, getCodeSuccess} = this;
        if (userType == 'a') {
          this.getCoupon()
        } else {
          if (!getCodeSuccess) {            
            this.getCode()
          } else {
            this.getCoupon()
          }
        }
      },
      getQuery (url) {
        let
          res = {
            query: {}
          },
          reg = /([^?=&]+)=([^?=&]+)/g;

        url.split('#')[0].replace(reg, function () {
          res.query[arguments[1]] = arguments[2];
        })
        let index = url.indexOf('?');
        res.origin = index === -1 ? url : url.substr(0, index);
        return res;
      },
      toggleRule () {
        this.showRule = !this.showRule
      },
      beforeDestory () {
        this.timer && clearInterval(this.timer)
      },
      handleClickReset(){
        this.phone ="";
        this.getCodeSuccess = false;
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
      if(from.path === "/main"){
        userData.state = {}
      }
    }
  }
</script>

<style lang="less" scoped>
    * {
        box-sizing: border-box;
    }

    .container {
        .header {
            height: 2.2rem;
            &.type1 {
                background: url('../images/main2.png') no-repeat;
                background-size: 100% 100%;
            }
            &.type2 {
                background: url('../images/header_re_type2.png') no-repeat;
                background-size: 100% 100%;
            }
        }
        .body {
            padding: .4rem .32rem;
        }
        .form-group {
            .form-item {
                display: flex;
                align-items: center;
                margin-bottom: .15rem;
                .phone {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                .input-wrap {
                    flex: 1;
                    position: relative;
                    .flex1 {
                        width: 100%;
                        border-radius: 2px;
                    }
                    .resetBtn{
                      position: absolute;
                      transform: scale(0.15);
                      top:-0.42rem;
                      right: -.4rem;

                    }
                }
                input {
                    display: block;
                    flex: 1;
                    width: 100%;
                    height: .45rem;
                    border-radius: 2px;
                    border: 1px solid #c0c1c2;
                    font-size: .16rem;
                    padding: 0 .15rem;
                    background: #fcfdfe;
                    // 
                    // padding-right: .38rem;
                    &::-webkit-input-placeholder{
                      color: #a4a5a7;
                      // letter-spacing: .02rem;
                      font-size: 16px;
                    }
                }
                .code-box {
                    width: 1.2rem;
                    height: .45rem;
                    font-size: .16rem;
                    color: #a3a4a6;
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                    background: #e8e9eb;
                    border: 1px solid #c0c1c2;
                    border-left: none;
                    span:nth-child(1){
                      display: inline-block;
                      width: 100%;
                      height: 100%;
                      background: #FC241C;
                      color: #FFF;
                      text-align: center;
                      line-height: .45rem;
                    }
                    span:nth-child(2){
                      display: inline-block;
                      width: 100%;
                      height: 100%;
                      text-align: center;
                      line-height: .45rem;
                    }
                }
            }

        }
        .btn {
            height: .45rem;
            color: #fff;
            background: #FC241C;
            font-size: .17rem;
            line-height: .45rem;
            text-align: center;
            border-radius: 2px;
        }
        .desc-btn {
            display: flex;
            justify-content: center;
            align-items: center;
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
</style>