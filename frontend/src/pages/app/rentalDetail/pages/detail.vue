<template>
    <div class="detail-page" v-if="dataReady">

        <DetailHeader :data="fee_detail"/>

        <div class="detail_body">
            <!--车辆信息-->
            <div class="box">
                <TextInLine text="车辆信息"/>
                <DetailItems :list="car_info"/>
            </div>

            <!--费用明细-->
            <div class="box">
                <TextInLine text="费用明细"/>
                <DetailItems :list="fee_detail_1"/>
                <TextInLine/>
                <DetailItems :list="fee_detail_2"/>
                <TextInLine/>
                <DetailItems :list="fee_detail_3"/>
                <TextInLine/>
                <DetailItems :list="fee_detail_4"/>
            </div>

            <!--操作记录-->
            <div class="box">
                <TextInLine text="操作记录"/>

                <DetailOperateHistory :data="fee_detail"/>
            </div>
        </div>
    </div>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'
  import {time} from '../../../../../other_modules/like-function/time'
  import {CarPrice} from '../../../../../other_modules/like-model/'
  import {mapState} from 'vuex'

  import DetailHeader from '../components/DetailHeader'
  import TextInLine from '../components/TextInLine'
  import DetailItems from '../components/DetailItems'
  import DetailOperateHistory from '../components/DetailOperateHistory'

  export default {
    name: "detail",
    data () {
      return {
        dataReady: false
      }
    },
    components: {
      DetailHeader,
      TextInLine,
      DetailItems,
      DetailOperateHistory
    },
    computed: {
      ...mapState(['fee_detail']),
      // 车辆信息
      car_info () {
        if(!this.fee_detail)return []
        let list = [
          {
            name: this.fee_detail.car_type,
            value: this.fee_detail.plate
          },
          {
            name: '计费价格',
            value: new CarPrice({car_price_text:this.fee_detail.price_desc}).getPricePureText()
          }
        ]

        if (Number(this.fee_detail.price_insurance) > 0) {
          list.push({
            name: '不计免赔服务',
            value: this.fee_detail.price_insurance + '元/小时'
          },)
        }
        return list
      },
      fee_detail_1 () {
        // 总里程、总时长
        let list = [
          {
            name: '总里程（公里）',
            value: Number(this.fee_detail.distance).toFixed(1)
          },
          {
            name: '总时长（时间）',
            value: time.duration(this.fee_detail.total_time)
          }
        ]

        // 新用户或其他订单活动
        if (this.fee_detail.discount_msg) {
          list = list.concat([
            {
              name: '优惠里程（公里）',
              value: Number(this.fee_detail.discount_km).toFixed(1)
            },
            {
              name: '优惠时长（时间）',
              value: this.fee_detail.discount_time
            },
            {
              name: this.fee_detail.discount_msg,
              value: format.money(fee_detail.discount_fee)
            }
          ])
        }

        // 里程费、用时费
        list = list.concat([
          {
            name: '里程费（元）',
            value: this.fee_detail.km_fee
          },
          {
            name: '用时费（元）',
            value: this.fee_detail.time_fee
          }
        ])

        // 动态加价
        if(this.fee_detail.price_extra > 0){
          list.push({
            name:'动态加价（元）',
            value:this.fee_detail.price_extra
          })
        }

        // 还车附加费
        if(this.fee_detail.parking_fee_in > 0){
          list.push({
            name:'还车附加费（元）',
            value:this.fee_detail.parking_fee_in
          })
        }

        return list
      },
      fee_detail_2 () {
        // 应付、优惠券、红包
        return [
          {
            name: '应付（元）',
            name_class:'strong-1',
            value: format.money(this.fee_detail.fee_total),
            value_class:'strong-1'
          },
          {
            name: '优惠券',
            name_class:'gray',
            value: '-' +format.money(this.fee_detail.coupon_fee),
            value_class:'gray'
          },
          {
            name: '红包',
            name_class:'gray',
            value: '-'+format.money(this.fee_detail.coupon_cash_fee),
            value_class:'gray'
          }
        ]
      },
      fee_detail_3 () {
        // 惠后应付、不计免赔、余额
        let list = [
          {
            name: '惠后应付',
            value: format.money(this.fee_detail.rental_actual_fee)
          }
        ]

        // 不计免赔
        if(Number(this.fee_detail.price_insurance) > 0){
          list.push({
            name: '不计免赔服务（元）',
            value: format.money(this.fee_detail.fee_total_insurance)
          })
        }

        // 0 里程面单
        /* if(this.fee_detail.rental_zero_remark){
           list.push({
             name: '0里程免单优惠',
             value: this.fee_detail.rental_zero_remark
           })
         }*/
        if(this.fee_detail.rental_zero_money !== '0.00'){
          list.push({
            name: '0里程免单优惠',
            name_class:'gray',
            value: '-'+this.fee_detail.rental_zero_money,
            value_class:'gray'
          })
        }

        // 余额
        list.push({
          name: '余额（元）',
          name_class:'gray',
          value: '-'+format.money(this.fee_detail.balance),
          value_class:'gray'
        })

        return list
      },
      fee_detail_4 () {
        return [{
          name:'实付（元）',
          name_class:'strong-2',
          value:format.money(this.fee_detail.actual_fee),
          value_class:'strong-2'
        }]
      }
    },
    created () {
      if(!this.fee_detail){
        let loading = this.$_LIKE_loading()
        this.$store.dispatch('getFeeDetail').then(()=>{
          this.dataReady = true
          loading.close()
        }).catch(err=>{
          this.$_LIKE_toast(err.msg)
        })
      }else{
        this.dataReady = true
      }
    }
  }
</script>

<style lang="less">


    .detail-page {
        min-height: 100vh;
        background-color: #f7f7f7;
    }

    .detail_body {
        padding: 0.1rem 0.45rem;
        .box {
            margin: 0.1rem 0;
            font-size: 0.13rem;
            color:#555;

            .gray{
                color:#999;
            }

            .strong-1{
                color:#111;
            }

            .strong-2 {
                font-size: 0.16rem;
            }

        }
    }
</style>