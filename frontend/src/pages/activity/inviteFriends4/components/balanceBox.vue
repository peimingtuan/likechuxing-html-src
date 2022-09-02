<template>
    <div class="balanceBox">
        <div class="box">
            <div class="main">{{Number(data.change_money)>0?data.type_des:'尾号 '+data.phone_no+' 的用户跳去小程序啦，首单返现失败'}}</div>
            <div class="sub">
                <span class="gray">{{data.time}}</span>
                <span v-if="Number(data.change_money)>0" class="float-right fs" :class="{danger:data.sign_type === '+'}">{{data.sign_type}} {{data.change_money}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "balanceBox",
    props:['data']
  }
</script>

<style lang=less scoped>
.balanceBox{
    padding: 0.05rem 0.3rem;
    .box{
        border-bottom: solid 1px #E1E1E3;
    }
    .main {
        font-size: 16px;
        font-family: "PingFang SC", "Microsoft YaHei", "Heiti SC", "Hei" , 'Arial', Helvetica, STHeiTi, sans-serif;
    }
    .sub{
        font-size: 13px;
        line-height: 0.2rem;
        padding-bottom: .1rem;
        .gray{
            color:#908F8F
        }
    }
    .fs{
        font-size: 16px;
    }
}
</style>