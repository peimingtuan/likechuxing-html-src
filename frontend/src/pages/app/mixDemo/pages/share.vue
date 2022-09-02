<template>
    <div class="share">
        <h4 class="title">分享share</h4>
        <div class="btn-con">
            <button v-for="item in list" :key="item.name" class="btn btn-primary btn-block" @click="item.cb">{{item.name}}</button>
        </div>
    </div>
</template>

<script>
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import wxShareSelector from '../../../../component/wxShareSelector'

  export default {
    name: "share",
    data(){
      return {
        list:[
          {
            name: '分享活动type=1,activity_id=50',
            cb: function () {
              wxShareSelector({
                cb: function (destination) {
                  appMutual.share.wx({
                    share_type: '1',
                    destination,
                    activity_id: '50'
                  })
                },
                msg: '测试分享id=50'
              })
            }
          },
          {
            name: '分享活动type=5,无activity_id',
            cb: function () {
              wxShareSelector({
                cb: function (destination) {
                  appMutual.share.wx({
                    share_type: '5',
                    destination
                  })
                },
                msg: '测试分享'
              })
            }
          },
          {
            name: '分享活动type=1,activity_id=10',
            cb: function () {
              wxShareSelector({
                cb: function (destination) {
                  appMutual.share.wx({
                    share_type: '1',
                    destination,
                    activity_id: '10'
                  })
                },
                msg: '测试分享'
              })
            }
          },
        ]
      }
    }
  }
</script>

<style lang="less">
    .share{
        text-align: center;
        .btn{
            margin:0.1rem 0
        }
    }
</style>