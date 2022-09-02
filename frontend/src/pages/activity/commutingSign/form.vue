<template>
    <div class="Main main-background">
        <div class="content">
            <div class="title">
                通勤城市：佛山
                <i class="each"></i>
                广州
            </div>
            <div class="box">
                <div class="form">

                    <!--手机号-->
                    <div class="item">
                        <div class="key">联系手机号</div>
                        <div class="value">
                            <div class="placeholder" v-if="mobile===''">请输入手机号</div>
                            <input type="text" maxlength="11" v-model="mobile" class="input origin"/>
                        </div>
                    </div>

                    <!--跨城原因-->
                    <div class="item">
                        <div class="key">跨城原因</div>
                        <div class="value  arrow">
                            <div class="placeholder" v-if="!reason">请选择跨城原因</div>
                            <select v-model="reason" class="origin">
                                <option value="-1" v-if="is_ios">请选择</option>
                                <option value="0">日常工作</option>
                                <option value="1" selected>商务出行</option>
                                <option value="2">旅游度假</option>
                                <option value="3">其它</option>
                            </select>
                        </div>
                    </div>

                    <!--出行方式-->
                    <div class="item">
                        <div class="key">出行方式</div>
                        <div class="value  arrow">
                            <div class="placeholder" v-if="!trip_mode">请选择出行方式</div>
                            <select v-model="trip_mode" class="origin">
                                <option value="-1" v-if="is_ios">请选择</option>
                                <option value="0">跨城地铁</option>
                                <option value="1">公交车</option>
                                <option value="2">铁道交通</option>
                                <option value="3">自驾</option>
                            </select>
                        </div>
                    </div>

                    <!--出行时间-->
                    <div class="item">
                        <div class="key">出行时间</div>
                        <div class="value arrow up">
                            <div class="placeholder" v-if="time_start === null">请选择出发时间</div>
                            <select v-model="time_start" class="origin">
                                <option value="-1" v-if="is_ios">请选择</option>
                                <option v-for="item in [0,1,2,3,4,5,6,7,8,9,10,11,12]" :key="item"
                                        :value="item">{{item}}:00
                                </option>
                            </select>
                        </div>
                        <div class="value arrow">
                            <div class="placeholder" v-if="!time_end">请选择返程时间</div>
                            <select v-model="time_end" class="origin">
                                <option value="-1" v-if="is_ios">请选择</option>
                                <option v-for="item in [12,13,14,15,16,17,18,19,20,21,22,23,24]" :key="item"
                                        :value="item">{{item}}:00
                                </option>
                            </select>
                        </div>
                    </div>

                    <!--每周频次-->
                    <div class="item">
                        <div class="key">每周频次</div>
                        <div class="value arrow">
                            <div class="placeholder" v-if="!trip_rate">请选择每周频次</div>
                            <select v-model="trip_rate" class="origin">
                                <option value="-1" v-if="is_ios">请选择</option>
                                <option value="0">1次</option>
                                <option value="1">2-3次</option>
                                <option value="2">3-5次</option>
                                <option value="3">5次以上</option>
                            </select>
                        </div>
                    </div>

                    <!--出没地区-->
                    <div class="item">
                        <div class="key">出没地区</div>
                        <div class="value arrow up" @click="()=>showMap('fo')">
                            <div class="placeholder" v-if="!address_fo">请选择出发地区</div>
                            <div class="address" v-else>{{address_fo}}</div>
                        </div>
                        <div class="value arrow" @click="()=>showMap('guang')">
                            <div class="placeholder" v-if="!address_guang">请选择目的地区</div>
                            <div class="address" v-else>{{address_guang}}</div>
                        </div>
                    </div>

                    <!--提交按钮-->
                    <div class="btn-con">
                        <button class="btn main-background" @click="check">提交</button>
                    </div>
                </div>
            </div>
        </div>
        <transition
                name="custom-classes-transition"
                enter-active-class="animated faster zoomIn"
                leave-active-class="animated faster zoomOut">
            <div class="map-con" v-show="show_map">

                <div ref="map" class="map"></div>
                <FlagPin ref="pin"/>

                <div class="map-header" v-if="address_type==='fo'"><span class="add">{{address_fo_h}}</span></div>
                <div class="map-header" v-else><span class="add">{{address_guang_h}}</span></div>
                <div class="btn-con">
                    <button class="btn btn-border" @click="()=>this.show_map=false">返回</button>
                    <button class="btn main-background" @click="closeMap">选择</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import {Alert, Toast, Loading, Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import formatTime from './js/formatTime'
  import FlagPin from './component/flagPin/index.vue'
  import mapControl from './js/mapControl'
  import env from '../../../../other_modules/like-env/index'
  import wxShareSelector from '../../../component/wxShareSelector'
  import wxShare from './js/thisWxShare'
  require('../../../../other_modules/css-animate/animate.less')

  wxShare()

  export default {
    name: "point",
    components: {
      FlagPin
    },
    data () {
      return {
        show_map: false,

        mobile: '',
        reason: null,
        trip_mode: null,
        time_start: null,
        time_end: null,
        trip_rate: null,
        address_fo: '',
        lat_fo: null,
        lng_fo: null,
        address_guang: '',
        lat_guang: null,
        lng_guang: null,

        address_type: null,
        is_ios: env.isIos
      }
    },
    computed: {
      address_fo_h () {
        return this.address_fo ? this.address_fo : '请拖动地图选择地区'
      },
      address_guang_h () {
        return this.address_guang ? this.address_guang : '请拖动地图选择地区'
      }
    },
    methods: {
      updateAddress (center, address) {
        if (this.address_type === 'fo') {
          this.lat_fo = center.lat
          this.lng_fo = center.lng
          this.address_fo = address
        } else {
          this.lat_guang = center.lat
          this.lng_guang = center.lng
          this.address_guang = address
        }
      },
      showMap (type) {
        this.address_type = type
        this.show_map = true
      },
      closeMap () {
        this.show_map = false
      },

      check () {
        if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
          Toast('请输入正确的手机号')
          return
        }

        if (!(Number(this.reason)>=0)) {
          Toast('请选择跨城原因')
          return
        }

        if (!(Number(this.trip_mode)>=0)) {
          Toast('请选择出行方式')
          return
        }

        if (!(Number(this.time_start)>=0) || !(Number(this.time_end)>=0)) {
          Toast('请选择出行时间')
          return
        }

        if (!(Number(this.trip_rate)>=0)) {
          Toast('请选择每周频次')
          return
        }

        if (!this.address_guang || !this.address_fo) {
          Toast('请选择出没地区')
          return
        }

        this.send()
      },

      send () {
        myAjax.post(getApiUrl('/activity/recruit-driver'), {
          mobile: this.mobile,
          reason: this.reason,
          trip_mode: this.trip_mode,
          trip_start_time: this.time_start,
          trip_end_time: this.time_end,
          trip_rate: this.trip_rate,
          start_area: this.address_fo,
          start_area_lng: this.lng_fo,
          start_area_lat: this.lat_fo,
          end_area: this.address_guang,
          end_area_lng: this.lng_guang,
          end_area_lat: this.lat_guang
        }).then(res => {
          if (res.status === 0) {
            Alert({
              title: '提示',
              msg: res.msg,
              confirmButtonText: '知道了',
              confirmButtonCallback: function () {
                window.history.back()
              }
            })
          } else {
            Toast(res.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    created () {

    },
    mounted () {
      mapControl.initMap(this.$refs.map)

      let that = this
      mapControl.dragend(function (center) {
        that.$refs.pin.jump()

        mapControl.getAddress(center).then(res => {
          that.updateAddress(center, res)
        }).catch(res => {
          console.log(res)
        })
        console.log(center)
      })

    }
  }
</script>

<style lang=less>
    .Main {
        min-height: 100vh;
        padding-bottom: 0.2rem;
        box-sizing: border-box;
        .content {
            padding: 0 0.2rem;
            .title {
                padding: 0.1rem 0;
                color: #fff;
                line-height: 0.2rem;
                .each {
                    display: inline-block;
                    width: 0.14rem;
                    height: 0.2rem;
                    background: url('./images/each.png') no-repeat center;
                    background-size: 100%;
                    vertical-align: top;
                }
            }
            .box {
                border-radius: 2px;
                background-color: #fff;
                padding: 0.2rem 0.15rem;
                .key{
                    line-height: 0.2rem;
                    font-size: 12px;
                    color: #111;
                    &::after{
                        content: ' *';
                        color: #ec753f;
                    }
                }
                .value{
                    position: relative;
                    height: 0.36rem;
                    border: 1px solid #DFDFDF;
                    border-radius: 2px;
                    margin-bottom: 0.1rem;
                    overflow: hidden;
                    &.arrow::after{
                        content: '';
                        display: block;
                        width: 0.12rem;
                        height: 0.12rem;
                        position: absolute;
                        top:50%;
                        margin-top: -0.06rem;
                        right:0.1rem;
                        background: url('./images/arrow.png') no-repeat center;
                        background-size: 100%;
                    }
                    &.arrow.up::after{
                        transform: rotate(180deg);
                    }


                }
                .address{
                    line-height: 0.36rem;
                    padding: 0 0.22rem 0 0.1rem;
                }
                .placeholder{
                    position: absolute;
                    top:50%;
                    line-height: 0.2rem;
                    margin-top:-0.1rem;
                    left:0.1rem;
                    color:#ccc;
                }
                .origin{
                    appearance:none;
                    -moz-appearance:none;
                    -webkit-appearance:none;
                    position: absolute;
                    top:0;
                    background-color: transparent;
                    font-size: 14px;
                    width: 100%;
                    height: 100%;
                    border:none;
                    padding:0 0.1rem;
                    box-sizing: border-box;
                }
                .btn-con{
                    margin:0.3rem 0 0.15rem;
                    .btn{
                        display: block;
                        box-sizing: border-box;
                        border:none;
                        border-radius: 5px;
                        height: 0.44rem;
                        width: 100%;
                        color:#fff;
                        font-size: 16px;
                        outline: none;
                        box-shadow: 1px 1px 1px 1px #f0f0f0 ;
                        transition: box-shadow 100ms;
                        &:active{
                            box-shadow: none;
                        }
                    }
                }
            }
        }

        .map-con {
            position: fixed;
            width: 100%;
            height: 100vh;
            top: 0;
            left: 0;
            background-color: #f2f2f2;
            box-sizing: border-box;
            .map {
                overflow: hidden;
                border-radius: 5px;
                height: 100%;
            }
            .map-header {
                position: absolute;
                top: 20px;
                left: 20px;
                right: 20px;
                line-height: 18px;
                padding: 9px 5px;
                border-radius: 5px;
                text-align: center;
                font-size: 13px;
                color: #333;
                background-color: #fff;
                box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.2);
                .add {
                    display: inline-block;
                    text-align: left;
                }
            }
            .btn-con {
                box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.2);
                position: absolute;
                width: 100%;
                padding:10px;
                box-sizing: border-box;
                bottom: 0;
                left: 0;
                z-index: 180;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                .btn{
                    box-sizing: border-box;
                    border:none;
                    border-radius: 5px;
                    height: 0.44rem;
                    width: 1.7rem;
                    color:#fff;
                    font-size: 16px;
                    outline: none;
                    box-shadow: 1px 1px 1px 1px #f0f0f0 ;
                    transition: box-shadow 100ms;
                    &.btn-border{
                        border:solid 1px #ec753f;
                        background-color: #fff;
                        color:#ec753f
                    }
                    &:active{
                        box-shadow: none;
                    }
                }
            }
        }
    }
</style>