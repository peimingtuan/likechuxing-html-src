/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mapControl
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/2-下午5:34
 Description:
 Param:
 Return:
 *************************************************/
import {bounds} from '../data'

const getBoundsByPoi = function(center){

  let sw_lng = bounds.southWest.lng + Math.floor((center[0]-bounds.southWest.lng)/bounds.step.lng)*bounds.step.lng
  let sw_lat = bounds.southWest.lat + Math.floor((center[1]-bounds.southWest.lat)/bounds.step.lat)*bounds.step.lat
  let ne_lng = bounds.southWest.lng + Math.ceil((center[0]-bounds.southWest.lng)/bounds.step.lng)*bounds.step.lng
  let ne_lat = bounds.southWest.lat + Math.ceil((center[1]-bounds.southWest.lat)/bounds.step.lat)*bounds.step.lat

  return new AMap.Bounds([sw_lng,sw_lat],[ne_lng,ne_lat])
}

export default {
  map: null,
  PointSimplifier: null,

  layerBranches: null,
  layerBranchesTop:null,

  layerLine2:null,
  layerLine3:null,

  layerRects:null,

  layerGridBind:null,
  layerGridBindB:null,
  layerArea:null,

  center: [104.07074, 30.650909],
  mapReady: false,
  cb:null,

  initMap (elem) {
    return new Promise((resolve => {

      this.map = new AMap.Map(elem, {
        mapStyle: 'amap://styles/whitesmoke',
        center: this.center,
        resizeEnable: true,
        zoom: 11
      });

      let that = this
      this.map.on('complete', function () {
        this.mapReady = true
        if(that.cb)that.cb()
        resolve()
      })

      window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {
        that.PointSimplifier = PointSimplifier
      })

    }))
  },

  ready(cb){
    if(this.mapReady){
      cb()
    }else{
      this.cb = cb
    }
  },

  setCity (name) {
    this.map.setCity(name)
  },

  drawLine(type,array){
    let opt = {
      map:this.map,
      path:array,
      fillColor:null,
      strokeColor:'green',
      strokeOpacity:0.7,
      strokeWeight:5
    }

    if(type===2){
      if(this.layerLine2){
        this.layerLine2.show()
      }else{
        this.layerLine2 = new AMap.Polygon(opt)
      }
    }else{
      if(this.layerLine3){
        this.layerLine3.show()
      }else{
        this.layerLine3 = new AMap.Polygon(opt)
      }
    }
  },
  hideLine(type){
    switch (Number(type)){
      case 2:
        this.layerLine2.hide();
        break;
      case 3:
        this.layerLine3.hide();
        break;
    }
  },

  // 海量点画网点
  drawBranches (branches) {

    let top=[]
    let other=[]
    branches.forEach(item=>{
      if(item.rank>0){
        top.push(item)
      }else{
        other.push(item)
      }
    })

    this.drawBranchesTop(top)
    this.drawBranchesOther(branches)

  },

  drawBranchesTop (branches) {
    if(this.layerBranchesTop){
      let ids = branches.map(item=>item.id)
      this.layerBranchesTop.eachOverlay(layer=>{
        let id=layer.getExtData().id
        if(ids.includes(id)){
          layer.show()
        }else{
          layer.hide()
        }
      })
    }else{
      this.layerBranchesTop = new AMap.OverlayGroup(branches.map(item=>{
        let className= Number(item.biz_type)===0?'map_icon b':'map_icon b_plus'

        return new AMap.Marker({
          map:this.map,
          offset:new AMap.Pixel(0,-20),
          topWhenClick:true,
          title:item.name + (Number(item.biz_type) === 0 ? '_B' : '_B+'),
          position:[item.lng,item.lat],
          content:'<div class="'+className+'">'+item.rank+'</div>',
          extData:item,
          zIndex:10
        })
      }))
    }
  },

  drawBranchesOther (branches) {
    if (this.layerBranches) {
      this.layerBranches.setData(branches)
      this.layerBranches.show()
    } else {
      if (this.PointSimplifier) {
        this.layerBranches = new this.PointSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:0,

          getPosition: function (item) {
            return [item.lng, item.lat];
          },
          getHoverTitle: function (item) {
            return item.name + (Number(item.biz_type) === 0 ? '_B' : '_B+');
          },
          renderConstructor: this.PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            getGroupId: function (item) {
              return Number(item.biz_type)
            },
            groupStyleOptions: function (gid) {
              if (gid === 0) {
                return {
                  // B类网点
                  pointStyle: {
                    width: 6,
                    height: 6,
                    fillStyle: '#292929'
                  },
                  pointHardcoreStyle: {
                    width: 2,
                    height: 2
                  }
                }
              } else {
                return {
                  // B+类网点
                  pointStyle: {
                    width: 6,
                    height: 6,
                    fillStyle: '#4179d7'
                  },
                  pointHardcoreStyle: {
                    width: 2,
                    height: 2
                  }
                }
              }
            },
            //鼠标hover时的title信息
            hoverTitleStyle: {
              position: 'top'
            }
          }
        });

        this.layerBranches.setData(branches);

      }else{
        console.log('delay')
        setTimeout(this.drawBranches(branches),1000)
      }
    }
  },

  drawRects(lines){
    if(this.layerRects){
      this.layerRects.show()
    }else{
      this.layerRects = new AMap.OverlayGroup(lines.map(line=>{
        return new AMap.Polyline({
          map:this.map,
          path:line,
          strokeColor:'blue',
          strokeOpacity:0.5,
          strokeWeight:1
        })
      }))
    }
  },

  hideRects(){
    this.layerRects.hide()
  },

  drawGridBind(branches){
    let _temp = []
    let _branches = branches.map(item=>{
      item.bounds = getBoundsByPoi([item.lng,item.lat])
      return item
    }).filter(item=>{
      let center = item.bounds.getCenter()
      let k = center.lng+','+center.lat
      if(_temp.includes(k)){
        return false
      }else{
        _temp.push(k)
        return true
      }
    })


    this.layerGridBind = new AMap.OverlayGroup(_branches.map(item=>{
      return new AMap.Rectangle({
        map:this.map,
        bounds:item.bounds,
        fillColor:'blue',
        fillOpacity:0.3,
        strokeColor:'blue',
        strokeOpacity:0.6,
        strokeWeight:1,
        zIndex:1
      })
    }))
  },

  hideGridBind(){
    this.layerGridBind.setMap(null)
  },

  drawGridBindB(branches){
    let _temp = []
    let _branches = branches.map(item=>{
      item.bounds = getBoundsByPoi([item.lng,item.lat])
      return item
    }).filter(item=>{
      let center = item.bounds.getCenter()
      let k = center.lng+','+center.lat
      if(_temp.includes(k)){
        return false
      }else{
        _temp.push(k)
        return true
      }
    })


    this.layerGridBindB = new AMap.OverlayGroup(_branches.map(item=>{
      return new AMap.Rectangle({
        map:this.map,
        bounds:item.bounds,
        fillColor:'black',
        fillOpacity:0.3,
        strokeColor:'black',
        strokeOpacity:0.6,
        strokeWeight:1,
        zIndex:1
      })
    }))
  },

  hideGridBindB(){
    this.layerGridBindB.setMap(null)
  },

  drawArea(branches){
    this.layerArea = new AMap.OverlayGroup(branches.map(item=>{
      return new AMap.Circle({
        map:this.map,
        center:[item.lng,item.lat],
        radius:500,
        fillColor:'red',
        fillOpacity:0.05,
        strokeColor:'red',
        strokeOpacity:0.6,
        strokeWeight:1,
        zIndex:1
      })
    }))
  },
  hideArea(){
    this.layerArea.setMap(null)
  }
}
