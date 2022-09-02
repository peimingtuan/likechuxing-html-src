<template>
    <div class="detail-footer">
        <PeccancyTips />

        <div class="footer">
            <div class="slide_btn" @click="toggleSlide"></div>

            <div class="car_detail" v-if="slide_out">
                <p class="chepai">{{plate_no}}</p>
                <p class="chekuan">{{data.car_type}}</p>
                <div class="car_img" :style="'background-image:url('+data.car_img+')'"></div>
            </div>

            <p class="order_time">
                <span>{{order_time}}</span>
                <span class="order_cost" v-if="slide_out"><span class="cost_num">{{order_cost}} </span> 元</span>
            </p>
            <div class="point_con" ref="box">
                <p class="item" ref="context"><span class="icon icon_get_car">取：</span><span
                        id="start_point_name">{{start_branch_name}}</span></p>
                <p class="item"><span class="icon icon_return_car">还：</span><span id="end_point_name">{{end_branch_name}}</span></p>
            </div>

            <div class="btn_con" v-if="slide_out">
                <div class="count count3" v-if="[3,5].includes(btn_num)">
                    <!--<div class="btn_box btn-animate shadow zoom" @click="toComment" v-if="data.comment.can_comment">服务评价</div>-->
                    <div class="btn_box btn-animate shadow zoom" @click="toDetail">费用明细</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toAccident" v-if="data.has_accident">事故图片</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toCarPhoto" v-if="data.has_car_photo">验车单</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toRefuel" v-if="data.has_car_refuel">加油返款记录</div>
                    <div class="btn_box" style="opacity:0.5" v-if="btn_num===5">占位</div>
                </div>
                <div class="count" v-else>
                    <!--<div class="btn_box btn-animate shadow zoom" @click="toComment" v-if="data.comment.can_comment">服务评价</div>-->
                    <div class="btn_box btn-animate shadow zoom" @click="toDetail">费用明细</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toAccident" v-if="data.has_accident">事故图片</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toCarPhoto" v-if="data.has_car_photo">验车单</div>
                    <div class="btn_box btn-animate shadow zoom" @click="toRefuel" v-if="data.has_car_refuel">加油返款记录</div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
  import format from '../../../../../other_modules/like-function/format'
  import appArguments from '../../../../../other_modules/app-arguments/index'
  import {appMutual} from '../../../../../other_modules/app-mutual'

  import PeccancyTips from './PeccancyTips.vue'

  //require('../../../../../other_modules/css-animate/animate.less')
  require('../../../../../other_modules/css-animate/animate-btn.less')

  export default {
    name: "detail-footer",
    props: ['data'],
    data() {
      return {
        slide_out: true,
        max_words: 10
      }
    },
    components:{
      PeccancyTips
    },
    computed: {
      plate_no() {
        return format.chepai(this.data.plate)
      },
      order_time() {
        return format.time(this.data.rental_time, 0)
      },
      order_cost() {
        return format.money(this.data.fee)
      },

      start_branch_name() {
        return this.data.start_point.length < this.max_words ? this.data.start_point : this.data.start_point.substr(0, this.max_words) + '...'
      },
      end_branch_name() {
        return this.data.end_point.length < this.max_words ? this.data.end_point : this.data.end_point.substr(0, this.max_words) + '...'
      },

      btn_num(){
        let num = 1
        if(this.data.comment.can_comment)num++;
        if(this.data.has_accident)num++;
        if(this.data.has_car_photo)num++;
        if(this.data.has_car_refuel)num++;
        return num
      }
    },
    methods: {

      toggleSlide() {
        this.slide_out = !this.slide_out
      },
      setMaxWords() {
        let con_w = this.$refs.box.offsetWidth;
        let p_w = this.$refs.context.offsetWidth;
        let word_w = (con_w - p_w) / 2;
        this.max_words = Math.floor(p_w / word_w) - 1;
      },
      toComment() {
        if (this.data.comment.can_comment) {
          this.$emit('showComment')
        }
      },
      toDetail() {
        this.$router.push('/detail')
        // window.location.href = 'rentalDetail.html?footerColor=f7f7f7&uuid=' + appArguments.uuid + '&sign=' + appArguments.sign + '&rental_no=' + appArguments.rental_no
      },
      toAccident() {
        appMutual.jump.accidentPhoto(this.data.rental_id)
      },
      toCarPhoto() {
        this.$router.push({
          path:'/photos',
          query:{
            rental_id:this.data.rental_id
          }
        })

        //window.location.href = '/app/checkDamageShow/index.html?uuid=' + appArguments.uuid + '&sign=' + appArguments.sign + '&rental_id=' + this.data.rental_id + '&user_channel=h5'
      },
      toRefuel(){
        if(appArguments.app_version>=2109){
          appMutual.jump.refuelDetail({
            destroy_current:0,
            rental_no:this.data.rental_no
          })
        }else{
          this.$_LIKE_toast('请升级APP至最新版本查看')
        }

      }
    },
    mounted() {
      this.setMaxWords()
    }
  }
</script>

<style lang="less">

    .detail-footer {
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        bottom: 0;
        z-index: 10;
        background:url('../images/bg.png') repeat-x center;
        background-size: auto 100%;

        .footer{
            margin:0.05rem 0.1rem 0;
            padding: 0 0.25rem;
            background-color: #FFF;
            border-radius: 2px;

            .slide_btn {
                padding: 0.1rem 0;
                &::before {
                    content: '';
                    display: block;
                    margin: 0 auto;
                    width: 0.36rem;
                    height: 4px;
                    border-radius: 2px;
                    background-color: #E3E3E3;
                }
            }

            .car_detail {
                position: relative;
                padding: 0.1rem 0;
                border-bottom: solid 1px #f2f2f2;
                .chepai {
                    font-size: 20px;
                    line-height: 1;
                    color: #111;
                }
                .chekuan {
                    font-size: 13px;
                    line-height: 0.2rem;
                    color: #999;
                    padding: 0.05rem 0;
                }
                .car_img {
                    position: absolute;
                    height: 100%;
                    width: 50%;
                    right: 0;
                    top: 0;
                    background: no-repeat center right;
                    background-size: auto 75%;
                }
            }

            .order_time {
                margin: 0.15rem 0;
                line-height: 1;
                color: #999;
                font-size: 13px;
                position: relative;
                .order_cost {
                    position: absolute;
                    right: 0;
                    color: #000;
                    font-size: 12px;
                    .cost_num {
                        font-size: 20px;
                        color: #ED3800;
                    }
                }
            }

            .point_con {
                color: #111;
                font-size: 14px;
                padding-bottom: 3%;
                .item {
                    padding: 0.05rem 0;
                    position: relative;
                    line-height: 1.5;
                    height: 1.5em;
                    margin-left: 2em;
                }
                .icon {
                    display: inline-block;
                    position: absolute;
                    color: #999;
                    left: -2em;
                    height: 1.5em;
                    width: 1em;
                    background: no-repeat center;
                    background-size: 100% auto;
                }
            }

            .btn_con {
                position: relative;
                padding: 0.1rem 0;
                border-top: solid 1px #f2f2f2;
                box-sizing: border-box;

                .count{
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;

                    &.count3{
                        .btn_box{
                            flex:1;
                            width: 1.3rem;
                            min-width: 0.88rem
                        }
                    }
                    .btn_box{
                        //flex:0;
                        margin:0.03rem 0.06rem;
                        box-sizing: border-box;
                        max-width: 1.4rem;
                        width: 1.3rem;
                        min-width: 1rem;
                        height: 0.35rem;
                        line-height: 0.35rem;
                        border:solid 1px #E3E3E3;
                        font-size: 12px;
                        text-align: center;
                        border-radius: 2px;
                    }
                }
            }
        }

    }
</style>