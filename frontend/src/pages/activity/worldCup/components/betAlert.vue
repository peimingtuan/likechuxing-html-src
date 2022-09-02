<template>
    <div class="BetInApp" @touchmove="stop">
        <div class="mask"></div>
        <div class="box">
            <div class="close" @click="close"></div>
            <div class="text">
                <p  v-for="line in msg" :key="line">
                    <span class="msg">{{line}}</span>
                </p>

            </div>
            <div class="icon football"></div>
        </div>

    </div>
</template>

<script>


  export default {
    name: "bet-in-app",
    props:['msg'],
    methods:{
      close(){
        this.$emit('close')
      },
      stop(e){
        e.stopPropagation()
        e.preventDefault()
      }
    }
  }
</script>

<style lang=less>
    .BetInApp {
        position: fixed;
        width: 100%;
        height: 100%;
        top:0;
        .mask{
            width: 100%;
            height: 100%;
        }
        .box{
            position: absolute;
            top: 1.1rem;
            left: 50%;
            margin-left: -1.35rem;
            width: 2.7rem;
            background-color: #082d60;
            border-radius: 10px;
            padding: 0.5rem 0.2rem;
            box-sizing: border-box;
            text-align: center;
            color: #fff;
            font-size: 14px;
            .text{
                margin:0.1rem 0;
                text-align: center;
            }
            .msg {
                display: inline-block;
                text-align: left;
                font-size: 18px;
                line-height: 0.2rem;
                margin: 0.1rem 0;
            }
            .close {
                width: 0.22rem;
                height: 0.22rem;
                position: absolute;
                right: 0.2rem;
                top: 0.2rem;
                background: url('../images/close.png') no-repeat center;
                background-size: 100%;
            }
            .icon.football{
                height: 0.46rem;
                background: url('../images/football.png') no-repeat center;
                background-size: auto 100%;
                margin:0.6rem auto 0.2rem;
            }

        }

    }
</style>