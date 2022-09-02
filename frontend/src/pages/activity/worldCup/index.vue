<template>
    <div class="Main">
        <header class="header"></header>
        <main class="container">
            <div v-if="matches.length > 0">
                <MatchBox
                        v-for="match in matches"
                        :key="match.match_id"
                        :match="match"
                        :time_server="time_server"
                        :betting="getBetByMatch(match.match_id)"
                        @bet="handleBet"
                />
            </div>
            <div v-else class="matchLoading animated infinite pulse">正在努力加载今日比赛...</div>
            <div class="option">

                <p class="line">猜对即可获得10积分</p>

                <!--微信里且参与过显示-->
                <p v-if="!in_app && has_bet" class="line">积分可在APP内兑换话费等好礼</p>

                <!--登录后信息-->
                <div class="login_box" v-if="is_login && matches.length>0">
                    <div class="user line">{{user_name}} <span v-if="!in_app" class="link" @click="logout">退出</span></div>
                    <div class="line"><span class="link" @click="toPoint">查看我的积分</span></div>
                </div>

                <!--非app中提示去app-->
                <p class="mini line" v-if="!in_app">下载APP赢更多积分，抢免费开车资格</p>

                <!--不同情况下的按钮-->
                <button class="btn" @click="toDownload" v-if="!in_app">立刻下载</button>
                <button class="btn" @click="inviteFriends" v-else>邀请好友竞猜得更多积分</button>
                <ul class="invite_list">
                    <li v-for="item,index in invite" :key="item.create_at">
                        <div class="new" v-if="item.extra_info.is_new"></div>
                        <div>
                            <span class="con">
                                <span class="item index">{{index+1}}</span>
                            <span class="item num">{{item.extra_info.mobile}}</span>
                            <span class="item">助威世界杯！</span>
                            </span>
                        </div>
                    </li>
                </ul>

                <div class="line"><span class="link" @click="()=>this.show_detail=true">竞猜攻略</span></div>
            </div>
        </main>
        <footer class="footer"></footer>

        <!--<transition
                name="custom-classes-transition"
                enter-active-class="animated faster fadeIn"
                leave-active-class="animated fadeOut">
            <div class="banner" v-if="!in_app && show_banner" @click="hideBanner"></div>
        </transition>-->

        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut">
            <Login
                    v-if="show_login"
                    @close="()=>{this.show_login=false}"
                    @login="login"
            />
        </transition>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut">
            <BetAlert
                    v-if="show_alert"
                    :msg="alert_msg"
                    @close="()=>{this.show_alert=false}"
            />
        </transition>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut">
            <Detail
                    v-if="show_detail"
                    @close="()=>{this.show_detail=false}"
            />
        </transition>
    </div>
</template>

<script>
  import {Alert, Toast, Loading, Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import {appMutual} from '../../../../other_modules/app-mutual'
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import env from '../../../../other_modules/like-env'
  import LocalData from './js/localData'
  import MatchBox from './components/matchBox'
  import BetAlert from './components/betAlert'
  import Login from './components/login'
  import Detail from './components/details'
  import wxShareSelector from '../../../component/wxShareSelector'
  import wxShare from './js/thisWxShare'

  require('../../../../other_modules/css-animate/animate.less')

  const localData = new LocalData()

  export default {
    name: "mainPage",
    components: {
      MatchBox,
      Login,
      BetAlert,
      Detail
    },
    data() {
      return {
        in_app: appArguments.in_app,
        uuid: appArguments.uuid || localData.state.uuid,
        sign: appArguments.sign || localData.state.sign,
        new_user: localData.state.new_user,
        show_login: false,
        show_alert: false,
        show_detail: false,
        show_banner: true,
        alert_msg: [
          '请打开「立刻出行」',
          '在活动页面参与此竞猜'
        ],
        time_server: 0,
        user_name: '',
        matches: [],
        betting: [],
        invite: []
      }
    },
    computed: {
      has_bet() {
        return this.betting.length > 0
      },
      is_login() {
        return this.uuid && this.sign
      }
    },
    created() {
      let that = this
      this.getMatch()
      myAjax.getting.then(() => {
        this.time_server = myAjax.server_time
        setInterval(function () {
          that.time_server += 1
        }, 1000)
      })

      if(env.isWeiXin){
        wxShare(this.uuid || '')
      }
    },
    methods: {
      inviteFriends() {
        wxShareSelector({
          cb: function (destination) {
            appMutual.share.wx({
              share_type: '10',
              destination
            })
          },
          msg: ''
        })
      },
      getBetByMatch(match_id) {
        if (this.betting.length === 0) return ''

        let match_bet = this.betting.find(item => item.match_id === match_id)
        if (match_bet) {
          return match_bet.betting
        } else {
          return ''
        }
      },
      getMatch() {
        let data = {}
        if (this.is_login) {
          data.uuid = this.uuid
          data.sign = this.sign
        }
        myAjax.post(getApiUrl('activity-world-cup/betting-list'), data).then(res => {
          if (res.status === 0) {
            this.matches = res.data.match_list
            if (res.data.user) {
              this.user_name = res.data.user.name
              this.betting = res.data.user.betting
              this.invite = res.data.user.invite_list
            } else {
              if(this.uuid) this.logout()
            }
          } else {
            Toast(res.msg)
          }
          console.log(res)
        }).catch(err => [])
      },
      handleBet(data) {
        let _data = {
          uuid: this.uuid,
          sign: this.sign,
          match_id: data.match_id,
          option: data.team_id,
        }
        if (appArguments.inviter_uuid) _data.inviter_uuid = appArguments.inviter_uuid
        if (localData.state.new_user) _data.is_new = 1

        console.log(this.in_app)
        if (this.in_app) {
            if(this.is_login){
              _data.channel = 'app'
              this.betMatch(_data)
            }else{
              Alert({
                title:'提示',
                msg:'请登录后参与活动',
                confirmButtonText:'知道了',
                confirmButtonCallback:function(){
                  appMutual.jump.loginAndCloseThisWebview({
                    destroy_current:1
                  })
                }
              })
            }

        } else {
          // wx
          if (this.is_login) {
            // wx 登陆了
            _data.channel = 'weixin'
            this.betMatch(_data)
          } else {
            // wx 没登录
            this.show_login = true
          }
        }
      },
      betMatch(data) {
        let loading = Loading()
        myAjax.post(getApiUrl('activity-world-cup/betting'), data).then(res => {
          loading.close()
          if (res.status === 0) {
            this.alert_msg = [
              '竞猜成功',
              '邀请好友参加还可得积分（300积分可在商城兑换30元话费）'
            ]
            this.show_alert = true
            this.getMatch()
          } else if (res.status === 11011) {
            // 微信端多次投注，被阻止
            this.alert_msg = [
              '请打开「立刻出行」',
              '在活动页面参与此竞猜'
            ]
            this.show_alert = true
          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          loading.close()
        })
      },
      toDownload() {
        if (env.isIos) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      },
      login(data) {
        this.show_login = false
        localData.save(data)
        this.uuid = data.uuid
        this.sign = data.sign
        this.new_user = data.new_user
        this.getMatch()
        if(env.isWeiXin){
          wxShare(this.uuid)
        }
      },
      logout() {
        this.uuid = ''
        this.sign = ''
        this.betting = []
        this.invite = []
        localData.save({
          uuid: '',
          sign: ''
        })
      },
      toPoint() {
        window.location.href = './point.html?uuid=' + this.uuid + '&sign=' + this.sign
      }
    }
  }
</script>

<style lang="less">
    .Main {
        .matchLoading {
            margin: 0.4rem 0;
            text-align: center;
            font-size: 12px;
            color: #fff;
        }
        .option {
            text-align: center;
            color: #fff;
            line-height: 0.2rem;
            .line {
                margin: 0.1rem 0;
            }
            .login_box {
            }
            .btn {
                margin: 0.05rem 0;
                width: 100%;
                height: 0.4rem;
                border-radius: 0.2rem;
                background-color: #fcdd38;
                color: #0a2756;
                font-size: 16px;
                border: none;
                box-shadow: 3px 5px 10px 0 rgba(0, 0, 0, 0.3);
                outline: none;
                &:active {
                    transition: all 100ms;
                    transform: scale(0.98);
                    box-shadow: 2px 3px 5px 0 rgba(0, 0, 0, 0.1);
                }
            }
            .mini {
                font-size: 12px;
                margin-bottom: 0;
            }
            .link {
                color: #fcdd38;
                border-bottom: solid 1px #fcdd38;
            }
            .invite_list{
                margin:0.2rem 0;
                .new{
                    width: 0.28rem;
                    height: 0.28rem;
                    margin:0 auto;
                    background: url('./images/new.png') no-repeat center;
                    background-size: 100% auto;
                }
                .con{
                    display: inline-block;
                    text-align: left;
                }
                .item{
                    margin:0 0.02rem;
                    line-height: 0.14rem;
                    &.num{
                        display: inline-block;
                        width: 6.5em;
                        text-align: center;
                    }
                    &.index{
                        text-align: center;
                        display: inline-block;
                        width: 0.14rem;
                        border-radius: 0.1rem;
                        background-color: #fff;
                        color:#f24a40
                    }
                }
            }
        }
        .banner {
            position: absolute;
            top:0;
            width: 100%;
            height: 100%;
            min-height: 6.67rem;
            background: #fff url('./images/banner.jpg') no-repeat top;
            background-size: 100% auto;
        }
    }
</style>