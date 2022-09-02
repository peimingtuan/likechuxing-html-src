<template>
  <el-container class="app is-vertical">
    <like-header></like-header>
    <el-container>
      <like-aside></like-aside>
      <el-main>
        <div class="main-container">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import LikeHeader from './components/Header'
  import LikeAside from './components/Aside'
export default {
  name: 'App',
  components:{
    LikeHeader,
    LikeAside
  }
}
</script>

<style lang="less">
  .app{
    height: 100vh;
    .el-main{
      padding: 0;
      .main-container{
        padding: 20px;
        height: 100%;
        box-sizing: border-box;
      }
    }
  }

</style>
