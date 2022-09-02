<template>
  <div class="detail-page" v-if="data.hasOwnProperty('total_fee')">
    <div class="detail_header clearfix">
      <div class="box float-left">
        <p>{{data.distance}}公里</p>
        <p class="desc">里程</p>
      </div>
      <div class="box main float-left text-center">
        <p>{{data.total_time}}</p>
        <p class="desc">用时</p>
      </div>
      <div class="box  float-left text-right">
        <p class="warn">{{data.total_fee}}元</p>
        <p class="desc">费用</p>
      </div>
    </div>
    <div class="detail_body">
      <!--计费价格-->
      <div class="box">
        <div class="text_in_line">
          <span class="text">计费价格</span>
        </div>
        <div>
          <span class="strong">{{data.dt_distance_price}}</span>
          <span>元/公里 + </span>
          <span class="strong">{{data.dt_time_price}}</span>
          <span>元/分钟</span>
        </div>
      </div>

      <!--费用明细-->
      <div class="box">
        <div class="text_in_line">
          <span class="text">费用明细</span>
        </div>
        <ul class="detail_list">
          <li class="detail_item">总里程（公里）<span class="float-right">{{data.distance}}</span></li>
          <li class="detail_item">总时长（时间）<span class="float-right">{{data.total_time}}</span></li>

          <!--新用户或其他订单活动-->
          <li class="detail_item" v-if="data.discount_msg">优惠里程（公里）<span class="float-right">{{data.discount_km}}</span></li>
          <li class="detail_item" v-if="data.discount_msg">优惠时长（时间）<span class="float-right">{{data.discount_min}}</span></li>
          <li class="detail_item" v-if="data.discount_msg">{{data.discount_msg}}<span class="float-right">{{data.discount_fee}}</span></li>

          <li class="detail_item">里程费（元）<span class="float-right">{{data.km_fee}}</span></li>
          <li class="detail_item">用时费（元）<span class="float-right">{{data.time_fee}}</span></li>

          <!--动态加价-->
          <li class="detail_item" v-if="data.price_extra !== '0.00'">动态加价（元）<span class="float-right">{{data.price_extra}}</span></li>
          <!--还车附加费-->
          <li class="detail_item" v-if="data.parking_fee_in !== '0.00'">还车附加费（元）<span class="float-right">{{data.parking_fee_in}}</span></li>

          <!--分组线-->
          <li class="gray_line"></li>

          <li class="detail_item">应付（元）<span class="float-right">{{data.deal_fee}}</span></li>
          <li class="detail_item reduce">优惠券<span class="float-right">- {{data.coupon_fee}}</span></li>
          <li class="detail_item reduce">余额（元）<span class="float-right">- {{data.balance}}</span></li>

          <li class="gray_line"></li>

          <li class="detail_item">实付（元）<span class="float-right">{{data.actual_fee}}</span></li>
        </ul>
      </div>

      <!--操作记录-->
      <div class="box">
        <div class="text_in_line">
          <span class="text">操作记录</span>
        </div>
        <ul class="operate_list">
          <li><div>{{data.book_time_f}}</div><div><span class="three_points"></span>预定成功</div></li>
          <li v-if="data.begin_time>0"><div>{{data.begin_time_f}}</div><div><span class="three_points"></span>计费开始</div></li>

          <!--系统取消-->
          <li class="sys_cancel" v-if="data.end_time>0 && data.is_cancel && data.auto_cancel"><div>{{data.end_time_f}}</div><div class="two_point"><span class="three_points"></span>取消成功<p>超3小时系统取消</p></div></li>
          <!--用户取消-->
          <li v-if="data.end_time>0 && data.is_cancel && !data.auto_cancel"><div>{{data.end_time_f}}</div><div class="two_point"><span class="three_points"></span>取消成功</div></li>
          <!--顺利完成-->
          <li v-if="data.end_time>0 && !data.is_cancel"><div>{{data.end_time_f}}</div><div><span class="three_points"></span>还车成功</div></li>

          <li v-if="data.pay_time>0"><div>{{data.pay_time_f}}</div><div><span class="three_points"></span>系统扣款成功</div></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import myAjax from '../../common/myAjax'
  import API from '../../common/apiAddress'
  import {mapState} from 'vuex'
  import format from '../../common/Format';

  function formatData(data){
    let price_desc = data.price_desc.split('+');
    let dt_distance_price = price_desc[0].match(/[\d\.]+/).toString();
    let dt_time_price = price_desc[1].match(/[\d\.]+/).toString();
    return {
      distance: Number(data.distance).toFixed(1),
      total_time:format.during(data.total_time),
      total_fee:data.fee_total,

      dt_distance_price:dt_distance_price,
      dt_time_price:dt_time_price,
      price_extra:data.price_extra,

      km_fee:data.km_fee,
      time_fee:data.time_fee,
      deal_fee:data.fee_total,
      parking_fee_in:data.parking_fee_in,
      coupon_fee:Math.abs(+data.coupon_fee).toFixed(2),
      balance:Math.abs(+data.balance).toFixed(2),
      actual_fee: data.actual_fee,

      discount_msg:data.discount_msg,
      discount_fee:format.money(data.discount_fee),
      discount_km:Number(data.discount_km).toFixed(1),
      discount_min:data.discount_time,

      book_time: data.book_time,
      book_time_f:format.time(data.book_time,0),
      begin_time: data.begin_time,
      begin_time_f: format.time(data.begin_time,0),
      end_time: data.end_time,
      end_time_f: format.time(data.end_time,0),
      pay_time: data.pay_time,
      pay_time_f: format.time(data.pay_time,0),
      auto_cancel: data.auto_cancel,
      is_cancel: data.is_cancel
    }
  }

  export default {
    name: "detail",
    data(){
      return {
        data:{}
      }
    },
    computed:{
      ...mapState('rental',[
        'rental'
      ])
    },
    methods:{
      getDetail(){
        let loading = this.$_LIKE_loading()
        myAjax.postV2(API.rentalHistory.feeDetail,{
          rental_no:this.$route.query.rental_no
        }).then(res=>{
          loading.destroy()
          if(res.status === 0){
            this.data = formatData(res.data)
          }else{
            this.$_LIKE_toast(res.msg)
          }
        })
      }
    },
    created(){
      this.getDetail()
    }
  }
</script>

<style lang="less" scoped>
  .one_points_mixins {
    position: absolute;
    display: block;
    width: 0.02rem;
    height: 0.02rem;
    background-color: #D8D8D8;
    left: 0;
    border-radius: 50%;
  }

  .detail-page{
    text-align: left;
    min-height:100vh;
    background-color:#f7f7f7 ;
  }
  .detail_header{
    background-color: #fff;
    padding: 0.2rem;
    font-size: 0.13rem;
    border-bottom:solid 1px #dbdbdb;
    .box{
      width: 25%;
      font-size: 0.15rem;
      &.main{
        width: 50%;
      };
      .desc{
        font-size: 0.13rem;
        color:#999;
      }
    }
  }
  .detail_body{
    padding: 0.2rem;
    .box{
      margin:0.1rem 0;
      font-size:0.13rem ;
      .text_in_line{
        position: relative;
        text-align: center;
        line-height: 0.2rem;
        font-size: 0.12rem;
        &::before{
          content: '';
          position: absolute;
          top:0.18rem;
          left:0;
          z-index: 10;
          height: 1px;
          width: 100%;
          background-color: #dfdfdf;
        }
        .text{
          position: relative;
          z-index: 11;
          display: inline-block;
          padding: 0.1rem 0.2rem;
          background-color:#f7f7f7;
          color:#999;
        }
      }
      .strong{
        font-size: 0.16rem;
      }
      .detail_list{
        color:#111;
        .detail_item{
          line-height: 0.26rem;
          &.reduce{
            color:#999;
          }
        }
        .gray_line{
          height: 1px;
          background-color: #DBDBDB;
          margin:5px 0;
        }
      }
      .operate_list {
        position: relative;
        font-size: 0.12rem;
        li {
          margin-left: 1.2em;
          line-height: 0.16rem;
          zoom: 1;
          overflow: hidden;
          padding: 0.07rem 0;
          & > div {
            &:nth-of-type(1) {
              color: #999;
              float: left;
            }
            &:nth-of-type(even) {
              float: right;
              text-align: right;
            }
          }

          &::before {
            content: '';
            display: block;
            position: absolute;
            left: 0;
            width: 0.06rem;
            height: 0.06rem;
            margin-left: 0.01rem;
            background-color: #999;
            border-radius: 50%;
            margin-top: 0.05rem;
          }
          &:nth-last-of-type(1) {
            &::before {
              width: 0.08rem;
              height: 0.08rem;
              margin-left: 0;
              background-color: #111;
              margin-top: 0.04rem;
            }
            .three_points {
              display: none;
            }
            .two_point {
              &::before {
                display: none;
              }
              &::after {
                display: none;
              }
            }
          }

          .three_points {
            .one_points_mixins;
            margin-left: 0.03rem;
            margin-top: 0.16rem;
            &::before {
              content: '';
              margin-top: 0.05rem;
              .one_points_mixins;
            }
            &::after {
              content: '';
              margin-top: 0.1rem;
              .one_points_mixins;
            }
          }
        }
        .sys_cancel {
          padding-bottom: 0.18rem;
          p {
            width: 50%;
            color: #999;
            font-size: 0.12rem;
            position: absolute;
            right: 0;
            margin-right: -1em;
            margin-top: -0.05em;
            transform: scale(0.8);
          }
          .two_point {
            &::before {
              content: '';
              margin-left: 0.03rem;
              margin-top: 0.31rem;
              .one_points_mixins
            }
            &::after {
              content: '';
              margin-left: 0.03rem;
              margin-top: 0.2rem;
              .one_points_mixins
            }
          }
        }
      }
    }
  }
</style>
