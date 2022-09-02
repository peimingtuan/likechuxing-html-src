<template>
    <div class="CouponBox" :class="{disabled:data.valid===0}" @click="tapCoupon">
        <div class="couponBody" :class="{cash:data.type>100}">
            <div class="main-box">

                <div class="desc">
                    <div class="name">
                        {{data.name}}
                        <span class="new" v-if="data.valid && is_new"></span>
                    </div>
                    <div class="limit" >{{data.limitDes}}</div>
                    <div class="time">{{data.time_text}}</div>
                </div>

                <div class="value_box">

                    <!--免费券-->
                    <div v-if="data.type === 2" class="value_desc">
                        <div class="time">
                            {{data.free_time_h}}<span>小时</span>
                        </div>
                        <div class="condition">免费用车</div>
                    </div>

                    <!--满减券-->
                    <div v-else>
                        <div class="value"><span class="money-flag">¥</span>{{data.free_money}}</div>
                        <div v-if="data.minimum > 0" class="condition">满{{data.minimum}}可用</div>
                    </div>

                </div>

            </div>

            <div class="circle-box">
                <div class="circle up" :style="'background-color:'+backgroundColor"></div>
                <div class="circle down" :style="'background-color:'+backgroundColor"></div>
            </div>

            <div class="status-name" v-if="!data.valid && data.status_name">{{data.status_name}}</div>
            <div v-if="choose" class="choose">
            </div>
        </div>
    </div>
</template>

<script>
  // 此view需要传进的data instanceof Coupon

  export default {
    name: "coupon-box",
    props: ['data', 'choose', 'bgColor'],
    data () {
      return {
        is_open: false,
        backgroundColor:'#fff'
      }
    },
    computed:{
      is_new(){
        let now = Math.floor(new Date().getTime()/1000)
        return (now - this.data.time_start) < 86400
      }
    },
    methods: {
      openMore () {
        this.is_open = !this.is_open
      },
      tapCoupon () {
        if (this.data.valid === 1) {
          this.$emit('tapCoupon', this.data)
        }
      }
    },
    mounted(){
      if(this.bgColor){
        this.backgroundColor = this.bgColor
      }
    }
  }
</script>

<style lang="less" scoped>
    .slide-enter-active,.slide-leave-active {
        transition: margin-top 400ms;
    }
    .slide-enter, .slide-leave-to {
        margin-top:-100%;
    }

    .CouponBox {
        margin: .1rem .15rem;
        color: #111;
        position: relative;
        border-left: none;
        &.disabled {
            color: #ccc;
            .time,.value,.condition,.conditions,.description,.name,.limit,.value_desc{
                color: #ccc !important;
            }
            .couponBody::before{
                background-color:#B0B2B5 !important;
            }
        }

        .couponBody {
            box-shadow: 0 0 0;
            border-radius: 2px;
            overflow: hidden;
            z-index: 10;
            position: relative;
            &:before{
                content: '';
                width: 4px;
                background-color: #494B51;
                height: 100%;
                position: absolute;
                top:0;
                left:0;
                z-index: 10;
                border-radius: 2px 0 0 2px;
            }
            &.cash::before{
                background-color: #ed3800;
            }
            .main-box {
                margin-left: 0;
                border-radius: 2px;
                overflow: hidden;
                box-sizing: border-box;
                border:1px solid #dfdfdf;
                display: flex;
                position: relative;
                background-color: #fff;
                background-size: 100% 1.02rem;

                .value_box {
                    width: 1.02rem;
                    box-sizing: border-box;
                    padding: 0.15rem 0.18rem;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .value {
                        color: #ed3800;
                        min-width: 0.6rem;
                        font-size: 36px;
                        position: relative;
                        font-family: PingFangSC-Medium;
                        .money-flag {
                            font-size: 18px;
                        }
                    }
                    .value_desc {
                        color: #ed3800;
                        min-width: 0.6rem;
                        font-size: 36px;
                        position: relative;
                        margin-top: -0.1rem;
                        .time{
                            font-family: PingFangSC-Medium;
                            span{
                                font-size: 14px;
                            }

                        }


                    }
                    .condition {
                        color: #555;
                        font-size: 13px;
                        line-height: 1;
                        margin-top: -.04rem;
                    }
                }

                .desc {
                    color: #555;
                    flex: auto;
                    padding: 0.2rem 0 0.12rem 0.22rem;
                    text-align: left;
                    border-right:1px dashed #dfdfdf;
                    .name {
                        font-size: 20px;
                        line-height: 0.2rem;
                        font-weight: normal;
                        color: #111;

                        .new{
                            display: inline-block;
                            width: 0.252rem;
                            height: 0.2rem;
                            vertical-align: top;
                            background: url('./images/new.png') no-repeat center 10%;
                            background-size: 100% auto;
                        }
                    }
                    .time {
                        padding-top: 0.18rem;
                        font-size: 12px;
                    }
                    .limit{
                        padding-top: .08rem;
                        font-size: 13px;
                        line-height: 13px;
                        color: #555;
                    }
                    .conditions {
                        padding: 0.1rem 0 0.03rem;
                        box-sizing: content-box;
                        .item {
                            line-height: 0.15rem;
                            font-size: 0.11rem;
                            word-break: break-all;
                        }
                    }
                }
                .more {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    color: #999;
                    padding: 0.03rem 0.25rem 0.03rem 0.1rem;
                    .more-icon {
                        font-size: 0.11rem;
                        &::after {
                            content: '';
                            position: absolute;
                            top: 50%;
                            right: 0.1rem;
                            margin-top: -3px;
                            display: block;
                            width: 0;
                            height: 0;
                            border-left: solid 6px transparent;
                            border-right: solid 6px transparent;
                            border-top: solid 6px #c0c0c0;
                            border-bottom: none;
                            transition: transform 400ms;
                        }
                        &.up::after {
                            transform: rotate(180deg);
                        }
                    }
                }
            }
        }

        .circle-box{
            position: absolute;
            top:0;
            right:1.02rem;
            height: 100%;
            .circle{
                position: absolute;
                box-sizing: border-box;
                width: 10px;
                height: 10px;
                border-radius: 5px;
                left:-6px;
                border:solid 1px #dfdfdf;
                &.up{
                    top:-5px;
                }
                &.down{
                    bottom:-5px;
                }
            }
        }

        .status-name {
            background-color: #999;
            color: #fff;
            position: absolute;
            right: -0.31rem;
            top: 0.1rem;
            width: 1rem;
            font-size: 12px;
            text-align: center;
            transform: rotate(45deg) scale(0.9);
        }

        .choose {
            width: 0.7rem;
            height: 0.5rem;
            position: absolute;
            background-color: #111;
            right: -0.35rem;
            top: -0.25rem;
            transform: rotate(45deg);
            &:before {
                content: '';
                position: absolute;
                left: 0.3rem;
                bottom: 0.05rem;
                width: 0.06rem;
                height: 0.12rem;
                border-bottom: solid 1px #fff;
                border-right: solid 1px #fff;
            }

        }
    }
</style>
