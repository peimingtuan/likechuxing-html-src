<template>
    <div class="wrap">

        <!--优惠券-->
        <div v-if="type === 0" class="containers">
            <ol>
                <li>优惠券不同享、不找零；</li>
                <li>每个订单限用一张优惠券；</li>
                <li>每日可使用6次优惠（包含优惠券和红包）；</li>
                <li>优惠券需在有效期范围内使用，过期后自动作废；</li>
                <li>优惠券仅可在满足其使用限制的订单中使用；</li>
                <li>免费用车券可抵扣订单中对应时长产生的里程费和时长费，超过的时间正常收费；</li>
                <li>无法支付“不计免赔服务”费用。</li>
            </ol>
        </div>

        <!--红包-->
        <div v-else class="containers">
            <ol>
                <li>红包不同享、不找零；</li>
                <li>每个订单限用一个红包；</li>
                <li>每日可使用6次优惠（包含优惠券和红包）；</li>
                <li>红包需在有效期范围内使用，过期后自动作废；</li>
                <li>红包仅可在满足其使用限制的订单中使用；</li>
                <li>无法支付“不计免赔服务”费用。</li>
            </ol>
        </div>

    </div>
</template>

<script>

  export default {
    name:"detail",
    data(){
      return{
        type: Number(this.$route.query.type) || 0
      }
    }
  }
</script>

<style lang="less">
    .wrap{
        min-height: 100vh;
        background-color: #fff;
        .containers{
            box-sizing: border-box;
            height: 100%;
            padding: .2rem .18rem 0 .2rem;
            ol{
                list-style: decimal;
                padding-left: .2rem;
            }
            li{
                font-size: 14px;
                color: #333333;
                line-height: 20px;
                margin-bottom: .1rem;
            }
        }
    }
</style>