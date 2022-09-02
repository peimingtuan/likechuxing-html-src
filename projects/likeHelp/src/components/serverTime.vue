<template>
  <span class="ServerTime" v-if="server_time>0">
    <span class="title"> 测试服务器：</span>
    <span class="time">{{local}}</span>
  </span>
</template>

<script>
  import myAjax from '../../other_modules/like-request/withAxiosV2'
  import {formatTime,during} from '../common/formatTime'

  export default {
    name: "server-time",
    data() {
      return {
        local_time: 0,
        server_time: 0
      }
    },
    computed: {
      local() {
        return this.server_time > 0 ? formatTime(this.server_time, 0) : ''
      },
      compare() {
        let _time = this.local_time - this.server_time
        return "测试服务器时间比本地时间"+(_time>0?'落后':'超前')+during(Math.abs(_time))
      }
    },
    methods: {
      add() {
        this.local_time += 1
        this.server_time += 1
        setTimeout(function () {
          this.add()
        }.bind(this), 1000)
      }
    },
    mounted() {
      myAjax.getting.then(() => {
        this.local_time = Math.floor(new Date().getTime() / 1000)
        this.server_time = myAjax.server_time
        this.add()
      })
    }
  }
</script>

<style lang=less>
.ServerTime{
  font-size: 13px;
  color:#ddd;
  .title{
    color:#999
  }
}
</style>
