<template>
   <div>
       <header>
            <!--头图-->
        </header>
        <div class="content">
            <div class="detail">
                <div class="title">声明</div>
                <div class="item1">违章处理前，请认真阅读该指南，便于您了解违章处理流程；</div>
                <div class="item2">违章处理过程中，请仔细核对违章信息，如因个人原因造成违章处理错误，将由本人承担后果。</div>
            </div>
            <div class="step-box">
                <div class="title">
                    <span class="index">01</span>
                    <span class="text"><span>无扣分</span>违章处理</span>
                </div>
                <div class="title1">委托处理</div>
                <div class="detail">
                    点击<span class="strong">申请代缴，缴纳费用</span>，缴费成功后表明成功申请代缴，我们将接受委托代您处理
                </div>
                <img class="step" src="./images/01.png" />
                <div v-if="cityId===169">
                    <div class="title1">支付宝处理</div>
                    <div class="detail">
                        在<span class="strong">“支付宝”</span>首页输入<span class="strong">违章查询处理</span>，通过违章查询处理小程序处理违章
                    </div>
                    <img class="step" src="./images/07.png" />
                </div>
                <div class="title1">自行处理</div>
                <div class="detail">
                    按照下面扣分违章处理流程处理即可
                </div>
            </div>
            <div class="step-box" v-if="cityId !=169 && cityId !=183 && cityId !=235">
                <div class="title">
                    <span class="index">02</span>
                    <span class="text"><span class="line">扣分</span>违章处理</span>
                </div>
                <div class="title2_1">缴纳违章保证金 提前用车</div>
                <div class="detail">
                    点击提前用车，缴纳违章保证金，可以提前使用车辆
                </div>
                <img class="step" src="./images/02.png" />
                <div class="title2_2">预约行驶证</div>
                <div class="detail">
                    缴纳<span class="strong">300</span>元行驶证保证金预约行驶证
                </div>
                <img class="step" src="./images/03.png" />
                <div class="detail">
                    如果行驶证<span class="strong">已借出</span>，请选择有证提醒
                </div>
                <img class="step" src="./images/04.png" />
                <div class="title2_3">取行驶证</div>
                <div class="detail">
                    预约成功后请在<span class="strong">24小时内</span>到指定地址领取，如有疑问请联系违章专员
                </div>
                <img class="step" src="./images/05.png" />
                <div class="title2_4">处理违章  上传凭证</div>
                <div class="detail">
                    携带本人<span class="strong">身份证、行驶证、驾驶证</span>等材料 ( 图1 )，到当地交警大队处理违章 ( 图2 )，并去指定银行缴纳罚款 ( 图3 )，缴费完成后请上传凭证 ( 图4 )
                </div>
                <img class="step" src="./images/06.png" />
                <div class="title2_5">归还行驶证</div>
                <div class="detail">
                   违章处理完成后，请及时归还行驶证，行驶证保证金将在<span class="strong">1-3个工作日返还</span>至缴费账户
                </div>
                <div class="title2_6">等待系统审核  退还违章保证金</div>
                <div class="detail">
                   上传完凭证和归还完行驶证后将进入违章处理结果审核阶段，15个工作日后完成审核，<span class="strong">审核通过后，违章保证金将自动返还至缴费账户</span>
                </div>
            </div>
            <div class="step-box" v-if="cityId ===169 || cityId===183|| cityId===235">
                <div class="title">
                    <span class="index">02</span>
                    <span class="text"><span class="line">扣分</span>违章处理</span>
                </div>
                <div class="title2_1">缴纳违章保证金 提前用车</div>
                <div class="detail">
                    点击提前用车，缴纳违章保证金，可以提前使用车辆
                </div>
                <img class="step" src="./images/02.png" />
                <div class="title2_2">处理违章  上传凭证</div>
                <div class="detail">
                    携带本人<span class="strong" v-if="cityId !=169 && cityId !=183 && cityId !=235">身份证、行驶证、驾驶证</span>
                            <span class="strong" v-if='cityId===169'>身份证、驾驶证、行驶证复印件</span>
                            <span class="strong" v-if='cityId===183 || cityId===235'>身份证、驾驶证</span>
                    等材料 ( 图1 )，
                    <span v-if='cityId===183'>查看立刻出行APP提供的<span  class="strong">发动机号和车架号，</span></span>
                    到当地交警大队处理违章 ( 图2 )，并去指定银行缴纳罚款 ( 图3 )，缴费完成后请上传凭证 ( 图4 )
                </div>
                <img v-if="cityId ===183 || cityId ===235" class="step" src="./images/08.png" />
                <img v-else class="step" src="./images/06.png" />
                <div class="title2_3">等待系统审核  退还违章保证金</div>
                <div class="detail">
                   <span v-if="cityId !=169 && cityId !=183 && cityId !=235">上传完凭证和归还完行驶证后将进入违章处理结果审核阶段，</span>
                   <span v-if='cityId===169 || cityId ===183 || cityId ===235'>上传完凭证后将进入违章处理结果审核阶段，</span>
                   15个工作日后完成审核，<span class="strong">审核通过后，违章保证金将自动返还至缴费账户</span>
                </div>
            </div>
        </div>
        <div class="foot">如有疑问请联系违章专员</div>
   </div>
</template>

<script>
  import appArguments from '../../../../other_modules/app-arguments'
  export default {
    name: "indexPage",
    data() {
        return {
            cityId: 0      // 169 ：武汉  183：长沙  235：成都   
        }
    },
    created() {
        this.cityId =Number(appArguments.cityId) || Number(appArguments.city_id) || 0;
    }
  }
</script>

<style lang=less scoped>
    @import '../css/reset.css';
    @lineheight:24px;

    header{
    height: 1.2rem;
    background: #f2f2f2 url('./images/header.png') no-repeat center;
    background-size: 100%;
    }

    .content{
    font-size: 14px;
    color:#777;
    padding: 0 0.2rem 0.4rem;
    line-height: @lineheight;

    >.detail{
        padding: 0.2rem 0;
        .title{
        font-size: 14px;
        font-weight: 500;
        color: #888;
        }
        .item1,.item2{
            padding-left: 15px;
            &::before{
                content: '1. ';
                margin-left: -15px;
            }
        }
        .item2{
            &::before{
                content: '2. '
            }
        }
    }
    .step-box{
        padding: 0.1rem 0;
        .title{
            margin: 0.1rem 0 .05rem;
            font-size: 18px;
            color:#111;
            position: relative;
            .index{
                font-weight: 500;
                position: absolute;
                font-size: 40px;
                color: #FFCEBF;
                z-index: -1;
                bottom: 10px;
                opacity: .8;
            }
            .text{
                font-weight: 500;
                span{
                    padding-bottom: .05rem;
                    border-bottom: 4px solid #FF6535;
                    /* border-radius: 1px; */
                }
            }
        }
        .title1{
            position: relative;
            font-size: 16px;
            color: #111;
            padding-left: .16rem; 
            padding-top: .15rem;
            line-height: 16px;
            &::before{
                content: "";
                background: #FF6535;
                position: absolute;
                left: 0;
                top: 18px;
                width: 8px;
                height: 8px;
                border-radius: 2px;
            }
        }
        .title2_1{.public(1)}
        .title2_2{.public(2)}
        .title2_3{.public(3)}
        .title2_4{.public(4)}
        .title2_5{.public(5)}
        .title2_6{.public(6)}

        .detail{
            margin:0.1rem 0;
            .strong{
                color:#111;
            }
        }
        img{
            padding-bottom: .2rem;
        }
    }

        .step{
            width: 100%;
        }
    }
    .public(@bgcolor){
        position: relative;
        font-size: 16px;
        color: #111;
        padding-left: .26rem; 
        padding-top: .15rem;
        line-height: 16px;
        &::before{
            content: "@{bgcolor}";
            background: #FF6535;
            position: absolute;
            left: 0;
            top: 13px;
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            padding-top: 1px;
            box-sizing: border-box;
            border-radius: 2px;
            color: #FFF;
        }
    }
    .foot{
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #999999;
        padding-bottom: .15rem;
    }
</style>