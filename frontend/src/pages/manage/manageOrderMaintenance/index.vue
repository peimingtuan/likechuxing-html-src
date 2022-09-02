<template>
        <router-view/>
</template>

<script>
  import dd from '../../../../other_modules/like-manageOrder/ddSDK'
  import userData from '../../../../other_modules/like-manageOrder/UserData'
  import waterMark from '../../../../other_modules/like-manageOrder/waterMark'

export default {
  name: 'app',
  beforeCreate(){
    dd.init()

    userData.load()

    if(userData.state.nickName && userData.state.mobile){
      waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
    }
/*    userData.save({
      mobile:18610326236,
      city_ids:[1,197,235]
    })*/
  },
  created(){
    this.$store.commit('setBase',userData.state)
  }
}
</script>

<style>
body{
    background-color: #f6f6f6;
}
</style>