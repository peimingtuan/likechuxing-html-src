<template>
  <div id="app">
      <keep-alive include="list">
          <router-view/>
      </keep-alive>
  </div>
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

    waterMark({watermark_txt: userData.state.nickName + '-' + userData.state.mobile});//水印
    /*userData.save({
      mobile:18610326236,
      city_ids:'1,197,235'
    })*/
  }
}
</script>

<style>
 
</style>