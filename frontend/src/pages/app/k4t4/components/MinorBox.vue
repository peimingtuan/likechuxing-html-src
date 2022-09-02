<template>
  <div class="MinorBox shadow">

    <transition
      name="custom-classes-transition"
      enter-active-class="animated faster slideInUp"
      leave-active-class="animated faster slideOutDown">

      <CarSwiper v-if="cars.length>0" :cars="cars" @changeCar="changeCar" @showCarInfo="showCarInfo"/>

    </transition>

    <CarInfo v-if="show_car" :car="show_car" @closeCarInfo="()=>{this.show_car=null}" />
  </div>
</template>

<script>
  import CarSwiper from './CarSwiper'
  import CarInfo from './CarInfo'

  export default {
    name: "minor-box",
    props:['cars'],
    data(){
      return {
        show_car:null
      }
    },
    components:{
      CarSwiper,
      CarInfo
    },
    methods:{
      changeCar(car){
        this.$emit('changeCar', car)
      },
      showCarInfo(car){
        this.show_car = car
      }
    }
  }
</script>

<style lang="less" scoped>
  .MinorBox{
    text-align: center;

    margin-top: 0.06rem;
    position: relative;
    overflow: hidden;
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
