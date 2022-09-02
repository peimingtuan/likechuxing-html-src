<template>
    <div class="SharePage">
        <div class="mask" v-if="limit_mask">请在微信中打开</div>
        <div class="mask" v-else-if="!open_id">登录中...</div>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown"
                leave-active-class="animated faster slideOutUp">
        <div class="box" v-if="step>0">

            <div class="step1" v-if="step===1">
                <div v-if="soldOut" class="desc mb">
                    今天的话费已经抢光啦<br/>
                    明天在这里不见不散哦
                </div>
                <div class="opt-box" >
                    <div>
                        <input placeholder="输入手机号最高领10元话费" class="input" maxlength="11" v-model="phone"/>

                    </div>
                    <div class="pos">
                        <input
                                placeholder="输入验证码"
                                class="input t-l"
                                maxlength="4"
                                v-model="code"
                        />
                        <div class='get' @click="getCode">{{code_text}}</div>
                    </div>
                    <button class="btn main_color_btn" @click="submit">点击领取</button>
                </div>
            </div>

            <div class="step2" v-if="step===2">
                <div class="desc big" v-if="!soldOut">
                    <div>您的话费已发放</div>
                    上传驾照并通过审核可再领<span class="strong">50元</span>
                </div>
                <div class="desc big" v-else>
                    <div v-if="new_user">上传驾照并通过审核可领<span class="strong">50元</span></div>
                </div>
                <div class="opt-box step1">
                    <button class="btn main_color_btn" @click="toDownload">点击领取</button>
                </div>
                <div class="desc mini">
                    下载APP可获取<span class="warn">300元</span>新手礼包
                </div>
            </div>

            <div class="rules" v-if="rules.length>0">
                <div class="title">活动规则</div>
                <div v-for="(item,index) in rules" :key="index" class="rule">
                    <span class="index">{{index+1}}</span>{{item}}</div>
            </div>
        </div>
        </transition>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster slideInDown delay"
                leave-active-class="animated faster slideOutUp">
            <div class="banner" v-if="step>0"></div>
        <!--<div class="header" v-if="step>0">
            <div class="title"></div>
        </div>-->
        </transition>
    </div>
</template>

<script>
  import myAjax from '../../../component/myAjax/'
  import getApiUrl from '../../../js/getApiUrl'
  import Regular from '../../../js/Regular'
  import ENV from '../../../../other_modules/like-env'
  import wxShare from './js/thisWxShare'

  import parseURL from '../../../js/parseURL'

  let query = parseURL(window.location.href).query

  export default {
    name: "share",
    data() {
      return {
        env:ENV,
        code_text:'获取验证码',
        soldOut: false,
        act_time: [1526486400, 1527782400],// 5.17_0:0-5.31_24:0
        phone: '',
        code:'',
        lat:'',
        lng:'',
        count:61,
        open_id: '',
        city_id:0,
        city_array:{},
        step: 0
        ,
        limit_mask: false,
        time_start:0,
        rules:[
          '活动时间：5.25 - 6.30;',
          '活动仅限广州市、佛山市、中山市、珠海市、东莞市、深圳市、成都市、长沙市、武汉市、南京市的用户参加;',
          '每日话费奖励名额有限，送完即止;',
          '话费将在72小时内发送至您的账户中。'
        ]
      }
    },
    computed: {
      during_flag() {
        if (myAjax.server_time < this.act_time[0]) {
          return -1
        } else if (myAjax.server_time > this.act_time[1]) {
          return 1
        } else {
          return 0
        }
      }
    },
    methods: {
      countDown(){
        let that = this
        if(that.count < 1){
          that.code_text = '获取验证码'
          that.count = 60
        }else{
          setTimeout(function () {
            that.code_text = that.count - 1 + 's'
            that.count = that.count - 1
            that.countDown()
          }, 1000)
        }
      },
      getCode:function(){
        if(this.code_text!=='获取验证码'){
          return
        }

        if (!/^1[3456789]\d{9}$/.test(this.phone)) {
          this.$_LIKE_toast("请输入正确手机号")
          return
        }

        let that = this
        myAjax.post(getApiUrl('/login/get-code'), {
          phone:this.phone
        }, function (res) {
          if(res.status === 0){
            that.code_text = '发送成功'
            that.count = 60
            that.countDown()
          }else{
            that.$_LIKE_toast(res.msg)
          }
        })
      },
      submit() {
        let that = this

        if(this.count === 61){
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

        if (this.soldOut){
          this.$_LIKE_confirm({
            msg: ['明天注册才能取得话费哦，确定要现在注册吗？'],
            confirmButtonText: '确定',
            confirmButtonCallback: function () {
              that.checkTimeStart()
            }
          })
          return
        }

        if (!this.city_array.hasOwnProperty(Number(this.city_id))) {
          this.$_LIKE_confirm({
            msg: ['您所处城市未在活动范围内哦，无法获得话费奖励，要继续吗？'],
            confirmButtonText: '继续',
            confirmButtonCallback: function () {
              that.checkTimeStart()
            }
          })
          return
        }

        this.checkTimeStart()
      },
      checkTimeStart(){
        if(this.time_start){
          this.attend()
        }else{
          this.$_LIKE_alert({
            msg: ['当前活动尚未开始'],
            confirmButtonText: '知道了'
          })
        }
      },
      attend(){
        let that = this
        myAjax.post(getApiUrl('/activity/attend'),{
          activity_id:1,
          channel:query.channel || 'summer_imqixiosw',
          open_id:this.open_id,
          openid_type:1,
          phone_no:this.phone,
          code:this.code,
          city_id:this.city_id,
          user_lat:this.lat,
          user_lng:this.lng
        },function(res){
          if (res.status === 0) {
            if(res.data.new_user){
              that.step = 2
              if(!res.data.new_attend){
                that.$_LIKE_toast('已经参加活动，无需重复参加')
              }
            }else{
              that.$_LIKE_toast('已注册用户无法参与该活动，请打开APP了解更多活动信息。')
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
      sendOpenId(){
        let that = this
        this.getActivityRules()

        myAjax.post(getApiUrl('/activity/has-attend'),{
          open_id:this.open_id,
          openid_type:1,
          activity_id:1
        },function(res){
            if(res.status === 0){
              if(res.data.attend_status === 1){
                that.step = 2
                that.$_LIKE_toast('已经参加活动，无需重复参加')
              }else{
                that.step = 1
              }
            }
        })
      },
      getActivityRules() {
        let that = this
        myAjax.post(getApiUrl('/activity/attend-info'), {
          activity_id: 1
        }, function (res) {
          if (res.status === 0) {
            that.time_start = res.data.time_start
            that.soldOut = Boolean(res.data.alert_des)
            that.city_array = res.data.city_array
          } else {
            that.$_LIKE_toast(res.msg)
          }
        })
      },
      getCityId(cb){
        let that = this
        let map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: false,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          });
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete',function(data){
            that.lat = data.position.getLat()
            that.lng = data.position.getLng()
            myAjax.post(getApiUrl('/describe/get-cityid'),{
              user_lat: that.lat,
              user_lng: that.lng
            },function(res){
              if(res.status === 0){
                that.city_id = res.data.city_id
                typeof cb === 'function' && cb()
              }else{
                that.$_LIKE_toast(res.msg)
              }
            })
          });//返回定位信息
          AMap.event.addListener(geolocation, 'error', function(){
            that.$_LIKE_toast('开启定位才能参与活动呀~')
          });      //返回定位出错信息
        });
      }
    },
    created() {
      this.getCityId()
      let that = this

      if(this.step>0){
        return
      }

      if (!ENV.isWeiXin) {
        // 不在微信弹窗去微信
        this.limit_mask = true
      } else if (!query.open_id) {
        // 否则是h5，用post方式拿openid
        myAjax.postPage(getApiUrl('/wx-js/open-id'), {
          cb_url: window.location.href.replace('share.html', 'index.php')
        })
      } else {
        // 否则拿过open_id的话直接开始
        wxShare()
        this.open_id = query.open_id
        that.sendOpenId()
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
        border-color:#f81131 !important;
    }
    .warn{
        color:#f81131;
    }
    .SharePage {
        position: relative;
        overflow: hidden;
        .box {
            width: 100%;
            padding-top: 3rem;
            box-sizing: border-box;
            background-color: #fff;
            border-radius: 0 0 0.2rem 0.2rem;
            margin-bottom: 0.8rem;
            .desc{
                font-size: 0.16rem;
                text-align: center;
                &.big{
                    font-size: 0.16rem;
                    margin:0.1rem 0;
                    .strong{
                        font-size: 0.26rem;
                        color:#f81131
                    }
                }
                &.mini{
                    font-size: 0.12rem;
                    margin-top: 0.2rem;
                }
                &.mb{
                    margin-bottom: 0.2rem;
                }
            }
            .opt-box {
                text-align: center;

            }
            .input, .btn {
                width: 2.8rem;
                height: 0.44rem;
                outline: none;
                padding: 0 0.22rem;
                border-radius: 0.22rem;
                box-sizing: border-box;
                border: solid 1px #111;
                margin: 0.04rem 0;
                font-size: 0.15rem;
            }
            .btn {
                text-align: center;
                font-size: 0.2rem;
                border-color: #f81131;
                background: #f81131 linear-gradient(to right, #f81131, #f91557);
                &:active {
                    transition: transform 100ms;
                    transform: scale(0.99);
                }
            }
            .pos{
                position: relative;
            }
            .get{
                background-color: #e8e9eb;
                color:#666;
                position: absolute;
                width: 8em;
                font-size: 13px;
                line-height: 0.42rem;
                height: 0.44rem;
                box-sizing: border-box;
                text-align: center;
                top:0.04rem;
                right:0.46rem;
                border:solid 1px #111;
                border-radius: 0 0.22rem 0.22rem 0;
                z-index: 10;
            }
            .rules{
                margin:0.3rem 0.6rem;
                font-size: 12px;
                text-align: left;
                line-height: 0.18rem;
                color:#999;
                padding-bottom: 0.3rem;
                .rule{
                    margin:0.08rem 0;
                }
                .index{
                    border-radius: 50%;
                    text-align: center;
                    display: inline-block;
                    width: 0.15rem;
                    height: 0.15rem;
                    background-color:#f81131;
                    line-height: 0.15rem;
                    margin-top:0.02rem;
                    margin-left: -0.18rem;
                    margin-right: 0.03rem;
                    color:#fff;
                }
                .title{
                    text-align: center;
                    font-size: 15px;
                    color:#333;
                    height: auto;
                    margin:0.2rem auto 0.1rem
                }
            }

        }
        .banner{
            position: absolute;
            top: 0;
            width:100%;
            height: 2.895rem;
            background: url('./images/banner_01.png') no-repeat center;
            background-size: 100%;
        }
        .header {
            position: absolute;
            top: 0;
            width: 4.35rem;
            height: 2.8rem;
            background: #f81131 linear-gradient(to right, #f81131, #f91557);
            border-radius: 0 0 50% 50%;
            left: -0.3rem;
            box-shadow: 0 10px 20px 0 rgba(248, 17, 49, 0.3);
            .title {
                margin: 0.6rem auto 0.3rem;
                width: 2.6rem;
                height: 1.3rem;
                background: url(./images/title.png) no-repeat center;
                background-size: 100% auto;
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
    }
</style>
