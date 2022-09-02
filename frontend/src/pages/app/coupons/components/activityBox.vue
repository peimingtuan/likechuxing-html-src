<template>
    <div class="activityBox" @click="toActivity"></div>
</template>

<script>
  import {appMutual} from '../../../../../other_modules/app-mutual'
  import {getH5Url} from "../../../../../other_modules/url-constructor";

  export default {
    name: "activityBox",
    methods:{
      toActivity(){
        appMutual.send.url({
          url:getH5Url('/app/inviteCode?entry=5'),
          destroy_current:1,
          callback_url:'',
          request_type:'post',
          need_param:1
        })
      }
    }
  }
</script>

<style lang=less scoped>
.activityBox{
    width: 100%;
    height: 1.41rem;
    background: url('../images/activity.png') no-repeat center;
    background-size: 100%;
}
</style>