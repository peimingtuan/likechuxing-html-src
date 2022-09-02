<template>
    <div class="inviteBox">
        <div class="box">
            <div class="main">{{tel[0]}}<span>****</span>{{tel[1]}}</div>
            <div class="sub">
                <span class="gray">{{data.register_time}} 注册</span>
                <span class="float-right danger" v-if="data.status === 0">首单未完成</span>
                <span class="float-right" v-else>首单完成</span>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: "inviteBox",
    props:[
      'data'
    ],
    data(){
      return {
        tel:this.data.phone.split('****')
      }
    }
  }
</script>

<style lang=less scoped>
.inviteBox{
    padding: 0.05rem 0.3rem;
    .box{
        border-bottom: solid 1px #E1E1E3;
    }
    .main {
        font-size: 16px;
        font-family: "PingFang SC", "Microsoft YaHei", "Heiti SC", "Hei" , 'Arial', Helvetica, STHeiTi, sans-serif;
        span{
            padding:0 .09rem;
        }
    }
    .sub{
        font-size: 13px;
        line-height: 0.2rem;
        padding-bottom: .10rem;
        .gray{
            color:#908F8F
        }
    }
}
</style>