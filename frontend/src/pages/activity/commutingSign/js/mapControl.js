/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mapControl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/7/13-下午6:47
 Description:
 Param:
 Return:
 *************************************************/
 export default new class mapControl {
   constructor (){
     this.map = null
     this.geocoder = null

     let that = this
     window.AMap.plugin('AMap.Geocoder', function() {
       that.geocoder = new AMap.Geocoder({
         // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
         city: '全国'
       })
     })
   }

   initMap(element){
     this.map = new AMap.Map(element, {
       resizeEnable: true,
       zoom: 11,
       center: [113.21205, 23.11478]
     });
   }

   dragend(fun){
     let that = this
     this.map.on('dragend',function(){
       fun(that.map.getCenter())
     })
   }

   getAddress(center){
     return new Promise((resolve,reject)=>{
       this.geocoder.getAddress(center, function(status, result) {
         if (status === 'complete' && result.info === 'OK') {
           // result为对应的地理位置详细信息
           resolve(result.regeocode.formattedAddress)
         }else{
           reject(result)
         }
       })
     })

   }
}