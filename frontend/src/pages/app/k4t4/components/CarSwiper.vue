<template>
    <div class="CarSwiper">
        <div class="swiper-container" id="carSwiper">

            <div class="swiper-wrapper">
                <div class="swiper-slide car_card" :key="item.id" v-for="item in cars">
                    <div class="plate_no">
                        {{item.plate_no}}
                        <i class="icon-box detail" @click="showCarInfo"></i>
                        <i class="icon-box limit" v-if="item.is_limit"></i>
                        <i class="icon-box limit-tomorrow" v-else-if="item.is_tomorrow_limit"></i>
                    </div>
                    <div class="desc">续航约<span class="strong">{{item.remain_km}}</span>公里</div>
                    <div class="desc">
                        <span class="strong" style="margin-left: 0">{{item.price_km}}</span>
                        元/公里 +
                        <span class="strong">{{item.price_min}}</span>
                        元/分钟
                    </div>
                    <img :src="item.car_pic" class="img" />
                </div>
            </div>

            <div class="swiper-pagination swiper-pagination-bullets" :class="{hide:cars.length<2}"></div>

        </div>
    </div>
</template>

<script>
  import Swiper from 'swiper/dist/js/swiper.min';
  require('swiper/dist/css/swiper.css');

  let swiper

  export default {
    name: "minor-box",
    props:['cars'],
    methods:{
      showCarInfo(){
        this.$emit('showCarInfo',this.cars[swiper.realIndex])
      }
    },
    components:{
    },
    mounted() {
      swiper = new Swiper('#carSwiper', {
        pagination: {
          el: '.swiper-pagination',
        },
        on: {
          slideChangeTransitionEnd:()=>{
            this.$emit('changeCar',this.cars[swiper.realIndex])
          }
        }
      });

      this.$emit('changeCar',this.cars[0])
    },
    updated() {
      if(swiper){
        swiper.updateSlides()
        if(swiper.realIndex === 0){
          this.$emit('changeCar',this.cars[0])
        }else{
          swiper.slideTo(0, 200, false);
        }
      }
    },
    beforeDestroy() {
      swiper.destroy()
      swiper = null
    }
  }
</script>

<style lang="less">
    .CarSwiper {
        background-color: #fff;
        .car_card {
            height: 1.25rem;
            padding: 0.2rem 0.15rem;
            box-sizing: border-box;
            text-align: left;
            color:#999;
            font-size: 0.14rem;
            .plate_no{
                color:#111;
                font-size: 0.16rem;
                margin-bottom: 0.1rem;
                line-height: 0.2rem;
                .icon-box{
                    display: inline-block;
                    vertical-align: top;
                    width: 0.5rem;
                    height: 0.2rem;
                    background: no-repeat center;
                    background-size: 100%;
                    &.detail{
                        background-image: url(../images/carBox/车辆详情.png);
                    }
                    &.limit{
                        background-image: url(../images/carBox/今日限行.png);
                    }
                    &.limit-tomorrow{
                        background-image: url(../images/carBox/明日限行.png);
                    }
                }
            }
            .strong{
                margin:0 0.3em;
                color:#111;
            }
            .img{
                width: 1.2rem;
                height: 0.6rem;
                position: absolute;
                top:0.28rem;
                right:0.13rem;
                display: block;
            }
        }
        .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
            margin: 0 3px;
        }
        .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
            background: #111;
            opacity: 0.1;
            border-radius: 3px;
        }
        .swiper-pagination-bullet-active {
            width: 12px;
            background: #494B51;
            opacity: 1;
        }

    }
</style>
