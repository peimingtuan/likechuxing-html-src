<template>
    <div class="Detail">
        <p class="block">
            <span>由于广州对非广州籍中小客车实行“开四停四”管理措施，所有标识</span>
            <img class="min-icon" :src="require('./images/禁入限行区.png')" />
            <span>的车辆，无法开入限行区。</span>
        </p>
        <p class="block">
            <span>如果您将该车驶入限行区内， 系统将按照订单时长</span>
            <span class="warn">每分钟额外加收 10 元还车附加费</span>
            <span>。</span>
        </p>
        <p class="block">
            <span>将「禁入限行区」的车驶入限行区内造成的违章 ( </span>
            <span class="warn">扣 3 分，罚款200元人民币</span>
            <span> ) ，需您本人负责。</span>
        </p>
        <p class="block">
            <span>如需进入限行区，请选择标有</span>
            <img class="min-icon" :src="require('./images/可入限行区.png')" />
            <span>的车辆。</span>
        </p>

        <img class="area" :src="require('./images/areaMap.png')" />
        <p class="min-detail" :class="{moreBottom:show_btn}">
            广州市大观路 ( 广汕路至中山大道段，不含 )、东环城市快速路 ( 中山大道至东大桥段，不含 )、珠江水道 ( 东圃大桥至长洲岛至丫髻沙大桥至广和大桥段，海珠区南面、长洲岛和番禺区北面、海珠区和白云区西面、大坦沙和金沙洲东面 ) ，鸦岗大道 ( 不含 )、华南快速干线三期 ( 鸦岗大道至春岗立交段，不含 )、华南快速干线三期辅路 ( 不含 )、尖彭路 ( 不含 )、同泰路 ( 不含 )、华南快速干线二期 ( 春岗立交段至广汕路段，不含 )、广汕路 ( 大观路至华南快速干线段，不含 ) 合围的区域以及进入上述区域的洛溪大桥、鹤洞大桥、洲头咀隧道、珠江隧道、珠江大桥东桥、金沙洲大桥。
        </p>

        <OrderContinue v-if="show_btn" />
    </div>
</template>

<script>
  import OrderContinue from './components/OrderContinue'

  export default {
    name: "index",
    data() {
      return {
        show_btn:/order=1/.test(window.location.search)
      }
    },
    components: {
      OrderContinue
    }
  }
</script>

<style lang=less>
    html,body{
        background-color: #fff;
    }
    .Detail{
        padding:0.2rem;
        .block{
            margin-bottom:0.1rem;
            line-height: 0.2rem;
            &>*{
                vertical-align: middle;
            }
        }
        .warn{
            color: #ED3800;
        }
        .area{
            width: 100%;
        }
        .min-detail{
            margin-bottom: 0.4rem;
            padding: 0.12rem 0.13rem;
            font-size: 11px;
            color: #B0B2B5;
            background: rgba(237,56,0,0.05);
            &.moreBottom{
                margin-bottom: 0.8rem;
            }
        }
        .min-icon{
            height: 0.2rem;
        }
    }
</style>