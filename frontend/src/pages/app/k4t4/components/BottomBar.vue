<template>
    <div class="BottomBar shadow">
        <!--底部提示+按钮栏-->
        <div class="box" v-if="type===0">请在地图上选择取车网点</div>
        <div class="box" v-else-if="type===1">当前网点暂无可用车辆</div>
        <div class="box" v-else>
            <button class="btn btn-primary btn-block" :class="{disabled:btnDisabled}" @click="orderCar">立刻用车</button>
        </div>
    </div>
</template>

<script>

  export default {
    name: "bottom-bar",
    props: ['type','btnDisabled'],
    methods: {
      orderCar () {
        if(!this.btnDisabled){
          this.$emit('btnClick')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .BottomBar {
        text-align: center;
        margin-top: 0.06rem;
        position: relative;
        z-index: 2;
        width: 100%;
        background-color: #fff;
        .box {
            height: 0.46rem;
            line-height: 0.46rem;
            font-size: 0.16rem;
            .btn-block {
                height: 100%;
                font-size: 0.16rem;
            }
        }
    }
</style>
