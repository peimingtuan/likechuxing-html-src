<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
  import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
  import userData from '../../../../other_modules/like-manageOrder/UserData'

  export default {
    name: "app",
    beforeCreate(){
      if(userData.state.nickName && userData.state.mobile){
        waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
      }
//    userData.save({
//     mobile:18610326236,
//     city_ids:'1,197,235'
//     })
    }
  }
</script>