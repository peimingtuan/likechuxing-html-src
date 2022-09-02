<template>
    <div class="Main">
        <div class="main-background header">
            <div class="banner"></div>
            <div class="detail" @click="toDetail"></div>
        </div>
        <ul class="desc">
            <li class="item">你是否每周数次往返于</li>
            <li class="item double">广州与佛山，或工作，或回家？</li>
            <li class="item">你是否纠结于或出租车高昂的交通费，</li>
            <li class="item">或公交车过长的时间？有私家车？</li>
            <li class="item">那你是否苦恼于4开4停的新政策，</li>
            <li class="item  double">每周总有几天不能在广州开车呢？</li>
            <li class="item  double">立刻出行跨城先锋计划需要你！</li>
            <li class="item">立刻出行将作为广州与佛山的跨城驾驶开拓者，</li>
            <li class="item  double">打造“广佛同城”跨城出行网</li>
            <li class="item">加入立刻出行，一起共享优惠，共享出行！</li>
        </ul>
        <div class="btn_con">
            <button class="btn main-background" @click="toForm">立刻报名</button>
        </div>
        <div class="btn_con" v-if="show_share">
            <button class="btn btn-border" @click="share">分享</button>
        </div>
    </div>
</template>

<script>
  import {Alert, Toast, Loading, Confirm} from '../../../../other_modules/vue-plugins/like-base/'
  import appArguments from '../../../../other_modules/app-arguments'
  import {appMutual} from '../../../../other_modules/app-mutual'
  import myAjax from '../../../../other_modules/like-request/withAxiosV2'
  import {getApiUrl} from "./js/getApiUrl";
  import formatTime from './js/formatTime'
  import wxShareSelector from '../../../component/wxShareSelector'
  import wxShare from './js/thisWxShare'
  wxShare()

  export default {
    name: "point",
    data() {
      return {
        show_share:appArguments.in_app
      }
    },
    methods:{
      toDetail(){
        window.location.href = 'detail.html'
      },
      toForm(){
        window.location.href = 'form.html'
      },
      share(){
        wxShareSelector({
          cb: function (destination) {
            appMutual.share.wx({
              share_type: '1',
              activity_id: '102',
              destination
            })
          },
          msg: ''
        })
      }
    },
    created() {

    }
  }
</script>

<style lang=less>
.Main{
    padding-bottom: 0.4rem;

    .header{
        position: relative;
        .banner{
            height: 2.3rem;
            background: url('./images/banner.png') no-repeat center;
            background-size: 100%;
        }
        .detail{
            position: absolute;
            right:0;
            top:0.24rem;
            width: 1rem;
            height: 0.35rem;
            background: url('./images/detail.png') no-repeat right;
            background-size: 100%;
        }
    }

    .desc{
        font-size: 14px;
        padding:0.25rem 0.35rem;
        color:#635d5d;
        line-height: 0.2rem;
        .double{
            margin-bottom: 0.2rem;
        }
    }

    .btn_con{
        margin:0.15rem 0;
        padding: 0 0.35rem;
        .btn{
            display: block;
            box-sizing: border-box;
            border:none;
            border-radius: 5px;
            height: 0.44rem;
            width: 100%;
            color:#fff;
            font-size: 16px;
            outline: none;
            box-shadow: 1px 1px 1px 1px #f0f0f0 ;
            transition: box-shadow 100ms;
            &.btn-border{
                border:solid 1px #ec753f;
                background-color: #fff;
                color:#ec753f
            }
            &:active{
                box-shadow: none;
            }
        }
    }
}
</style>