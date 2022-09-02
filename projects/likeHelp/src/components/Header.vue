<template>
  <el-header height="40px">
    <span>立刻出行 开发助手 - Ver:{{ver}}</span>
    <ServerTime class="float-right"/>
  </el-header>
</template>

<script>
  import ServerTime from './serverTime'
  const packageJson = require('../../package')

  export default {
    name: "like-header",
    data(){
      return {
        ver:packageJson.version
      }
    },
    components:{
      ServerTime
    }
  }
</script>

<style lang=less>
.el-header{
  line-height: 40px;
  color:#fff;
  background-color: #1b1e21;
}
</style>
