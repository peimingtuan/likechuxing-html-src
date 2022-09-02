<template>
    <div class="MemberMall">
        <div class="MyScore">
            <div class="scoreBox">
                <div class="title">
                    我的里程积分
                    <span class="ques" @click="toExplain"></span>
                </div>
                <div class="score" v-if="point!=='-'">
                    <ICountUp
                            :startVal="0"
                            :endVal="point"
                            :decimals="0"
                            :duration="1"
                            :options="countUp_options"
                    />
                </div>
                <div class="btn_container">
                    <div class="button scoreDetail fs12" @click="toDetail">收支明细</div>
                    <div class="button exchangeHistory fs12" @click="toHistory">兑换历史</div>
                </div>
            </div>
            <div class="how fs12" @click="toHow">如何提高里程积分？</div>
        </div>

        <ul class="GoodsList">
            <GoodsBox v-for="item,index in goods" :key="item.id" :data="item"
                      :style="'animation-delay:'+index*60+'ms;'"/>
        </ul>

        <FooterLicense ref="footer"/>
    </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'
  import {Alert, Toast, Loading} from '../../../../other_modules/vue-plugins/like-base/'
  import {appMutual} from '../../../../other_modules/app-mutual/'
  import MemberMallData from './js/MemberMallData'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";

  import ICountUp from 'vue-countup-v2';
  import GoodsBox from './component/goodsBox.vue'
  import FooterLicense from './component/footerLicense.vue'

  export default {
    name: "index",
    data() {
      return {
        point: '-',
        goods: [],
        countUp_options:{
          useEasing: true,
          useGrouping: false,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ''
        }
      }
    },
    components: {
      GoodsBox,
      FooterLicense,
      ICountUp
    },
    methods: {
      toExplain() {
        window.location.href = "scoreExplain.html?footerColor=f2f2f2"
      },
      toDetail() {
        window.location.href = 'scoreDetail.html?footerColor=f2f2f2'
      },
      toHistory() {
        window.location.href = 'exchangeHistory.html?footerColor=f2f2f2'
      },
      toHow() {
        window.location.href = '/static/likeScore/increase.html?footerColor=f2f2f2'
      },
      loadGoods(data) {
        this.point = data.point

        let gla = []
        let list = data.goods.filter(item => {
          if (item.cate_id === 1) {
            gla.push(item)
            return false
          } else {
            return true
          }
        }).sort((a, b) => {
          return b.sort - a.sort
        })

        if (list.length % 2 === 1) {
          // 插入"敬请期待"
          list.push({
            id: -1,
            cate_id: -1,
            name: '敬请期待...',
            point: '',
            icon_image: require('./images/goods_more.png'),
            store_num: 1
          })
        }

        this.goods = gla.concat(list)

        this.$nextTick(() => {
          this.$refs.footer.moveFooter()
        })
      }
    },
    created() {
      if (!appArguments.login) {
        Alert({
          title: '提示',
          msg: '请先登录App',
          confirmButtonCallback: function () {
            appMutual.jump.indexAndCloseThisWebview()
          }
        })
      } else {
        // 登录信息存sessionStorage
        let memberMallData = new MemberMallData({
          uuid: appArguments.uuid,
          sign: appArguments.sign
        })

        myAjax.post(getApiUrl('/point/point-goods'), {
          uuid: appArguments.uuid,
          sign: appArguments.sign,
          city_id: appArguments.city_id || 0
        }).then(res => {
          if (res.status === 0) {
            this.loadGoods(res.data)
          } else {
            Toast(res.msg)
          }
        })
      }
    }
  }
</script>

<style lang=less>
    @import "../../../css/buttons/button";

    body {
        background-color: #f2f2f2;
    }

    .fs12{
        font-size: 12px;
    }

    .MemberMall {
        .MyScore {
            background-color: #fff;
            .scoreBox {
                position: relative;
                padding: 0.15rem 0;
                margin-left: 0.2rem;
                color: #111;
                .title {
                    vertical-align: top;
                    line-height: 0.2rem;
                    .ques {
                        vertical-align: top;
                        display: inline-block;
                        width: 0.2rem;
                        height: 0.2rem;
                        background: url('./images/ques.jpg') no-repeat center;
                        background-size: 67%;
                    }
                }
                .score{
                    font-size: 29px;
                }
                .btn_container {
                    height: 0.2rem;
                    position: absolute;
                    right: 0.15rem;
                    margin-top: -0.1rem;
                    top: 50%;
                    .button {
                        .white_btn();
                        display: inline-block;
                        text-align: center;
                        border-color: #494B51;
                        color: #494B51;
                        padding: 1px 0;
                        box-sizing: content-box;
                        width: 0.66rem;
                        margin-left: 0.12rem;
                    }
                }
            }
            .how {
                border-top: solid 1px #f2f2f2;
                color: #999;
                padding: 0.05rem 0;
                margin-left: 0.2rem;
            }
        }

        .GoodsList {
            margin-top: 0.1rem;
            background-color: #fff;
            overflow: hidden;
        }
    }
</style>