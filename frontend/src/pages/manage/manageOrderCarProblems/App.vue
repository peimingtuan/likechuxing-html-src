//@xurr on 18/06/07 车辆问题记录列表
<template>
  <div id="app">
     
   <router-view/>
  </div>
</template>

<script>
  import dd from '../../../../other_modules/like-manageOrder/ddSDK'

export default {
  name: 'app',
  beforeCreate(){
    dd.init()
  }
}
</script>

<style>
 
</style>