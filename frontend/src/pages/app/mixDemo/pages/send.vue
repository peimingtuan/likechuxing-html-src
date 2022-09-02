<template>
    <div class="send">
        <h4 class="title">数据交互send</h4>
        <div class="btn-con">
            <button v-for="item in list" :key="item.name" class="btn btn-primary btn-block" @click="item.cb">{{item.name}}</button>
            <input v-model="lng" class="input" placeholder="经度" />
            <input v-model="lat" class="input" placeholder="纬度" />
            <button class="btn btn-primary btn-block" @click="loc">用输入坐标开车导航到上地站</button>
        </div>
    </div>
</template>

<script>
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  import {getH5Url} from '../../../../../other_modules/url-constructor/index'

  window.testCallBack = function(){
    console.log('testCallBack')
    alert('点击了右上角')
  }

  window.testCallBack2 = function(){
    console.log('testCallBack2')
    appMutual.send.url({
      url:'https://www.likechuxing.com',
      request_type:'get',
      destroy_current:0
    })
  }

  window.testCallBack3 = function(){

    console.log('testCallBack3开始请求接口')
    myAjax.get('https://apitest.likechuxing.com/time/get').then(res=>{
      console.log('请求完毕',res)
    })
  }

  window.testCallBack4 = function(){
    console.log('testCallBack4开始耗时操作')
    setTimeout(function(){
      let i = 0
      let arr = []
      while(i<4000000){
        arr.push(Math.random())
        i++
      }
      arr.sort((a,b)=>a-b)
      console.log('耗时操作完毕')
    },50)

  }

  let times = 1
  window.testCallBack5 = function(){
    times++

    appMutual.send.updateHeaderRight("第"+times+"次右上角",'testCallBack5')
  }

  export default {
    name: "send",
    data(){
      return {
        list:[
          {
            name:'去优惠券',
            cb:function(){
              appMutual.send.url({
                url:getH5Url('/app/coupons')
              })
            }
          },
          {
            name:'去积分商城',
            cb:function(){
              appMutual.send.url({
                url:getH5Url('/app/memberMall')
              })
            }
          },
          {
            name: '设置右上角',
            cb: function () {
              appMutual.send.updateHeaderRight("新右上角",'testCallBack')
            }
          },
          {
            name: '右上角跳转',
            cb: function () {
              appMutual.send.updateHeaderRight("查看官网",'testCallBack2')
            }
          },
          {
            name: '右上角请求接口',
            cb: function () {
              appMutual.send.updateHeaderRight("异步请求",'testCallBack3')
            }
          },
          {
            name: '右上角耗时>5s',
            cb: function () {
              appMutual.send.updateHeaderRight("400万级随机数",'testCallBack4')
            }
          },
          {
            name: '右上角递归修改',
            cb: function () {
              appMutual.send.updateHeaderRight("第"+times+"次右上角",'testCallBack5')
            }
          },
          {
            name: '点击复制"Hello World"',
            cb: function () {
              appMutual.send.copy("Hello World")
            }
          },
          {
            name: '更新本页title为"新title"',
            cb: function () {
              appMutual.send.updateTitle("新title")
            }
          },
          {
            name: 'post打开百度首页-关闭当前',
            cb: function () {
              appMutual.send.url('https://www.baidu.com')
            }
          },
          {
            name: 'get打开立刻首页-关闭当前',
            cb: function () {
              appMutual.send.url({
                url:'https://www.likechuxing.com',
                request_type:'get',
                destroy_current:1
              })
            }
          },
          {
            name: 'get打开立刻首页-保留当前',
            cb: function () {
              appMutual.send.url({
                url:'https://www.likechuxing.com',
                request_type:'get',
                destroy_current:0
              })
            }
          },
          {
            name: 'get打开新的交互查看参数页-保留当前-带参数',
            cb: function () {
              appMutual.send.url({
                url:'https://h5test.likechuxing.com/app/mixDemo/index.html',
                request_type:'get',
                destroy_current:0,
                need_param:1
              })
            }
          },
          {
            name: 'get打开新的交互查看参数页-保留当前-不带参数',
            cb: function () {
              appMutual.send.url({
                url:'https://h5test.likechuxing.com/app/mixDemo/index.html',
                request_type:'get',
                destroy_current:0,
                need_param:0
              })
            }
          },
          {
            name: '开四停四_继续用车',
            cb: function () {
              appMutual.send.orderCar()
            }
          },
          {
            name: '开四停四_刷新首页',
            cb: function () {
              appMutual.send.indexRefresh({
                destroy_current:0
              })
            }
          },
          {
            name: '调起导航_有全景',
            cb: function () {
              appMutual.send.callNavigation({
                lng_start:'116.306172',
                lat_start:'40.052297',
                lng_des:'116.319782',
                lat_des:'40.032843',
                policy:1,
                overall_view:'https://720yun.com/t/2fa2dwag9n6'
              })
            }
          },
          {
            name: '调起导航_西二旗站_步行_上地站',
            cb: function () {
              appMutual.send.callNavigation({
                lng_start:'116.306172',
                lat_start:'40.052297',
                lng_des:'116.319782',
                lat_des:'40.032843',
                policy:1
              })
            }
          },
          {
            name: '调起导航_西二旗站_开车_上地站',
            cb: function () {
              appMutual.send.callNavigation({
                lng_start:'116.306172',
                lat_start:'40.052297',
                lng_des:'116.319782',
                lat_des:'40.032843',
                policy:0
              })
            }
          }
        ],
        lng:'',
        lat:'',
      }
    },
    methods:{
      loc(){
        appMutual.send.callNavigation({
          lng_start:this.lng,
          lat_start:this.lat,
          lng_des:'116.319782',
          lat_des:'40.032843',
          policy:0
        })
      }
    },
    mounted(){
      appMutual.send.setIosEnvColor({
        color:"ffffff"
      })
    }
  }
</script>

<style lang="less">
    h4{
        margin:0 auto;
        text-align: center;
    }
    .send{
        text-align: center;
        .btn{
            margin:0.1rem 0
        }
    }
</style>