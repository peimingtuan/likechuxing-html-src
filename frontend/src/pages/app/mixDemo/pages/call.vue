<template>
    <div class="call">
        <h4 class="title">外部唤起</h4>
        <div class="btn-con">
            <button v-for="item in list" :key="item.name" class="btn btn-primary btn-block" @click="item.cb">{{item.name}}</button>
        </div>
    </div>
</template>

<script>
  import {openApp} from '../../../../../other_modules/app-mutual'

  export default {
    name: "call",
    data(){
      return {
        list:[
          {
            name: '在app外打开app首页',
            cb: function () {
              openApp.mainIndex()
            }
          },
          {
            name: '在app外打开某页url post',
            cb: function () {
              openApp.openUrl('https://h5test.likechuxing.com/activity/longRental')
            }
          },
          {
            name: '在app外打开某页url get',
            cb: function () {
              openApp.openUrl('https://h5test.likechuxing.com/app/mixDemo/index.html', 'get')
            }
          },
          {
            name: '在app外打开某页url post 需要分享',
            cb: function () {
              openApp.openUrlWithShare('https://h5test.likechuxing.com/app/mixDemo')
            }
          },
          {
            name:'在app外进入认证流程',
            cb:function(){
              openApp.userLicense()
            }
          },
          {
            name:'在app外进入押金流程',
            cb:function(){
              openApp.userDeposit()
            }
          },
          {
            name:'在app外进入充值流程',
            cb:function(){
              openApp.userRecharge()
            }
          },
          {
            name:'进入app去违章列表',
            cb:function(){
              openApp.rentalPeccancy()
            }
          },
          {
            name:'进入app去自助缴费列表',
            cb:function(){
              openApp.paySelfService()
            }
          },
          {
            name:'进入活动详情（地址为测试页首页）',
            cb:function(){
              openApp.openUrl('https://h5test.likechuxing.com/app/mixDemo/index.php','post')
            }
          },
          {
            name:'进入行程详情(rental_id=24963,需要uid=708登录)',
            cb:function(){
              openApp.openUrl('https://h5test.likechuxing.com/app/rentalDetail/?rental_no=RE15277399099631','post')
            }
          },
          {
            name:'进入系统消息列表',
            cb:function(){
              openApp.userMessage(0)
            }
          },
          {
            name:'进入订单消息列表',
            cb:function(){
              openApp.userMessage(1)
            }
          }
        ]
      }
    }
  }
</script>

<style lang="less">
    .call{
        text-align: center;
        .btn{
            margin:0.1rem 0
        }
    }
</style>