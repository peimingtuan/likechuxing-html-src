/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: index
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/1-下午1:40
 Description:
 Param:
 Return:
 *************************************************/
import $ from 'jquery'
import './css/common.less';
const Loca = window.Loca


const DATA = require('./data/201807301400.json')
let data_supply = []
let data_need = []

DATA.forEach(item=>{
  let lnglat = [item.lon,item.lat]
  data_supply.push({
    lnglat,
    value:item.car
  })

  data_need.push({
    lnglat,
    value:item.need
  })

})

// length应为奇数，从需求到0到供应的色值
const COLOR = ['#fd0c1b', '#fc4521', '#fd7f28', '#feb72f', '#fff135', '#c9da2e', '#93c326', '#5eac1f', '#269617']
let center = [113.307, 23.135]
let map_local = null
let rotate = 0
let base = null
let supply = null
let need = null
let type = 'supply'

let map_amap = new AMap.Map(document.querySelector('#map'), {
  mapStyle: 'amap://styles/whitesmoke',
  zoom:11,//级别
  center: center,
  viewMode:'3D',
  pitch: 50,
  rotation: rotate
});

map_amap.on('complete',function(){
  map_local = Loca.create(map_amap);

  map_local.on('mapload', function() {

    map_local.getMap().plugin(['AMap.ControlBar'], function () {
      var controlBar = new AMap.ControlBar();
      map_local.getMap().addControl(controlBar);
      //window.requestAnimationFrame(animate)
    });
  });


  //base = drawBasePolygon()
  supply = drawSupply()


  $('.btn').on('click', function(){
    console.log(map_local)
    if(type === 'supply'){
      type = 'need'
      supply.destroy()
      need = drawNeed()
    }else{
      type = 'supply'
      need.destroy()
      supply = drawSupply()
    }
  })
})

const animate = function(){
  rotate+=0.2
  map_amap.setRotation(rotate)
  //window.requestAnimationFrame(animate)
}


const drawBasePolygon = function(){
  let layer2 = Loca.visualLayer({
    container: map_local,
    type: 'heatmap',
    shape: 'rectangle'
  });

  let data2 = []
  for(let lng = 113.50259363858036;lng>113.17986413492277;lng-=0.004889840964512324){
    for(let lat = 22.9776187189642;lat<23.312616017168974;lat+=0.004496608029593652){
      data2.push({
        lnglat:[lng,lat],
        count:1
      })
    }
  }
  layer2.setData(data2, {
    type: 'json',
    lnglat:'lnglat',
    value:'count'
  });
  layer2.setOptions({
    gradient: ['#7c9eec'],
    unit: 'meter',
    mode:'max',
    style: {
      radius: 250,
      opacity: 0.4,
      gap: 20
    }
  });

  layer2.render();
  return layer2
}

const drawSupply = function(){
  let layer = Loca.visualLayer({
    container: map_local,
    type: 'point',
    shape: 'prism',
    vertex: 4,
    eventSupport:true
  });

  layer.setData(data_supply, {
    type: 'json',
    lnglat:'lnglat'
  });

  let max_index = COLOR.length -1
  let color = COLOR.slice(0,max_index/2).reverse()

  layer.setOptions({
    unit: 'meter',
    style: {
      radius: 250,
      opacity: 0.7,
      height: {
        key:'value',
        scale:'pow',
        value: [0, 20000]
      },
      // 顶边颜色
      topColor: {
        key: 'value',
        scale:'quantile',
        value: color
      },
      // 底边颜色
      bottomColor: {
        key: 'value',
        scale:'quantile',
        value: color
      },
      topFill: {
        key: 'value',
        scale:'quantile',
        value: color
      },
      // 旋转角度，单位弧度
      rotate: Math.PI / 180 * 45
    }
  });
  layer.on('click',function(item){
    console.log(item)
  })

  layer.render();
  return layer
}

const drawNeed = function(){
  let layer = Loca.visualLayer({
    container: map_local,
    type: 'heatmap',
    shape: 'rectangle'
  });

  layer.setData(data_need, {
    type: 'json',
    lnglat:'lnglat'
  });

  let max_index = COLOR.length -1
  let color = COLOR.slice(max_index/2, max_index)
  layer.setOptions({
    gradient: color,
    unit: 'meter',
//            colorScale: 'quantile',
    style: {
      radius: 250,
      opacity: 0.7,
      gap: 20
    }
  });

  layer.render();
  return layer
}








