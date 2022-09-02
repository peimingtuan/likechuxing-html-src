<template>
    <div class="main">
        <h3>APP&H5交互测试页</h3>
        <div class="fun-con clearfix">
            <button v-for="item in fun" :key="item.name" class="btn btn-primary float-left" @click="()=>toPage(item.path)">{{item.name}}</button>
        </div>
        <div class="fun-con clearfix border">
            <button class="btn btn-primary float-left" @click="to360">360度看车(for 小麦)</button>
            <button class="btn btn-primary float-left" @click="toTest">测试按钮</button>
        </div>
    </div>
</template>

<script>
  export default {
    data(){
      return {
        fun:[
          {
            name:'分享share',
            path:'/share'
          },
          {
            name:'内部跳转jump',
            path:'/jump'
          },
          {
            name:'数据交互send',
            path:'/send'
          },
          {
            name:'外部唤起',
            path:'/call'
          },
          {
            name:'多媒体',
            path:'/media'
          },
          {
            name:'参数信息',
            path:'/info'
          },
          {
            name:'h5弹框',
            path:'/popMessage'
          }
        ]
      }
    },
    methods:{
      toPage(path){
        this.$router.push(path)
      },
      to360(){
        window.location.href = 'https://h5test.likechuxing.com/test/display360/index.html'
      },
      toTest(){
        window.location.href = 'http://192.168.0.123:8081/dispatchOut.html?uuid=1502274754196764&sign=JLT2GCHUY7HN4XNV53E3YBDT9QG9BNR6&user_lat=23.12984808&user_lng=113.266286&city_id=1#/'
      }
    }
  }
</script>

<style lang="less">
    @import '../../../../css/buttons/button-v2';

    .main{
        text-align: center;
        .fun-con{
            padding:0.1rem 0;
            &.border{
                border-top:solid 2px #f2f2f2
            }
            .btn{
                width: 45%;
                margin:0.05rem 2%;
            }
        }
    }
</style>