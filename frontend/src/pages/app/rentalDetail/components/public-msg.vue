<template>
    <div class="PublicMsg" @click="tapThis">
        <span class="content">{{msg}}</span>
        <p>{{msg2}}</p>
    </div>
</template>

<script>
  import appArguments from '../../../../../other_modules/app-arguments/index'
  import wxShareSelector from '../../../../component/wxShareSelector'
  import {appMutual} from  '../../../../../other_modules/app-mutual/'

  export default {
    name: "public-msg",
    props:['data'],
    computed:{
      msg(){
        switch (this.data.discount_type){
          case 2:
          case 3:
            return this.data.publicMsg.replace('点击查看您的现金奖励', '')
          default:
            return this.data.publicMsg
        }
      },
      msg2(){
        switch (this.data.discount_type){
          case 2:
          case 3:
            return '点击查看您的现金奖励'
          default:
            return ''
        }
      }
    },
    methods:{
      tapThis(){
        let that = this
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
          case 10:
            if(appArguments.user_sys === 'ios' && appArguments.app_version < 2108){
              this.$_LIKE_alert({
                msg:'请返回首页-右上角活动列表-选择"开立刻出行 领300元礼包"活动-分享到微信即可领券',
                confirmButtonText:'知道了'
              })
            }else{
              wxShareSelector({
                cb:function(res){
                  that.data.publicMsg = ''
                  setTimeout(function(){
                    appMutual.share.wx({
                      share_type:9,
                      destination:res
                    })
                  },100)
                },
                msg:'请选择'
              })
            }
            break;
          default:
            // nothing to do
        }
      }
    }
  }
</script>

<style lang="less">
    .PbulicMsg {
        position: fixed;
        top: 0;
        z-index: 2;
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