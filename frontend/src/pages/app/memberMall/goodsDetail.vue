<template>
    <div class="GoodsDetail">
        <div class="GoodsImages">
            <swiper v-if="banner_image.length>0" class="swiper" ref="mySwiper" :options="swiperOption">
                <swiper-slide
                        class="slide"
                        v-for="item in banner_image"
                        :key="item.s"
                        :style="{
                            backgroundImage:'url('+item.s+')'
                        }"
                />
            </swiper>
            <div class="swiper-pagination"></div>
        </div>

        <div class="Address" v-if="cate_id===2" @click="toAddress">
            <div class="AddressBox">
                <div class="title">收货地址
                    <div class="address">{{name}} {{phone}} {{area}} {{address}}</div>
                </div>
                <div class="arrow"></div>
            </div>
        </div>

        <div class="DetailExplain">
            <div class="ExplainBox" v-if="goods_cond.length>0">
                <div class="title fs16">兑换条件</div>
                <ul class="detail">
                    <li class="item" v-for="item in goods_cond" :key="item">{{item}}</li>
                </ul>
            </div>
            <div class="ExplainBox" v-if="goods_desc.length>0">
                <div class="title fs16">详情说明</div>
                <ul class="detail">
                    <li class="item" v-for="item in goods_desc" :key="item">{{item}}</li>
                </ul>
            </div>
        </div>

        <div class="FooterButton">
            <button class="btn btn-primary btn-block fs16" @click="willPurchase">立刻兑换</button>
        </div>

        <FooterApple/>
    </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import FooterApple from './component/footerApple.vue'
  import {Alert, Toast, Loading,Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import Alert3001 from '../../../../other_modules/vue-popMessage/Alert3001'
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import preview from '../../../../other_modules/previewImg'
  import MemberMallData from './js/MemberMallData'
  import {appMutual} from '../../../../other_modules/app-mutual'

  let memberMallData = new MemberMallData()

  export default {
    name: "goods-detail",
    components: {
      swiper,
      swiperSlide,
      FooterApple
    },
    data() {
      return {
        goods: null,
        id: 0,
        cate_id: 0,
        point: 99999,
        store_num: 0,
        goods_cond: [],
        // desc = prop.concat(desc) 先属性后描述
        goods_desc: [],
        banner_image: [],

        name:memberMallData.state.name || '',
        phone:memberMallData.state.phone || '',
        area:memberMallData.state.area || '',
        address:memberMallData.state.address || '',

        is_purchasing: false
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },
      swiperOption() {
        let that = this
        return {
          pagination: {
            el: this.banner_image.length <= 1 ? false : '.swiper-pagination',
            clickable: false
          },
          spaceBetween: 0,
          on:{
            click: function(){
              that.preview(this.clickedIndex)
            }
          }
        }
      }
    },
    methods:{
      preview(index){
        let url = this.banner_image[index].l

        appMutual.send.setIosEnvColor({
          color:'ffffff'
        })
        preview({
          url,
          close:true,
          onClose:function(){
            appMutual.send.setIosEnvColor({
              color:'f2f2f2'
            })
          }
        })
      },
      toAddress(){
        window.location.href = 'editAddress.html?id='+this.id+"&user_version="+appArguments.user_version
      },
      willPurchase(){
        if(this.is_purchasing){
          return
        }

        if(this.cate_id === 2){
          if(this.name === '' || this.phone === ''){
            Toast('请填写收货地址')
            return
          }
        }

        Confirm({
          title: '确定兑换？',
          msg: "将会扣除您 " + this.point + " 里程积分",
          confirmButtonCallback: this.purchase
        })
      },
      purchase(){
        this.is_purchasing = true

        let data = {
          uuid: memberMallData.state.uuid,
          sign: memberMallData.state.sign,
          id: this.id
        }
        if(this.cate_id===2){
          data.logistic_user_name = this.name
          data.logistic_user_phone = this.phone
          data.logistic_address = this.area+' '+this.address
        }

        let that = this
        let loading = Loading()
        myAjax.post(getApiUrl('point/buy-good'), data).then(res=>{
          loading.close()
          that.is_purchasing = false

          if (res.status === 0) {
            memberMallData.save({
              goodsExchange: Object.assign({}, this.goods, {
                coupon_val: res.data.coupon_val
              })
            })
            window.location.href = 'exchangeSuccess.html?footerColor=ffffff'
          } else if (res.status === 9) {
            Confirm({
              title:'兑换失败',
              msg: '您的里程积分不足',
              cancelButtonText: '提高里程积分',
              cancelButtonCallback: function () {
                window.location.href = '/static/likeScore/increase.html'
              }
            })
          } else if ([10, 11, 12].includes(res.status)) {
            Confirm({
              title:'兑换失败',
              msg: '您暂时未能满足兑换规则：'+res.msg,
              cancelButtonText: "里程积分说明",
              cancelButtonCallback: function () {
                window.location.href = '/static/likeScore/mainPoint.html'
              }
            })
          } else if (res.status === 3001){
            Alert3001({
              msg:'因您有'+res.data.reason+'行为，当前账号无权进行该操作'
            })
          }else {
            Alert({
              title:'兑换失败',
              msg: res.msg
            })
          }
        })
      }
    },
    created() {
      //let loading = Loading()
      myAjax.post(getApiUrl('point/detail'), {
        uuid: memberMallData.state.uuid,
        sign: memberMallData.state.sign,
        id: appArguments.id
      }).then(res => {
        //loading.close()

        if(res.status === 0){
          this.goods = res.data
          this.id = res.data.id
          this.cate_id = res.data.cate_id
          this.point = res.data.point
          this.goods_cond = res.data.goods_cond
          this.goods_desc = res.data.goods_prop.concat(res.data.goods_desc)
          this.store_num = res.data.store_num
          this.banner_image = res.data.banner_image.map(item=>{
            if(typeof item === 'string'){
              return {
                l:item,
                s:item
              }
            }else{
              return item
            }
          })
        }else{
          Toast(res.msg)
        }
      }).catch(err => {
        //loading.close()
        Toast(err.msg)
      })
    }
  }
</script>

<style lang=less>
    .GoodsDetail {

        .GoodsImages {
            padding: 0.1rem 0;
            background-color: #fff;
            .swiper {
                width: 100%;
                .slide {
                    height: 1.36rem;
                    text-align: center;
                    background: no-repeat center;
                    background-size: contain;
                }
            }
            .swiper-pagination-bullet {
                background: rgba(17, 17, 17, 0.2);
                width: 6px;
                height: 6px;
                border-radius: 3px;
                margin: 0 3px !important;
                opacity: 1;
                &.swiper-pagination-bullet-active {
                    background: #494B51;
                    width: 10px;
                }
            }
            .swiper-pagination {
                position: static;
            }
        }

        .AddressBox {
            background-color: #fff;
            padding: 0.15rem 0 0.15rem 0.2rem;
            margin: 0.1rem 0;
            position: relative;
            .title {
                padding-right: 0.4rem;
                line-height: 0.2rem;

                .address {
                    margin-left: 4em;
                    margin-top: -0.2rem;
                    height: 0.2rem;
                    overflow: hidden;
                    word-break: break-all;
                    text-indent: 1em;
                    color: #999;
                }
            }
            &::after {
                content: '';
                position: absolute;
                width: 0.1rem;
                height: 0.16rem;
                background: url('./images/arrow_right.png') no-repeat center;
                background-size: 100%;
                right: 0.15rem;
                top: 50%;
                margin-top: -0.08rem
            }
        }

        .DetailExplain {
            background-color: #fff;
            margin-top: 0.1rem;
            margin-bottom: 0.76rem;
            .ExplainBox {
                border-bottom: solid 1px #f2f2f2;
                padding: 0.15rem 0.2rem;
                color: #111;
                .title {
                    font-weight: 500;
                    line-height: 0.3rem;
                }
                .detail {
                    .item {
                        position: relative;
                        margin-left: 1em;
                        line-height: 0.24rem;
                        &::before {
                            content: '';
                            display: inline-block;
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            border-radius: 2px;
                            background-color: #111;
                            margin-top: -2px;
                            margin-left: 2px;
                            top: 0.12rem;
                            left: -1em;
                        }
                    }
                }
            }
        }

        .FooterButton {
            position: fixed;
            z-index: 10;
            bottom: 0;
            width: 100%;
            height: 0.66rem;
            box-sizing: border-box;
            padding: 0.1rem;
            background-color: #f2f2f2;
            //border-top: solid 1px #f7f7f7;
            .btn {
                height: 100%;
            }
        }
    }
</style>