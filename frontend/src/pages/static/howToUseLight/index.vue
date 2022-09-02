<template>
   <div>
        <div class="content">
            <div class="header">
                <div class="title">车灯操作指南</div>
                <div>为了您的驾驶安全，夜间行驶请注意打开车灯</div>
            </div>
            <div class="step-box">
                <div class="title">
                    <span class="text">1. <span>旋转式</span>车灯开关</span>
                </div>
                <img src="./images/01.png" alt="">
                <div class="detail">
                    <div class="item1">方向盘左侧有控制灯光的旋钮，顺时针转到头，打开近光灯；</div>
                    <div class="item2">雾天可在开启示宽灯后，按钮开启旋转左边的雾灯。</div>
                </div>
            </div>
            <div class="step-box">
                <div class="title">
                    <span class="text">2. <span>拨杆式</span>车灯开关</span>
                </div>
                <img src="./images/02.png" alt="">
                <div class="detail">
                    <div class="item1">顺时针转动拨杆头部的旋钮转到头，打开近光灯；</div>
                    <div class="item2">雾天可在开启示宽灯后，转动拨杆中部的旋转打开雾灯。</div>
                </div>
            </div>
        </div>
        <div class="foot"></div>
   </div>
</template>

<style lang=less scoped>
    @import '../css/reset.css';
    @lineheight:24px;

    .content{
    font-size: 14px;
    color:#777;
    padding: 0 0.2rem 0.23rem;
    line-height: @lineheight;

    .header{
        padding-top: 0.2rem;
        font-size: 14px;
        color: #111;
        line-height: 1;
        .title{
            font-size: 23px;
            font-weight: 500;
            color: #000;
            padding-bottom: .12rem;
        }
    }
    .step-box{
        line-height: 1;
        .title{
            padding-top: .2rem;
            font-size: 18px;
            color:#111;
            position: relative;
            .text{
                font-weight: 500;
                span{
                    padding-bottom: .05rem;
                    border-bottom: 4px solid #FF6535;
                    /* border-radius: 1px; */
                }
            }
        }
        img{
            height: 1.8rem;
            width: 100%;
            padding-top: .3rem;
        }
        .detail{
        padding-top: .18rem;
        .item1,.item2{
            padding-bottom: .12rem;
            padding-left: 15px;
            line-height: 20px;
            &::before{
                content: 'a. ';
                margin-left: -15px;
            }
        }
        .item2{
            &::before{
                content: 'b. '
            }
        }
    }
    }
    }
    .foot{
       width: .83rem;
       height: .12rem;
       background: url('./images/logo.png') no-repeat;
       background-size: 100%;
       margin: 0 auto .17rem;
    }
</style>