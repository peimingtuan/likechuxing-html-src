<template>
    <div class="SharePage">
        <div class="mask" v-if="limit_mask">请在微信中打开</div>
        <div class="mask" v-if="!limit_mask && step===0">加载中...</div>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown"
                leave-active-class="animated faster slideOutUp">
            <div class="box" v-if="step>0">

                <div class="step1" v-if="step===1">
                    <div v-if="soldOut && show_huafei" class="desc mb">
                        今天的小额话费被抢光啦，<br/>
                        赶快行动，完成下一步可得<span class="strong">50元</span>话费哦！
                    </div>
                    <div class="opt-box">
                        <div class="pos">
                            <input placeholder="输入手机号领取新人专属礼包" class="input" maxlength="11" v-model="phone"/>
                        </div>
                        <div class="pos" v-if="show_code">
                            <input
                                    placeholder="输入验证码"
                                    class="input half"
                                    maxlength="4"
                                    v-model="code"
                            />
                            <div class='get' @click="getCode">{{code_text}}</div>
                        </div>
                        <div class="pos" style="border:none">
                            <button class="btn main_color_btn" @click="submit">点击领取</button>
                        </div>

                    </div>
                </div>

                <div class="step2" v-if="step===2">
                    <div class="act">
                        <div>
                            领取成功<br/>
                            下载「立刻出行」APP<br/>
                            领取其它活动奖励
                        </div>
                        <button class="btn btn-primary" @click="toDownload">点击下载</button>
                    </div>
                </div>

                <div class="step3" v-if="step===3">
                    <div class="act">
                        <div>
                            大礼包仅限新用户哟<br/>
                            打开「立刻出行」APP<br/>
                            查看其它精彩活动
                        </div>
                        <button class="btn btn-primary" @click="toDownload">点击下载</button>
                    </div>
                </div>

                <div class="rules">
                    <div class="rule">活动时间：8.8 - 8.26</div>
                    <div class="rule">此活动仅限新用户参与</div>
                </div>

                <!--<div class="footer"></div>-->

            </div>
        </transition>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown delay"
                leave-active-class="animated faster slideOutUp">
            <div class="banner" v-if=" step>0"></div>
        </transition>

    </div>
</template>

<script>
  import myAjax from '../../../component/myAjax/withAxiosV2'
  import {getActivityApiUrl} from "../../../../other_modules/url-constructor";
  import Regular from '../../../js/Regular'
  import ENV from '../../../../other_modules/like-env'
  import wxShare from './js/thisWxShare'

  import parseURL from '../../../js/parseURL'

  let query = parseURL(window.location.href).query

  export default {
    name: "share",
    data() {
      return {
        show_huafei: false,
        env: ENV,
        code_text: '获取验证码',
        soldOut: true,
        phone: '',
        code: '',
        lat: '',
        lng: '',
        uuid: '',
        sign: '',
        newUser: 0,
        count: 61,
        city_id: 0,
        city_array: {},
        step: 0,
        time_start: 0,
        limit_mask: false,
        rules: [],
        content: [],
        allow_city: false,
        show_code: false,
      }
    },
    methods: {
      countDown() {
        let that = this
        if (that.count < 1) {
          that.code_text = '获取验证码'
          that.count = 60
        } else {
          setTimeout(function () {
            that.code_text = that.count - 1 + 's'
            that.count = that.count - 1
            that.countDown()
          }, 1000)
        }
      },
      getCode() {
        if (this.code_text !== '获取验证码') {
          return
        }

        if (!/^1[3456789]\d{9}$/.test(this.phone)) {
          this.$_LIKE_toast("请输入正确手机号")
          return
        }

        this.show_code = true
        let that = this
        myAjax.post(getActivityApiUrl('/activity/get-code'), {
          phone: this.phone,
          ver_type: 2,
          ver_code: query.open_id
        }).then(res => {
          if (res.status === 0) {
            that.code_text = '发送成功'
            that.count = 60
            that.countDown()
          } else {
            that.$_LIKE_toast(res.msg)
          }
        })
      },
      submit() {
        if (!this.show_code) {
          this.getCode()
          return
        }
        let that = this

        if (this.count === 61) {
          this.$_LIKE_toast('请先获取验证码')
          return
        }

        if (!Regular.phone.test(this.phone)) {
          this.$_LIKE_toast('请输入正确手机号')
          return
        }

        if (!/^\d{4}$/.test(this.code)) {
          this.$_LIKE_toast('验证码格式不正确')
          return
        }

        if (this.show_huafei && this.soldOut) {
          this.$_LIKE_confirm({
            msg: ['明天注册才能领话费哦，点击“继续”可完成注册并查看其他奖励'],
            confirmButtonText: '继续',
            confirmButtonCallback: function () {
              that.checkCity()
            }
          })
          return
        }

        this.checkCity()
      },
      checkCity() {
        this.allow_city = true
        this.checkTimeStart()
        return

        let that = this
        if (!this.city_array.hasOwnProperty(Number(this.city_id))) {
          this.$_LIKE_confirm({
            msg: ['您所处城市未在活动范围内哦，无法获得免费券奖励，要继续吗？'],
            confirmButtonText: '继续',
            confirmButtonCallback: function () {
              that.checkTimeStart()
            }
          })
        } else {
          this.allow_city = true
          this.checkTimeStart()
        }
      },
      checkTimeStart() {
        if (this.time_start) {
          this.attend()
        } else {
          this.$_LIKE_alert({
            msg: ['当前活动尚未开始'],
            confirmButtonText: '知道了'
          })
        }
      },
      attend() {
        let that = this
        let loading = this.$_LIKE_loading()
        myAjax.post(getActivityApiUrl('/activity/attend'), {
          activity_id: 2,
          channel: query.channel || '0_8869',
          phone_no: this.phone,
          code: this.code,
          city_id: this.city_id,
          user_lat: this.lat,
          user_lng: this.lng,
          ver_type: 2,
          ver_code: query.open_id
        }).then(res => {
          loading.destroy()
          if (res.status === 0) {
            that.uuid = res.data.uuid
            that.sign = res.data.sign
            that.newUser = res.data.new_user

            if (res.data.new_user) {
              that.step = 2
              if (!res.data.new_attend) {
                that.$_LIKE_toast('已经参加活动，无需重复参加')
              }
            } else {
              that.step = 3

              //that.$_LIKE_toast('已注册用户无法参与该活动，请打开APP了解更多活动信息。')
            }

          } else {
            that.$_LIKE_toast(res.msg)
          }
        })
      },
      toDownload() {
        if (ENV.isIos) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      },
      getActivityRules() {
        let that = this
        myAjax.post(getActivityApiUrl('/activity/attend-info'), {
          activity_id: 2,
          city_id: this.city_id
        }).then(res => {
          if (res.status === 0) {
            that.time_start = res.data.time_start
            //that.rules = res.data.detail
            that.soldOut = Boolean(res.data.alert_des)
            that.city_array = res.data.city_array
            that.step = 1
            //that.content = res.data.coutent[0]
          } else {
            that.$_LIKE_toast(res.msg)
          }
        })
      },
      getCityId(cb) {
        let that = this
        let map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function () {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: false,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          });
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', function (data) {
            that.lat = data.position.getLat()
            that.lng = data.position.getLng()
            myAjax.post(getActivityApiUrl('/describe/get-cityid'), {
              user_lat: that.lat,
              user_lng: that.lng
            }).then(res => {
              if (res.status === 0) {
                that.city_id = res.data.city_id

                // 如果是非规范的渠道，通过定位城市规范一下
                if (!/\d{2,3}_\d{4,5}/.test(query.channel)) {
                  query.channel = that.city_id + '_8869'
                }
                typeof cb === 'function' && cb()
              } else {
                that.$_LIKE_toast(res.msg)
              }
            })
          });//返回定位信息
          AMap.event.addListener(geolocation, 'error', function () {
            that.$_LIKE_toast('开启定位才能参与活动呀~')
          });      //返回定位出错信息
        });
      },
      toDownload() {
        if (ENV.isIos) {
          window.open('https://itunes.apple.com/cn/app/id1245529926?mt=8')
        } else {
          window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.like.car')
        }
      }
    },
    created() {
      if (this.step > 0) {
        return
      }

      let that = this
      if (!ENV.isWeiXin) {
        // 不在微信弹窗去微信
        this.limit_mask = true
      } else if (!query.open_id) {
        // 否则是h5，用post方式拿openid
        myAjax.postPage(getActivityApiUrl('/wx-js/open-id'), {
          cb_url: window.location.href.replace('share.html', 'index.php')
        })
      } else {
        wxShare()
        this.getCityId(function () {
          that.getActivityRules()
        })

        setTimeout(function () {
          if (that.rules.length === 0) {
            that.getActivityRules()
          }
        }, 2500)
      }

    }
  }
</script>

<style lang="less">
    .alert_btn_container .btn {
        border-radius: 0.2rem !important;
    }

    .alert_btn_container .btn-primary {
        background-color: #f81131 !important;
        border-color: #f81131 !important;
    }

    .warn {
        color: #f81131;
    }

    .SharePage {
        position: relative;
        overflow: hidden;
        .box {
            width: 100%;
            padding-top: 3.5rem;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 0 0 0.2rem 0.2rem;
            .desc {
                font-size: 0.16rem;
                text-align: center;
                .strong {
                    font-size: 0.26rem;
                    color: #f81131
                }
                &.big {
                    font-size: 0.16rem;
                    margin: 0.1rem 0;

                }
                &.mini {
                    font-size: 0.13rem;
                    margin-top: 0.2rem;
                }
                &.mb {
                    margin-bottom: 0.2rem;
                }
            }
            .opt-box {
                text-align: center;

            }
            .pos {
                border: solid 1px #898989;
                border-radius: 22px;
                width: 2.8rem;
                height:44px;
                position: relative;
                margin: 0.15rem auto;
                text-align: left;
            }

            .input, .btn {
                border: none;
                border-radius: 22px;
                width: 2.8rem;
                height: 44px;
                outline: none;
                padding: 0 0.22rem;
                box-sizing: border-box;
                font-size: 0.15rem;
                text-align: center;
                &.half {
                    width: 50%;
                }
            }
            .input{
                //line-height: 0.44rem;
                width: 100%;
                background: #fff;
                height: 44px;
                padding: 8px 15px;
                line-height: 28px;
                font-size: 15px;
                outline: 0;
                border-radius: 22px;
            }
            .btn {
                font-size: 0.16rem;
                border-color: #f81131;
                background-color: #ee1b2c;
                &:active {
                    transition: transform 100ms;
                    transform: scale(0.99);
                }
            }
            .get {
                background-color: transparent;
                color: #666;
                position: absolute;
                width: 50%;
                line-height: 24px;
                height: 24px;
                box-sizing: border-box;
                text-align: center;
                top: 10px;
                font-size: 15px;
                right: 0;
                border-left: solid 1px #111;
                z-index: 10;
            }
            .rules {
                //margin:0.3rem 0.8rem;
                margin: 0.5rem 0.8rem;
                font-size: 12px;
                text-align: left;
                line-height: 0.18rem;
                color: #220505;
                //padding-bottom: 0.1rem;
                .rule {
                    margin: 0.07rem 0;
                    text-align: center;
                }
                .index {
                    border-radius: 50%;
                    text-align: center;
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    line-height: 0.15rem;
                    margin-top: 0.02rem;
                    margin-left: -0.18rem;
                    margin-right: 0.03rem;

                }
                .title {
                    text-align: center;
                    font-size: 15px;
                    color: #333;
                    height: auto;
                    margin: 0.2rem auto 0.1rem
                }
            }


        }
        .banner {
            position: absolute;
            top: 0;
            width: 100%;
            height: 3.28rem;
            background: url('./images/banner4.jpg') no-repeat center;
            background-size: 100%;
        }
        .delay {
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
        .act {
            color:#220505;
            font-size:18px;
            text-align: center;
            padding: 0 0.25rem;
            .btn {
                margin-top: 0.4rem;
                height: 0.46rem;
                font-size: 0.16rem;
                width: 100%;
                border-color: transparent;
                background-color: #f81131;
                border-radius: 0.23rem;
            }
        }
    }
</style>
