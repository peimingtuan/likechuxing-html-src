<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
  import dd from '../../../../other_modules/like-manageOrder/ddSDK'
  import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "app",
    beforeCreate(){
      dd.init()

      if(userData.state.nickName && userData.state.mobile){
        waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
      }
    }
  }
</script>