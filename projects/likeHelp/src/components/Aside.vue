<template>
    <el-aside class="Aside" width="200px">
      <div class="menu">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu v-for="group in menu" :key=group.id :index="String(group.id)">
            <template slot="title">
              <i class="iconfont" :class="group.icon"></i>
              <span>{{group.name}}</span>
            </template>
            <el-menu-item v-for="item in group.children" :key=item.name @click="item.action" :index="group.id+'-'+item.id">
              <i class="iconfont mini" :class="item.icon"></i>
              {{item.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
</template>

<script>
  export default {
    name: "like-aside",
    data(){
      return {
        menu:[
          {
            id:0,
            name:'数据',
            icon:'icon-database',
            children:[
              {
                id:0,
                name:'用户信息',
                icon:'icon-user',
                action:()=>this.$router.push('/user/info')
              }
            ]
          },
          {
            id:1,
            name:'开发',
            icon:'icon-laptop',
            children:[
              {
                id:0,
                name:'代码',
                icon:'icon-code',
                action:()=>this.$router.push('/dev/code')
              }
            ]
          },
          {
            id:2,
            name:'工具',
            icon:'icon-wrench',
            children:[
              {
                id:0,
                name:'时间戳',
                icon:'icon-clock',
                //action:()=>this.$router.push('/tool/timeStamp')
                action:()=>window.open('http://tool.chinaz.com/tools/unixtime.aspx')
              },
              {
                id:1,
                name:'二维码',
                icon:'icon-qrcode',
                action:()=>this.$router.push('/tool/qrCode')
              },
              {
                id:2,
                name:'JSON解析',
                icon:'icon-json',
                //action:()=>this.$router.push('/tool/json')
                action:()=>window.open('https://www.bejson.com/')
              },
              {
                id:3,
                name:'经纬度',
                icon:'icon-location',
                //action:()=>this.$router.push('/tool/gps')
                action:()=>window.open('http://www.gpsspg.com/maps.htm')
              },
              {
                id:4,
                name:'JSconsole',
                icon:'icon-codelibrary',
                action:()=>window.open('https://jsconsole.com/')
              }
            ]
          }
        ]
      }
    },
    methods:{

    }
  }
</script>

<style lang=less>
  .Aside.el-aside{
    background-color: #545c64;
    .el-menu{
      border-right:none;
    }
    .el-menu-item{
      font-size: 12px;
    }
    .el-submenu__title{
      font-size: 15px;
    }
    .menu{
      padding: 20px 0;
    }

    .iconfont{
      font-size: 22px;
      margin-right: 12px;
      &.mini{
        font-size: 20px;
        margin-right: 8px;
      }
    }
  }




</style>
