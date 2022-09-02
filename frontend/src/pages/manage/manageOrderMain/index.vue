<template>
    <router-view/>
</template>

<script>
  import dd from '../../../../other_modules/like-manageOrder/ddSDK'
  import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "indexPage",
    beforeCreate(){
      dd.init()

      if(userData.state.nickName && userData.state.mobile){
        waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
      }
    }
  }
</script>

<style lang=less>

</style>