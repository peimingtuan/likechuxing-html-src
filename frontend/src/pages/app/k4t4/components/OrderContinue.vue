<template>
    <div class="OrderContinue">
        <button class="btn btn-primary btn-block" @click="orderContinue">继续用车</button>
    </div>
</template>

<script>
    import {appMutual} from '../../../../../other_modules/app-mutual'

  export default {
    name: "order-continue",
    methods:{
      orderContinue(){
        appMutual.send.orderCar()
      }
    }
  }
</script>

<style lang=less scoped>
.OrderContinue{
    position: fixed;
    width: 100%;
    height: 0.66rem;
    padding: 0.1rem;
    background-color: #fff;
    box-shadow: 0 0 1px 1px rgba(0,0,0,0.1);
    bottom:0;
    left:0;
    box-sizing: border-box;
    .btn{
        height: 0.46rem;
        font-size: 16px;
    }
}
</style>