<template>
    <div class="MainPage">
        <router-link v-for="item in list" class="box" :to="item.path" :key="item.name">
            <img class="img" :src=item.img />
            <div class="name">{{item.name}}</div>
        </router-link>
    </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        list:[
          {
            name:'赛欧 3',
            path:'/car/saiou3',
            img:require('../images/saiou3.png')
          }
        ]
      }
    }
  }
</script>

<style lang="less">
    .MainPage {
        padding: 0.3rem 0.25rem;
        position: relative;
        display: flex;
        flex-wrap:wrap;

       .box{
           display: block;
           width: 50%;

           .img{
               width: 1.2rem;
               display: block;
               margin:0 auto;
           }

           .name{
               text-align: center;
           }
       }
    }
</style>