<template>
    <div class="detail-footer">
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
            <p ref="context"><span class="text-icon icon_get_car">取：</span><span
                    id="start_point_name">{{start_branch_name}}</span></p>
            <p><span class="text-icon icon_return_car">还：</span><span id="end_point_name">{{end_branch_name}}</span></p>
        </div>

        <div class="btn_con" v-if="slide_out">
            <button class="btn white" @click="toComment" v-if="data.comment.can_comment">服务评价</button>
            <button class="btn white" @click="toDetail">费用明细</button>
            <button class="btn white" @click="toCarPhoto" v-if="data.has_car_photo">验车单</button>
        </div>
    </div>
</template>

<script>
  import format from '../../common/Format';
  import {mapState} from 'vuex'
  import PAGE from '../../common/pageAddress'

  export default {
    name: "detail-footer",
    props: ['data'],
    data() {
      return {
        slide_out: true,
        max_words: 10
      }
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
      ...mapState('user',[
        'uuid',
        'sign'
      ])
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
      toComment(){
        if(this.data.comment.can_comment){
          this.$emit('showComment')
        }
      },
      toDetail(){
        this.$router.push({
          path:'/rental/detail',
          query:{
            rental_no:this.data.rental_no
          }
        })
      },
      toCarPhoto(){
        SDK.openWindow(PAGE.damageShow.href+'?uuid=' + this.uuid + '&sign=' + this.sign + '&rental_id=' + this.data.rental_id + '&user_channel=h5')
      }
    },
    mounted() {
      this.setMaxWords()
    }
  }
</script>

<style lang="less">

    @keyframes shorterDown {
        from {
            transform: scaleY(100%);
            visibility: visible;
        }

        to {
            transform: scaleY(0);
        }
    }

    .shorter {
        animation-name: shorterDown;
    }

    .detail-footer {
        position: fixed;
        width: 100%;
        padding: 0 0.25rem;
        box-sizing: border-box;
        bottom: 0;
        z-index: 180;
        background-color: #FFF;
        transition: all 600ms;
        max-height: 400px;
        .slide_btn {
            padding: 0.1rem 0;
            &::before {
                content: '';
                display: block;
                margin: 0 auto;
                width: 10%;
                height: 4px;
                border-radius: 2px;
                background-color: #E3E3E3;
            }
        }
        .car_detail {
            position: relative;
            padding: 3% 0;
            border-bottom: solid 1px #DFDFDF;
            .chepai {
                font-size: 0.19rem;
                color: #111;
            }
            .chekuan {
                font-size: 0.13rem;
                color: #999;
            }
            .car_img {
                position: absolute;
                height: 100%;
                width: 50%;
                right: 0;
                top: 0;
                background: url('../../assets/images/rentalDetail/car_img_default.png') no-repeat center right;
                background-size: auto 75%;
            }
        }
        .order_time {
            margin: 2.6% 0;
            color: #999;
            font-size: 0.13rem;
            position: relative;
            .order_cost {
                position: absolute;
                right: 0;
                color: #000;
                font-size: 0.12rem;
                .cost_num {
                    font-size: 0.2rem;
                    color: #ED3800;
                }
            }
        }
        .point_con {
            color: #111;
            font-size: 0.14rem;
            padding-bottom: 3%;
            p {
                position: relative;
                line-height: 1.5em;
                height: 1.5em;
                margin-left: 2em;
            }
            .text-icon {
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
            padding: 3% 0;
            border-top: solid 1px #DFDFDF;
            box-sizing: border-box;
            overflow: hidden;
            zoom: 1;
            text-align: center;
            &::before {
                content: '';
                position: absolute;
                width: 1px;
                height: 50%;
                left: 50%;
                z-index: -1;
                top: 25%;
                background-color: #e3e3e3;
            }
            button {
                box-sizing: border-box;
                width: 36%;
                margin: 5px 3%;
                height: 2.8em;
                background-color: #FFF;
                border: solid 1px #e3e3e3;
                color: #111;
                font-size: 0.13rem;
                border-radius: 2px;
                float: left;
                &:nth-of-type(even) {
                    float: right;
                }
                &.no_float {
                    float: none;
                }
            }
        }

        &.fold {
            max-height: 130px;
            .car_detail {
                display: none;
            }
            .order_time {
                .order_cost {
                    display: none;
                }
            }
            .btn_con {
                display: none;
            }
        }
    }
</style>
