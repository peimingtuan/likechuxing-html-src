<template>
    <div class="Detail">
        <!--什么是早晚通勤车-->
        <!--<div class="block">
            <p class="title">1. 什么是早晚通勤车</p>
            <p>为方便广州周边用户向广州通勤，我们特选出一批忠实用户，以更优惠的价格使用指定车辆通勤。</p>
            <p class="gray">注：早晚通勤车仅在广州及周边地区中运行，下面所有内容均只适用于该地区。</p>
        </div>-->

        <!--优惠说明-->
        <div class="block">
            <p class="title">1. 优惠说明</p>

            <p>( 1 ) 早通勤车</p>
            <p class="gray">优惠内容</p>
            <p class="warn">里程费和时长费 5 折</p>
            <p class="gray">注意事项</p>
            <p>a. 早通勤车在<span class="warn">当日 24 点前预订</span>，取车时间为<span class="warn">次日早 5 点到早 10 点</span>；</p>
            <p>b. 早通勤车的取车网点必须是广州限行区以外的网点，还车网点必须是广州限行区以内的网点，否则无法享受优惠；</p>
            <p>c. 请在所选用车时间后半小时内取车，如果因长时间不取车而导致系统取消预订，无法享受优惠；</p>
            <p>d. <span class="warn">早通勤车优惠时长为 6 小时，超时部分系统将正常计费。</span></p>

            <p>( 2 ) 晚通勤车</p>
            <p class="gray">优惠内容</p>
            <p class="warn">里程费和时长费 5 折</p>
            <p class="gray">注意事项</p>
            <p>a. 晚通勤车的取车时间为<span class="warn">每天 {{dispatchOut[0]}}:00 至 {{dispatchOut[1]}}:00</span>；</p>
            <p>b. 晚通勤车在广州限行区以内的网点取车，并将车还到广州限行区以外的网点；</p>
            <p>c. 如果将车辆还在广州限行区内，无法享受优惠；</p>
            <p>d. 必须在<span class="warn">当天 24:00 前</span>将车辆开出限行区；</p>
            <p>e. 如果<span class="warn">当天 {{dispatchOut[1]}}:00 后</span>将车还在限行区内，系统将从 {{dispatchOut[1]}}:00 起每分钟额外加收 10 元还车附加费；</p>
            <p>f. 选择晚通勤车后，请及时取车，如果因长时间不取车而导致系统取消订单，无法享受优惠；</p>
            <p>g. <span class="warn">晚通勤车优惠时长为 6 小时，超时部分系统将正常计费。</span></p>
        </div>

        <!--如何使用早晚通勤车-->
        <div class="block">
            <p class="title">2. 如何使用早晚通勤车</p>
            <p>( 1 ) 早通勤车</p>
            <p>a. 当您处在广州限行区外，进入 app 首页，可以看到 “预订早通勤车” 的入口；</p>
            <p>b. 进入 “预订早通勤车”  页面，可以预定明天早 5 点到早 10 点的早通勤车、查看预订结果、选择通勤车辆；</p>
            <p>c. 使用通勤车的过程和普通用车过程相同；</p>
            <p>d. 到达还车网点，按照正常还车，系统会自动按照优惠计算费用。</p>
            <p>( 2 ) 晚通勤车</p>
            <p>a. 每天 {{dispatchOut[0]}}:00 至 {{dispatchOut[1]}}:00 开放 “选择晚通勤车” 的入口；</p>
            <p>b. 每天 {{dispatchOut[0]}}:00 至 {{dispatchOut[1]}}:00 期间进入 “选择晚通勤车” 页面，可以直接选择晚通勤车使用；</p>
            <p>c. 使用通勤车的过程和普通用车过程相同；</p>
            <p>d. 到达还车网点，按照正常还车，系统会自动按照优惠计算费用。</p>
        </div>

        <div class="block">
            <p class="title">3. 其他说明</p>
            <p>( 1 ) 立刻出行有权根据立刻出行早晚通勤车的运营情况调整早晚通勤车的实施方案；</p>
            <p>( 2 ) 具体价格以 app 中显示结果为准；</p>
            <p>( 3 ) 所有使用立刻出行早晚通勤车的用户，必须承担和其他立刻用户相同的责任（包括但不限于承担自己行程产生的违章、承担自己行程中对车辆损坏后的维修费用、承担自己行程中的事故责任）。</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: "dispatchOutDetail",
    data(){
      return {
        dispatchOut:[15,22],
        reserveIn:[5,10]
      }
    }
  }
</script>

<style lang=less>

.Detail{
    box-sizing: border-box;
    background-color: #fff;
    padding: 0.2rem;
    .block{
        margin-bottom: 0.2rem;
        p{
            line-height: 0.2rem;
            font-size: 14px;
            color:#333;
            margin:0.1rem 0;
        }
        .title{
            color:#111;
            font-size: 16px;
            font-weight: 700;
        }
        .gray{
            color:#999;
            font-size: 12px;
        }
        .warn{
            color: #ED3800;
            font-weight: 700;
        }
    }
}
</style>