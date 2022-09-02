<template>
    <div class="popMessage">
        <h4 class="title">h5弹框展示</h4>
        <div class="btn-con">
            <button v-for="item in list" :key="item.name" class="btn btn-primary btn-block" @click="item.cb">{{item.name}}</button>
        </div>
    </div>
</template>

<script>
  import {openApp} from '../../../../../other_modules/app-mutual'
  import {Toast,Alert,Confirm} from '../../../../../other_modules/vue-plugins/like-base'

  export default {
    name: "popMessage",
    data(){
      return {
        list:[
          {
            name: '简短toast',
            cb: function () {
              Toast('简短的消息')
            }
          },
          {
            name: '很长的toast',
            cb: function () {
              Toast('我是一条很长很长很长文字很多很多的消息不是因为啰嗦就是想多打点字的消息balabalabala')
            }
          },

          {
            name: '单出口-有标题-短字',
            cb: function () {
              Alert({
                title:'我是标题',
                msg:"我是不到一行的消息"
              })
            }
          },
          {
            name: '单出口-有标题-好多字',
            cb: function () {
              Alert({
                title:'我是标题',
                msg:"我是一条很长很长很长文字很多很多的消息不是因为啰嗦就是想多打点字的消息balabalabala"
              })
            }
          },
          {
            name: '单出口-有icon-短字',
            cb: function () {
              Alert({
                icon:'peccancy',
                msg:"我是不到一行的消息"
              })
            }
          },
          {
            name: '单出口-有icon-好多字',
            cb: function () {
              Alert({
                icon:'peccancy',
                msg:"我是一条很长很长很长文字很多很多的消息不是因为啰嗦就是想多打点字的消息balabalabala"
              })
            }
          },

          {
            name: '双出口-有标题-短字',
            cb: function () {
              Confirm({
                title:'我是标题',
                msg:"我是不到一行的消息"
              })
            }
          },
          {
            name: '双出口-有标题-好多字',
            cb: function () {
              Confirm({
                title:'我是标题',
                msg:"我是一条很长很长很长文字很多很多的消息不是因为啰嗦就是想多打点字的消息balabalabala"
              })
            }
          },
          {
            name: '双出口-有icon-短字',
            cb: function () {
              Confirm({
                icon:'peccancy',
                msg:"我是不到一行的消息"
              })
            }
          },
          {
            name: '双出口-有icon-好多字',
            cb: function () {
              Confirm({
                icon:'peccancy',
                msg:"我是一条很长很长很长文字很多很多的消息不是因为啰嗦就是想多打点字的消息balabalabala"
              })
            }
          },
        ]
      }
    }
  }
</script>

<style lang="less">
    .popMessage{
        text-align: center;
        .btn{
            margin:0.1rem 0
        }
    }
</style>