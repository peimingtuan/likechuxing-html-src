<template>
    <div class="jump">
        <h4 class="title">app内跳转jump</h4>
        <div class="btn-con">
            <button v-for="item in list" :key="item.name" class="btn btn-primary btn-block" @click="item.cb">
                {{item.name}}
            </button>
        </div>
    </div>
</template>

<script>
  import appArgument from '../../../../../other_modules/app-arguments'
  import {appMutual} from '../../../../../other_modules/app-mutual'

  export default {
    name: "jump",
    data() {
      return {
        list: [
          {
            name: '1025去个人中心-关当前-cb空',
            cb: function () {
              appMutual.jump.userCenter({
                destroy_current: 1,
                callback_url: ''
              })
            }
          },
          {
            name: '1025去个人中心-关当前-cb去积分商城',
            cb: function () {
              appMutual.jump.userCenter({
                destroy_current: 1,
                callback_url: 'https://h5test.likechuxing.com/app/memberMall'
              })
            }
          },
          {
            name: '1025去个人中心-不关当前-cb去积分商城',
            cb: function () {
              appMutual.jump.userCenter({
                destroy_current: 0,
                callback_url: 'https://h5test.likechuxing.com/app/memberMall'
              })
            }
          },
          {
            name: '1025去个人中心-不关当前-cb空',
            cb: function () {
              appMutual.jump.userCenter({
                destroy_current: 0,
                callback_url: ''
              })
            }
          },
          {
            name: '0928去认证拍照-关当前-cb空-统计',
            cb: function () {
              appMutual.jump.license({
                destroy_current: 1,
                license_status: 3,
                count_channel:'mainPageTopBar'
              })
            }
          },
          {
            name: '0928去认证结果-关当前-cb空-统计',
            cb: function () {
              appMutual.jump.license({
                destroy_current: 1,
                license_status: 0,
                count_channel:'mainPageTopBar'
              })
            }
          },
          {
            name: '0928去交押金流程-关当前-cb空-统计',
            cb: function () {
              appMutual.jump.deposit({
                destroy_current: 1,
                callback_url: '',
                count_channel:'mainPageTopBar'
              })
            }
          },
          {
            name: '5-10去认证-关当前-cb空',
            cb: function () {
              appMutual.jump.license({
                destroy_current: 1,
                license_status: 3
              })
            }
          },
          {
            name: '5-10去认证-不当前-cb空',
            cb: function () {
              appMutual.jump.license({
                destroy_current: 0,
                license_status: 3
              })
            }
          },
          {
            name: '5-10去认证-关当前-cb有',
            cb: function () {
              appMutual.jump.license({
                license_status: 3,
                destroy_current: 1,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '5-10去认证-不当前-cb有',
            cb: function () {
              appMutual.jump.license({
                license_status: 3,
                destroy_current: 0,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '5-10去登陆-关当前-cb空',
            cb: function () {
              appMutual.jump.loginAndCloseThisWebview({
                destroy_current: 1
              })
            }
          },
          {
            name: '5-10去登陆-不当前-cb空',
            cb: function () {
              appMutual.jump.loginAndCloseThisWebview({
                destroy_current: 0
              })
            }
          },
          {
            name: '5-10去登陆-关当前-cb有',
            cb: function () {
              appMutual.jump.loginAndCloseThisWebview({
                destroy_current: 1,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '5-10去登陆-不当前-cb有',
            cb: function () {
              appMutual.jump.loginAndCloseThisWebview({
                destroy_current: 0,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '关闭当前页面去首页',
            cb: function () {
              appMutual.jump.indexAndCloseThisWebview()
            }
          },
          {
            name: '去交押金流程-不关-cb有',
            cb: function () {
              appMutual.jump.deposit({
                destroy_current: 0,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '去交押金流程-关-cb有',
            cb: function () {
              appMutual.jump.deposit({
                destroy_current: 1,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '去交押金流程-不关-cb无',
            cb: function () {
              appMutual.jump.deposit({
                destroy_current: 0
              })
            }
          },
          {
            name: '去充值流程',
            cb: function () {
              appMutual.jump.recharge({})
            }
          },
          {
            name: '去违章列表-不关-cb有',
            cb: function () {
              appMutual.jump.peccancy({
                destroy_current: 0,
                callback_url: 'https://likechuxing.com'
              })
            }
          },
          {
            name: '去自助缴费列表-不关-cb无',
            cb: function () {
              appMutual.jump.selfService({
                destroy_current: 0,
                callback_url: ''
              })
            }
          },
          {
            name: '去活动详情（保留本页去官网）',
            cb: function () {
              window.location.href = 'https://www.likechuxing.com'
            }
          },
          {
            name: '去活动详情（清掉本页去官网）',
            cb: function () {
              appMutual.send.url('https://www.likechuxing.com')
            }
          },
          {
            name: '去行程详情(rental_id=24963,需要uid=708登录)',
            cb: function () {
              window.location.href = 'https://h5test.likechuxing.com/app/rentalDetail/?rental_no=RE15277399099631&uuid=' + appArgument.uuid + '&sign=' + appArgument.sign
            }
          },
          {
            name: '去系统消息列表',
            cb: function () {
              appMutual.jump.userMessage({
                type:0
              })
            }
          },
          {
            name: '去订单消息列表',
            cb: function () {
              appMutual.jump.userMessage({
                type:1
              })
            }
          }
        ]
      }
    }
  }
</script>

<style lang="less">
    .jump {
        text-align: center;
        .btn {
            margin: 0.1rem 0
        }
    }
</style>