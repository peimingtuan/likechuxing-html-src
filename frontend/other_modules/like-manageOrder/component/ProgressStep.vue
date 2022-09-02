<template>
    <div class="ProgressStep">
        <div v-for="(item,index) in steps" :key="item.id" class="step-item">

            <div class="icon finish" v-if="item.finish"></div>
            <div class="icon" v-else>{{index+1}}</div>

            <div class="step-name">{{item.name}}</div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ProgressStep",
    props:['steps']
  }
</script>

<style lang=less scoped>
.ProgressStep{
    display: flex;
    justify-content: space-between;
    position: relative;
    &::before{
        content:'';
        position: absolute;
        width: 100%;
        height: 2px;
        background-color: #e5e5e5;
        top:0.2rem;
        z-index: 1;
    }

    .step-item{
        position: relative;
        z-index: 2;
        text-align: center;
        font-size: 12px;
        background-color: #fff;

        .icon{
            color:#666;
            background-color: #ededed;
            border-radius: 0.13rem;
            margin:0.08rem auto;
            width: 0.26rem;
            height: 0.26rem;
            line-height: 0.26rem;

            &.finish{
                background:url('../images/ProgressStep/finish.png') no-repeat center;
                background-size: 100%;
            }
        }
        .step-name{
            color:#333;
        }
    }
}
</style>