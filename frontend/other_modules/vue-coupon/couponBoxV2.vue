<template>
    <div class="CouponBox" :class="{disabled:data.valid===0}" @click="tapCoupon">
        <div class="couponBody">
            <div class="main-box">

                <div class="value_box">

                    <div v-if="data.type === 2" class="value_desc">免费
                        <div class="free-time">{{data.free_time_h}}小时</div>
                    </div>

                    <div v-else>
                        <div class="value">{{data.free_money}}</div>
                        <div v-if="data.minimum > 0" class="condition">满 {{data.minimum}} 可用</div>
                    </div>

                </div>

                <div class="desc">
                    <div class="name">{{data.name}}</div>
                    <div class="time">{{data.time_text}}</div>
                    <ul class="conditions">
                        <li v-for="item in data.conditions" :key="item" class="item">{{item}}</li>
                    </ul>
                </div>

                <div class="more" v-if="data.description.length > 0" @click.stop="openMore">
                    <span class="more-icon" :class="{up:is_open}">详细信息</span>
                </div>
            </div>

            <div class="status-name" v-if="!data.valid && data.status_name">{{data.status_name}}</div>
            <div v-if="choose" class="choose"></div>
        </div>

        <div class="descriptionBody" >
            <div class="middle-box" :style="{width:descriptionBoxHeight+'px'}">
                <transition name="slide">
                    <div class="description" v-show="is_open">
                        <div class="item" v-for="item,index in data.description" :key="item">{{index+1}}. {{item}}</div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
  // 此view需要传进的data instanceof Coupon

  export default {
    name: "coupon-box",
    props: ['data', 'choose'],
    data () {
      return {
        is_open: false,
        descriptionBoxHeight:43
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
      this.descriptionBoxHeight = 26+this.data.description.length*17
    }
  }
</script>

<style lang="less">

    .slide-enter-active,.slide-leave-active {
        transition: margin-top 400ms;
    }
    .slide-enter, .slide-leave-to {
        margin-top:-100%;
    }

    .CouponBox {
        margin: 0.15rem;
        color: #111;
        position: relative;
        &.disabled {
            color: #ccc;
            .time,.value,.condition,.conditions,.description,.name{
                color: #ccc !important;
            }

            .couponBody::before{
                background-color: #b1b2b6;
            }
        }

        .couponBody {
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
            border-radius: 2px;
            overflow: hidden;
            z-index: 10;
            position: relative;

            // 左侧黑条，比main-box宽1px是为了main-box的border-radius能展示出弧线
            &::before{
                content:'';
                display: block;
                width: 4px;
                height: 100%;
                top:0;
                background-color: #494b51;
                position: absolute;
                border-radius:2px 0 0 2px;
            }

            .main-box {
                margin-left: 3px;
                border-radius: 2px;
                overflow: hidden;
                background-color: #fff;
                box-sizing: border-box;
                display: flex;
                position: relative;
                .value_box {
                    flex: 0;
                    padding: 0.15rem;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .value {
                        color: #ed3800;
                        min-width: 0.6rem;
                        padding-left: 0.1rem;
                        font-size: 0.44rem;
                        position: relative;
                        &::before {
                            content: ' ¥ ';
                            font-size: 0.18rem;
                            position: absolute;
                            bottom: 15%;
                            margin-left: -0.14rem;
                        }
                    }
                    .value_desc {
                        padding: 0 0.05rem;
                        min-width: 0.6rem;
                        font-size: 0.3rem;
                        word-break: keep-all;
                        .free-time {
                            font-size: 0.2rem;
                            line-height: 0.2rem;
                            margin-top: -0.05rem;
                        }
                    }
                    .condition {
                        color: #555;
                        font-size: 0.11rem;
                        line-height: 1;
                        margin-top: -0.5em;
                    }
                }

                .desc {
                    color: #555;
                    flex: auto;
                    padding: 0.15rem;
                    text-align: left;
                    background: url('./images/coupon_bg.png') no-repeat left top;
                    background-size: 100% auto;

                    .name {
                        font-size: 0.16rem;
                        font-weight: bold;
                        color: #111;
                    }
                    .time {
                        font-size: 0.11rem;
                    }
                    .conditions {
                        padding: 0.1rem 0 0.03rem;
                        height: 0.3rem;
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

        .descriptionBody{
            z-index: 5;
            border-radius: 0 0 2px 2px;
            position: relative;
            overflow: hidden;
            .middle-box{
                overflow: visible;
            }
            .description {
                width: 3.45rem;
                box-sizing: border-box;
                border-radius: 2px;
                background-color: #f9f9f9;
                padding: 13px 18px;
                color: #555;
                .item {
                    font-size: 12px;
                    line-height: 17px;
                }
            }
        }

        .status-name {
            background-color: #999;
            color: #fff;
            position: absolute;
            right: -0.2rem;
            top: 0.1rem;
            width: 0.8rem;
            font-size: 0.11rem;
            text-align: center;
            transform: rotate(45deg);
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
