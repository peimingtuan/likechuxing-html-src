<template>
    <div class="container">
        <div class="header"></div>
        <div v-show="!show">
            <div class="form-group">
                <input class="phone-input" max="11" v-model="phone" type="number" placeholder="请输入手机号">
                <div class="code-wrap">
                    <div class="input-wrap">
                        <input max="4" type="number" v-model="code" placeholder="验证码">
                    </div>
                    <div class="get-code-btn" :class="showCount?'on':''">
                        <div class="des" @click="getCode">获取验证码</div>
                        <div v-show="showCount"> ({{s}}s)</div>
                    </div>
                </div>
                <div class="btn" @click="getCoupon">点击提交</div>
            </div>
            <div class="tip">此活动仅限立刻出行新用户参与</div>
            <div class="list"></div>
            <div class="desc">
                <span class="h">
                    【立刻出行】
                </span>
                是一款新一代的共享用车平台，用车全程app操作，即取即还。您可以在广州，成都，武汉，南京，长沙，佛山6个城市的数千个网点发现我们，万台车辆随时待命。
            </div>
            <div class="footer"></div>
        </div>
        <Dialog :show="show" :downloadUrl="url"/>
        <OldDialog :show="showErr"/>
    </div>
</template>
<script>
  import Dialog from './components/dialog'
  import OldDialog from './components/oldDialog'
  import http from '../../../../other_modules/like-request/withAxiosV2'
  import {getActivityApiUrl as api} from '../../../../other_modules/url-constructor'
  import {Toast} from '../../../../other_modules/vue-plugins/like-base'
  import like from './js/like'
  import wxShare from './js/wxShare'

  wxShare()
  export default {
    components: {
      Dialog,
      OldDialog
    },
    data () {
      return {
        show: false,
        query: {},
        phone: '',
        code: '',
        showCount: false,
        s: 60,
        url: '',
        showErr: false,

        channel: ''
      }
    },
    created () {
      this.url = like.getDownLoadUrl()
      this.query = this.getQuery(window.location.href).query
      this.channel = this._getChannel(Number(this.query.channel.split('_')[1]))
      let flag = localStorage.getItem('new_user')
      if (flag == 0) {
        this.showErr = true
        this.show = false
      } else if (flag == 1) {
        this.showErr = false
        this.show = true
      }
    },
    methods: {
      _getChannel(channel){
        console.log(channel)
        if(!channel)return ''

        let channelMap = [
          [8994,9094],
          [8995,9095],
          [8996,9096],
          [8997,9097],
          [8998,9098],
          [8999,9099],
          [9000,9100],
          [9001,9101],
          [9002,9102],
          [9003,9103],
          [9006,9104],
          [9007,9105]
        ]

        let index = channelMap.map(item=>item[0]).indexOf(channel)
        if(index > -1){
          return channelMap[index][1]
        }else{
          return channel
        }
      },
      getCode () {

        let {phone, showCount} = this;
        let phoneReg = /^1[3456789]\d{9}$/
        if (showCount) {
          return
        }
        if (phone == '') {
          Toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(phone)) {
          Toast('请输入正确的手机号')
          return
        }
        this.countDown()
        http.post(api('activity-parking/get-code'), {phone}).then(res => {
          if (res.status == 0) {
            Toast('发送成功')
          } else {
            Toast(res.msg)
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
        let {phone, query, code} = this;
        let phoneReg = /^1[3456789]\d{9}$/
        if (phone == '') {
          Toast('手机号不能为空')
          return
        }
        if (!phoneReg.test(phone)) {
          Toast('请输入正确的手机号')
          return
        }
        if (code == '') {
          Toast('验证码不能为空')
          return
        }
        if (!/\d{4}/.test(phone)) {
          Toast('请输入正确的验证码')
          return
        }
        if (this.channel === '') {
          console.log('未知渠道',this.channel)
          return
        }
        let data = {
          phone,
          code,
          activity_id: 1044,
          channel: this.channel
        }
        let _this = this;
        http.post(api('activity-parking/verify-code'), data).then(res => {
          if (res.status == 0) {
            localStorage.setItem('new_user', res.data.new_user)
            if (res.data.new_user == 0) {
              _this.showErr = true
              _this.show = false
            } else {
              _this.show = true
              _this.showErr = false
            }
          } else {
            Toast(res.msg)

          }
        }).catch(err => {
          console.log(err)
        })
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
      beforeDestory () {
        this.timer && clearInterval(this.timer)
      }
    }
  }
</script>
<style lang="less">
    body {
        background: #fff;
    }

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .container {
        .header {
            width: 100%;
            height: 4.005rem;
            background: url('./images/header.png') no-repeat;
            background-size: 100% 100%;
        }
        .list {
            width: 100%;
            height: 3.66rem;
            background: url('./images/list.png') no-repeat;
            background-size: 100% 100%;
            margin-bottom: 0.2rem;
        }
        .desc {
            .span {
                font-size: .13rem;
                color: #535353;
                font-weight: 700;
            }
            font-size: .14rem;
            color: #535353;
            line-height: .24rem;
            padding: 0 .6rem;
        }
        .footer {
            margin: .37rem auto .34rem;
            width: .22rem;
            height: .06rem;
            background: #d82630;
        }
        .form-group {
            padding: .25rem .38rem .23rem;
            .phone-input {
                width: 100%;
                height: .45rem;
                font-size: .18rem;
                border-radius: .22rem;
                padding: 0 .23rem;
                border: 1px solid #d82630;
                margin-bottom: .21rem;
                text-indent: 0;
                background: transparent;
                resize: none;
                outline: none;
                -webkit-appearance: none;
                line-height: normal;
                display: block;
                color: #636363;
                line-height: .45rem;
            }
            .btn {
                height: .45rem;
                font-size: .20rem;
                background: #d82630;
                border-radius: .22rem;
                text-align: center;
                line-height: .45rem;
                color: #fff;
            }
            .code-wrap {
                width: 100%;
                height: .45rem;
                border-radius: .22rem;
                padding-left: .23rem;
                border: 1px solid #d82630;
                margin-bottom: .21rem;
                text-indent: 0;
                background: transparent;
                display: flex;
                align-items: center;
                .input-wrap {
                    flex: 1;
                }
                input {
                    height: .45rem;
                    font-size: .18rem;
                    text-indent: 0;
                    border: none;
                    background: transparent;
                    resize: none;
                    outline: none;
                    -webkit-appearance: none;
                    line-height: normal;
                    display: block;
                    color: #636363;
                    width: 100%;
                    line-height: .45rem;
                }
                .get-code-btn {
                    font-size: .14rem;
                    width: 1.5rem;
                    height: 0.25rem;
                    border-left: 0.02rem solid #b93637;
                    display: flex;
                    justify-content: center;
                    font-size: 0.18rem;
                    color: #d82630;
                    &.on {
                        color: #ccc;
                    }
                }
            }
        }
        .tip {
            color: #1B2A31;
            font-size: .12rem;
            text-align: center;
            font-weight: 700;
        }
    }
</style>

