<template>
  <div class="MinorBox shadow">
    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">
    <CarSwiper v-if="step === 0 && car_list.length>0"/>
    <div class="CarDetail" v-else-if="[1,2].includes(step)">
      <div class="car_card">
        <div class="plate_no">
          {{rental.car.plate_no}}
          <i class="icon-box detail" @click="show_carInfo"></i>
          <i class="icon-box limit" v-if="rental.car.is_limit"></i>
          <i class="icon-box limit-tomorrow" v-else-if="rental.car.is_tomorrow_limit"></i>
        </div>
        <div class="desc">
          {{rental.car.brand_name +' '+ rental.car.model_name}}<span> | </span>
          {{rental.car.seat_cnt}}<span> | </span>
          {{rental.car.power_type}}
        </div>
        <CountDownBox v-if="step===1"/>
        <div class="desc" v-else>{{rental.begin_time}} 开始计费<span class="warn"> {{rental.total_money}} </span>元</div>
        <img :src="rental.car.car_pic" class="img" />
      </div>
    </div>
    <div class="CarDetail" v-else-if="step===3">
      <div class="car_card">
        <div class="plate_no">
          预估费用:{{rental.total_money}}元
          <i class="icon-box detail" @click="show_carInfo"></i>
        </div>
        <div>
          已用时<span class="strong">{{total_time_during}}</span>
        </div>
        <div>
          已行驶<span class="strong">{{rental.total_km}}公里</span>
        </div>
        <img :src="rental.car.car_pic" class="img" />
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
  import CarSwiper from './CarSwiper'
  import {mapState,mapGetters} from 'vuex'
  import CountDownBox from './countDownBox'

  export default {
    name: "minor-box",
    computed:{
      ...mapState('branch', [
        'car_list',
      ]),
      ...mapState('rental',[
        'step',
        'rental'
      ]),
      ...mapGetters('rental',[
        'total_time_during'
      ])
    },
    methods:{
      show_carInfo(){
        this.$store.dispatch('Widget/toggle','carInfo')
      }
    },
    components:{
      CarSwiper,
      CountDownBox
    }
  }
</script>

<style lang="less" scoped>
  .MinorBox{
    text-align: center;

    margin-top: 0.06rem;
    position: relative;
    overflow: hidden;
    background-color: #fff;
    .car_card {
      height: 1rem;
      padding: 0.2rem 0.15rem;
      box-sizing: border-box;
      text-align: left;
      color:#999;
      font-size: 0.14rem;
      .plate_no{
        color:#111;
        font-size: 0.16rem;
        line-height: 0.2rem;
        margin-bottom:0.05rem;
        .icon-box{
          display: inline-block;
          vertical-align: top;
          width: 0.5rem;
          height: 0.2rem;
          background: no-repeat center;
          background-size: 100%;
          &.detail{
            background-image: url(../../assets/images/carBox/车辆详情.png);
          }
          &.limit{
            background-image: url(../../assets/images/carBox/今日限行.png);
          }
          &.limit-tomorrow{
            background-image: url(../../assets/images/carBox/明日限行.png);
          }
        }
      }
      .desc{
        margin-top: 0.05rem;
      }
      .strong{
        margin:0 0.3em;
        color:#111;
      }
      .img{
        width: 1.2rem;
        height: 0.6rem;
        position: absolute;
        top:0.19rem;
        right:0.13rem;
        display: block;
      }
    }
  }
</style>
