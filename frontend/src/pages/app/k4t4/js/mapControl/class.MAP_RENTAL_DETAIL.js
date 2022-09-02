/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAP_RENTAL_DETAIL
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午6:53
 Description:
 Param:
 Return:
 *************************************************/
import MAP_BASE from "./class.MAP_BASE";
import MARKER_ICON from './MARKER_ICON'
const simplify = require('simplify')

//判断两点是否是同一地点，地面近似50米左右
function isSamePoint(a,b){
  let standard = 0.0025;
  let dlat = a.lat-b.lat,
    dlng = a.lng-b.lng;
  return (dlat*dlat+dlng*dlng) < standard*standard
}

function calculatePoints(data){
  let points=[]
  data.forEach(function(item){
    points.push({
      x:item.lat*10000,
      y:item.lng*10000
    })
  })
  let simply_points = [];
  simplify(points).forEach(function(item){
    simply_points.push({
      lat:item.x/10000,
      lng:item.y/10000
    })
  })
  return simply_points
}

export default class MAP_RENTAL_DETAIL extends MAP_BASE{
  constructor() {
    super()
  }

  initMap(selector){
    this.map = new AMap.Map(selector,{
      resizeEnable: true,
      zoom: 3,
      // 西安，中国中心
      center: [108.894324, 34.285013]
    });
  }

  drawRoute(data){
    let points = calculatePoints(data);
    let start_point = points[0],
      end_point = points[points.length-1];

    // 画起点终点
    if(isSamePoint(start_point,end_point)){
      this.drawBranch('same',start_point)
    }else{
      this.drawBranch('start',start_point)
      this.drawBranch('end',end_point)
    }

    // 画路径
    new AMap.Polyline({
      map:this.map,
      path:points.map(item=>[item.lng,item.lat]),
      strokeColor:"#494B51",
      strokeWeight:4,
      strokeOpacity:0.9
    });
    this.map.setFitView()
    this.moveUp()
  }

  drawBranch(type,point){
    let opt = {
      position: [point.lng, point.lat],
      map: this.map,
    }

    switch (type){
      case "start":
        opt.offset = new AMap.Pixel(-11, -31)
        opt.icon = MARKER_ICON.RENTAL_DETAIL.START_POINT
        break;
      case "end":
        opt.offset = new AMap.Pixel(-11, -31)
        opt.icon = MARKER_ICON.RENTAL_DETAIL.END_POINT
        break;
      case "same":
        opt.offset = new AMap.Pixel(-17, -34)
        opt.icon = MARKER_ICON.RENTAL_DETAIL.SAME_POINT
        break;
      default:
        opt.offset = new AMap.Pixel(-20, -42)
        opt.icon = MARKER_ICON.RENTAL_DETAIL.GET_CAR_POINT
        this.map.setCenter([point.lng,point.lat])
        this.map.setZoom(16)
        this.moveUp()
    }

    new AMap.Marker(opt);
  }

  moveUp(){
    // 修复地图实际中心点和显示中心点不匹配的偏移
    this.map.panBy(0,-80)
  }
}
