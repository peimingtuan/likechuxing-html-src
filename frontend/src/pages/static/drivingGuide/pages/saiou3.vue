<template>
    <div class="detail">
        <div class="step">
            <div class="title">一、启动</div>
            <div class="img_con">
                <img alt="确认N档" :src="require('../images/saiou3/img_1.png')" />
            </div>
            <div class="desc">
                <span class="index">1.</span>
                <span class="content">上车后系安全带，调整座椅和后视镜，确认当前档位上为N档</span>
            </div>
            <div class="img_con">
                <img alt="启动车辆" :src="require('../images/saiou3/img_2.png')" />
            </div>
            <div class="desc">
                <span class="index">2.</span>
                <span class="content">踩住刹车，插入车钥匙，顺时针拧到头，点火成功后松手，检查仪表盘是否有故障灯亮起，油量是否充足</span>
            </div>
            <div class="img_con">
                <img alt="解除驻车制动" :src="require('../images/saiou3/img_3.png')" />
            </div>
            <div class="desc">
                <span class="index">3.</span>
                <span class="content">刹车踩到底，挂到D档，放下手刹，缓慢松开刹车， 车辆行驶</span>
            </div>
        </div>
        <div class="step">
            <div class="title">二、熄火</div>
            <div class="img_con">
                <img alt="确认N档" :src="require('../images/saiou3/img_4.png')" />
            </div>
            <div class="desc">
                <span class="index">1.</span>
                <span class="content">将车辆停在合法停车位，踩住刹车，拉起手刹，将档位调至N档，松开刹车</span>
            </div>
            <div class="img_con">
                <img alt="熄火" :src="require('../images/saiou3/img_5.png')" />
            </div>
            <div class="desc">
                <span class="index">2.</span>
                <span class="content">检查车窗及车灯是否都已经关闭，然后逆时针旋转车钥匙，熄火，拔出车钥匙，将其放回原位</span>
            </div>
            <div class="img_con">
                <img alt="锁门" :src="require('../images/saiou3/img_6.png')" />
            </div>
            <div class="desc">
                <span class="index">3.</span>
                <span class="content">携带好随身物品，下车点击锁门，然后还车</span>
            </div>
        </div>
        <div class="others">
            <div class="title">操作提示</div>
            <div class="item">
                <div class="item-name">开关大灯</div>
                <div class="img_con">
                    <img alt="开关大灯" :src="require('../images/saiou3/img_7.png')" />
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">顺时针旋转开灯，默认打开近光灯，逆时针旋转关灯</span>
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">将旋钮顺时针拧到头后，往方向盘扳是近光，远离方向盘扳是远光</span>
                </div>
            </div>
            <div class="item">
                <div class="item-name">开空调</div>
                <div class="img_con">
                    <img alt="开空调" :src="require('../images/saiou3/img_8.png')" />
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">点击AC按键打开空调，旋转旋钮调节气温，蓝色为制冷，红色为制热</span>
                </div>
            </div>
            <div class="item">
                <div class="item-name">切换手动挡/自动挡</div>
                <div class="img_con">
                    <img alt="换挡演示" :src="require('../images/saiou3/img_9.gif')" />
                </div>
                <div class="img_con">
                    <img alt="换挡只是" :src="require('../images/saiou3/img_10.png')" />
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">默认自动档，将档位挂到A/M后重新挂D档可切换至手动档</span>
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">仪表盘可查看当前状态：M为手动档，A为自动挡</span>
                </div>
            </div>
            <div class="item">
                <div class="item-name">解锁方向盘</div>
                <div class="img_con">
                    <img alt="开空调" :src="require('../images/saiou3/img_11.png')" />
                </div>
                <div class="desc">
                    <span class="index">·</span>
                    <span class="content">方向盘一边左右摇动 一边拧钥匙</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "saiou3"
  }
</script>

<style lang=less scoped>
.detail{
    padding: 0 0.2rem 0.25rem 0.2rem;

    .title{
        font-weight: 500;
    }

    .img_con{
        margin:0.1rem 0;
        min-height: 0.6rem;
        img{
            width: 100%;
        }
    }

    .desc{
        font-size:0;
        color:#666;
        padding-left: 16px;

        .index{
            font-size: 14px;
            width: 16px;
            display: inline-block;
            margin-left: -16px;
        }
        .content{
            font-size: 14px;
        }
    }

    .step{
        padding: 0.15rem 0;
        .title{
            font-size: 18px;
            color:#111;
            margin-bottom: 0.15rem;
        }

    }

    .others{
        background: #F2F2F2;
        border-radius: 2px;
        padding: 0.15rem 0.17rem;

        .title{
            text-align: center;
            font-size: 18px;
            color:#111;
        }

        .item{
            margin-top:0.15rem;
            .item-name{
                text-align: center;
                font-size: 16px;
                color:#111;
                margin-bottom:0.1rem;
            }
        }
    }

}
</style>