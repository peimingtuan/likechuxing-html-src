<template>
    <div class="currentCost">

        <div class="PublicMsg" v-if="discount_title">
            <span>您已参加 {{discount_title}} 活动</span>
        </div>

        <div class="box">
            <div class="title">收费标准</div>

            <div class="content">
                <div class="item">
                    <span class="strong">{{car_price[0]}}</span>
                    <span>{{car_price[1]}} +</span>
                    <span class="strong">{{car_price[2]}}</span>
                    <span>{{car_price[3]}}</span>
                    <img class="price_type" :src="require('./images/tejia.png')"/>
                </div>
                <div class="item" v-if="price_insurance">
                    <span class="strong">{{price_insurance}}</span>
                    <span>元/小时 不计免赔服务</span>
                </div>
            </div>
        </div>

        <div class="box">
            <div class="title">费用明细</div>

            <ul class="detailList">
                <li class=" clearfix"><span class="float-left">当前里程（公里）</span><span
                        class="float-right">{{total_km}}</span></li>
                <li class=" clearfix"><span class="float-left">当前时长（时间）</span><span class="float-right">{{total_time}}</span>
                </li>

                <li class="clearfix" v-if="discount_km"><span class="float-left">优惠里程（公里）</span><span class="float-right">{{discount_km}}</span>
                </li>
                <li class="clearfix" v-if="discount_min"><span class="float-left">优惠时长（时间）</span><span class="float-right">{{discount_min}}</span>
                </li>
                <li class="clearfix" v-if="discount_msg"><span class="float-left">{{discount_msg}}</span><span class="float-right">{{discount_fee}}</span>
                </li>

                <li class=" clearfix"><span class="float-left">里程费（元）</span><span
                        class="float-right">{{km_money}}</span></li>
                <li class=" clearfix"><span class="float-left">用时费（元）</span><span
                        class="float-right">{{min_money}}</span></li>
                <li class=" clearfix"><span class="float-left">还车附加费（元）</span><span class="float-right">{{parking_fee_in}}</span>
                </li>
                <li class=" clearfix" v-if="price_insurance"><span class="float-left">不计免赔服务费（元）</span><span class="float-right">{{fee_total_insurance}}</span>
                </li>
            </ul>

            <ul class="detailList total">
                <li class=" clearfix"><span class="float-left">当前费用（元）</span><span class="float-right">{{total_money}}</span>
                </li>
            </ul>
        </div>

        <footer>服务解释权归立刻出行所有</footer>
    </div>
</template>

<script>
  import format from '../../../../other_modules/like-function/format'
  import appArguments from '../../../../other_modules/app-arguments'
  import {CarPrice} from '../../../../other_modules/like-model/index'

  export default {
    name: "index",
    data () {
      return {
        car_price:[],
        price_insurance: '',

        total_km: '',
        total_time: '',
        km_money: '',
        min_money: '',
        parking_fee_in: '',
        total_money: '',
        fee_total_insurance: '0.00',

        discount_title: '',
        discount_msg: '',
        discount_km: '',
        discount_min: '',
        discount_fee: '0.00',
      }
    },
    methods: {
      getData () {
        console.log(window.location.search,appArguments.car_price_text)
        this.car_price = new CarPrice({
          car_price_text:appArguments.car_price_text,
          price_km:appArguments.price_km,
          price_min:appArguments.price_min
        }).getPrice()

        // 保险不计免赔
        if(Number(appArguments.price_insurance) > 0)this.price_insurance = appArguments.price_insurance

        this.total_km = Number(appArguments.total_km).toFixed(1)
        this.total_time = format.during(appArguments.total_time) || '1分钟'
        this.km_money = format.money(appArguments.km_money)
        this.min_money = format.money(appArguments.min_money)
        this.parking_fee_in = format.money(appArguments.parking_fee_in)
        this.total_money = format.money(appArguments.total_money)
        this.fee_total_insurance = format.money(appArguments.fee_total_insurance)

        if(appArguments.discount_title)this.discount_title = decodeURIComponent(appArguments.discount_title)
        if(appArguments.discount_msg)this.discount_msg = decodeURIComponent(appArguments.discount_msg)
        if(appArguments.discount_time)this.discount_min = decodeURIComponent(appArguments.discount_time)
        if(appArguments.discount_km)this.discount_km = Number(appArguments.discount_km).toFixed(1)
        if(appArguments.discount_fee)this.discount_fee = format.money(appArguments.discount_fee)
      }

    },
    created () {
      this.getData()
    }
  }
</script>

<style lang=less scoped>


    .currentCost {
        padding-top: 1px;
        box-sizing: border-box;
        min-height: 100vh;
        position: relative;

        .PublicMsg {
            width: 100%;
            padding: 0.08rem 0.1rem;
            box-sizing: border-box;
            font-size: 13px;
            background: #FFFCE0;
            color: #ED3800;
            text-align: center;
            margin-bottom: -0.1rem;
            span {
                line-height: 0.2rem;
                display: inline-block;
                vertical-align: top;
                &::before {
                    content: '';
                    width: 0.2rem;
                    height: 0.2rem;
                    display: inline-block;
                    vertical-align: top;
                    background: url('./images/talk.png') no-repeat center;
                    background-size: 100%;
                    margin-right: 0.06rem;
                }
            }
        }

        .box {
            background-color: #fff;
            padding:0.06rem 0 0.06rem 0.2rem;
            margin-top: 0.1rem;

            .title {
                padding: 0.1rem 0;
                font-size: 12px;
                color: #999;
                border-bottom: solid 1px #f2f2f2;
            }

            .content {
                padding: 0.1rem 0;
                font-size: 0.13rem;
                color: #999;
                .item{
                    position: relative;
                }
                span {
                    margin-right: 1px;
                    line-height: 0.2rem;
                }
                .strong {
                    font-size: 15px;
                    color: #111;
                }
                .price_type {
                    position: absolute;
                    margin-left: 0.05rem;
                    height: 0.13rem;
                    top: 50%;
                    margin-top: -0.07rem;
                }
            }

            .detailList {
                padding: 0.1rem 0.2rem 0.1rem 0;
                font-size: 13px;
                li {
                    padding: 0.05rem 0;
                }

                &.total {
                    border-top: solid 1px #f2f2f2;
                    padding: 0.2rem 0.2rem 0.15rem 0;
                    font-size: 15px;
                }
            }
        }

        footer{
            color:#999;
            font-size: 12px;
            text-align:center;
            line-height:32px;
            width:100%;
            position: absolute;
            bottom:0;
        }
    }

</style>