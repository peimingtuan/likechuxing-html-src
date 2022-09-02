<template>
    <div class="Main main-background">
        <div class="block"></div>
        <div class="box">
            <p v-for="item in list" :key="item" class="item">{{item}}</p>
        </div>
    </div>
</template>

<script>
  import {Alert, Toast, Loading, Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import appArguments from '../../../../other_modules/app-arguments'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import formatTime from './js/formatTime'
  import wxShare from './js/thisWxShare'
  wxShare()

  export default {
    name: "point",
    data() {
      return {
        list:[
          '1.报名时间：即日起 - 8月1日',
          '2.所有用户填写报名表中的各项信息后，点击提交，即可完成报名',
          '3.我们将人工审核您的报名资格，审核通过之后将通过电话或者短信等形式通知您，并告知您具体的选车与优惠方式',
          '4.我们预计将于7月25日开始进行跨城出行的试运营，具体时间如有调整，将通过APP的推送，短信等多种渠道通知'
        ]
      }
    },
    created() {

    }
  }
</script>

<style lang=less>

    .Main{
        min-height: 100vh;
        position: relative;
        .box{
            border-radius: 2px;
            position: absolute;
            background-color: #fff;
            top:0.1rem;
            bottom:0.1rem;
            left:0.2rem;
            right:0.2rem;
            padding: 0.15rem;
        }
        .item{
            font-size: 14px;
            margin:0.1rem 0;
        }
    }
</style>