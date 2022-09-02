/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: getScripts
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-11-27-11:51
 * Description:
 *
 *************************************************/
const assets = {

  // 阿里云视频
  aliVideo: {
    script: ['https://g.alicdn.com/de/prismplayer/2.2.0/aliplayer-min.js'],
    style: ['https://g.alicdn.com/de/prismplayer/2.2.0/skins/default/aliplayer-min.css']
  },

  // 高德地图
  amap:{
    script:['https://webapi.amap.com/maps?v=1.4.9&key=91ed10906005ee88866f14fd9f076e8b']
  },

  // 高德地图UI
  amapUI:{
    script:['https://webapi.amap.com/ui/1.0/main.js?v=1.0.11']
  },

  // 高德地图Loca
  amapLoca:{
    script:['https://webapi.amap.com/loca?key=91ed10906005ee88866f14fd9f076e8b&v=1.2.1']
  },

  // 百度地图
  bmap:{
    script:['https://api.map.baidu.com/api?v=3.0&ak=fqCNAr6UAW542snWLf3dCaYH9vXAOgD8&s=1']
  },

  // 微信jssdk
  wx:{
    script:['https://res2.wx.qq.com/open/js/jweixin-1.3.2.js ']
  },

  // 钉钉jssdk
  dd:{
    script:['https://g.alicdn.com/dingding/dingtalk-jsapi/2.0.57/dingtalk.open.js']
  }

}

module.exports = function (list){
  let config = {
    scripts:[],
    styles:[]
  }

  list.forEach(item => {
    let asset = assets[item]

    if (!asset) throw new Error('There is a useless assets key in function getAssets(keys)，please check your likePackage file.')

    if(asset.script)config.scripts = config.scripts.concat(asset.script)
    if(asset.style)config.styles = config.styles.concat(asset.style)
  })

  return config
}