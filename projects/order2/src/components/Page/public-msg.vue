<template>
    <div class="public-msg" @click="tapThis">
        <span class="content">{{msg}}</span>
        <p>{{msg2}}</p>
    </div>
</template>

<script>
  //import appArguments from '../../../../../other_modules/app-arguments/index'
  let appArguments = {}

  export default {
    name: "public-msg",
    props:['data'],
    computed:{
      msg(){
        if(this.data.discount_type === 2 || this.data.discount_type === 3){
          return this.data.publicMsg.replace('点击查看您的现金奖励', '')
        }else{
          return this.data.publicMsg
        }
      },
      msg2(){
        if(this.data.discount_type === 2 || this.data.discount_type === 3){
          return '点击查看您的现金奖励'
        }else{
          return ''
        }
      }
    },
    methods:{
      tapThis(){
        switch (Number(this.data.discount_type)){
          case 2:
            window.location.href = '/activity/millionGift?uuid='+appArguments.uuid+'&sign='+appArguments.sign
            break;
          case 3:
            window.location.href = '/activity/millionGift_gz?uuid='+appArguments.uuid+'&sign='+appArguments.sign
            break;
          case 5:
            window.location.href = '/activity/millionGift_wh?uuid='+appArguments.uuid+'&sign='+appArguments.sign
            break;
          default:
            // nothing to do
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .public-msg {
        position: fixed;
        top: 0;
        width: 100%;
        padding: 0.08rem 0.1rem;
        box-sizing: border-box;
        font-size: 13px;
        background: #FFFCE0;
        color: #ED3800;
        text-align: center;
        line-height: 0.2rem;
        .content {
            display: inline-block;
            vertical-align: top;
            &::before {
                content: '';
                width: 0.2rem;
                height: 0.2rem;
                display: inline-block;
                vertical-align: top;
                background: url('../images/talk.png') no-repeat center;
                background-size: 100%;
                margin-right: 0.06rem;
            }
        }
    }
</style>
