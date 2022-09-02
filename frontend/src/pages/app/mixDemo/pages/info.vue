<template>
    <div class="info">
        <h4>查看app解析信息</h4>
        <p class="item">当前手机是第 {{num}} 次访问本页面</p>
        <p class="item" v-for="item in info" :key="item.title">
            <span class="title">{{item.title}}：</span>
            {{item.value}}
        </p>
    </div>
</template>

<script>
    import appArgument from '../../../../../other_modules/app-arguments'
    import env from '../../../../../other_modules/like-env'

  export default {
    name: "info",
    data(){
      return{
        num:0,
        info:[]
      }
    },
    created(){
      let num = localStorage.getItem("like_index") || 0
      this.num = Number(num)+1
      localStorage.setItem('like_index',String(this.num))
    },
    mounted(){
      let ua = navigator.userAgent
      let str = ua.match(/likechuxing\/\d{4}/)
      let match = str ? str[0] : ''

      let info = [
        {
          title:'运行环境',
          value:env.isProduction?'生产':'测试'
        },
        {
          title:'手机系统',
          value:env.isIos?'Apple IOS':'Androd'
        },
        {
          title:'自定义的userAgent',
          value:match
        },
        {
          title:'userAgent',
          value:ua
        }
      ]
      for(let key in appArgument){
        info.push({
          title:key,
          value:appArgument[key]
        })
      }
      this.info = info
    }
  }
</script>

<style lang="less">
    .info .item{
        margin:0.1rem 0;
        .title{
            color:#999
        }
        user-select: all
    }
</style>