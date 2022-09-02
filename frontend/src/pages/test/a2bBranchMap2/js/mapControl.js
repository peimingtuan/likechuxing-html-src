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

const level_color={
  '1':'#ff0000',
  '2':'#70b3e6',
  '3':'#1a10ff',
  '4':'#56feb5',
  '5':'#ffa000'
}

export default {
  map: null,
  map_loca:null,
  PointSimplifier: null,
  PathSimplifier:null,
  hotmap:null,
  hotmap_animate:null,

  layerBranches: null,
  layerLines:null,
  navs:[],
  layerLinesIn:null,
  layerLinesOut:null,

  center: [113.264360, 23.129080],
  mapReady: false,
  uiReady:false,
  hotmapReady:false,
  cb:null,

  initMap (elem) {
    return new Promise((resolve => {

      this.map = new AMap.Map(elem, {
        mapStyle: 'amap://styles/whitesmoke',
        center: this.center,
        resizeEnable: true,
        zoom: 12
      });

      this.map_loca = Loca.create(this.map);

      let that = this
      this.map.on('complete', function () {
        this.mapReady = true
        if(that.cb)that.cb()
        resolve()
      })

    }))
  },

  loadUI(){
    this.uiReady =  new Promise((resolve => {

      let that = this

      window.AMapUI.loadUI(['misc/PointSimplifier','misc/PathSimplifier'], function (PointSimplifier,PathSimplifier) {

        that.PointSimplifier = PointSimplifier
        that.PathSimplifier = PathSimplifier

        resolve()
      })

    }))
  },

  loadHotmap(){
    this.hotmapReady = new Promise((resolve => {
      let that = this

      this.map.plugin(["AMap.Heatmap"],function() {      //加载热力图插件
        let opacity = 0.4
        that.hotmap = new AMap.Heatmap(that.map,{
          radius: 25, //给定半径
          opacity: [0, 0.6],
          gradient:{
              0.5: 'rgba(0,0,255,'+opacity+')',
              0.65: 'rgba(117,211,248,'+opacity+')',
              0.7: 'rgba(0, 255, 0,'+opacity+')',
              0.9: 'rgba(255,234,0,'+opacity+')',
              1.0: 'rgba(255,0,0,'+opacity+')'
          }
        });

        that.hotmap_animate = new AMap.Heatmap(that.map,{
          radius: 25, //给定半径
          opacity: [0, 0.6],
          gradient:{
            0.5: 'rgba(0,0,255,'+opacity+')',
            0.65: 'rgba(117,211,248,'+opacity+')',
            0.7: 'rgba(0, 255, 0,'+opacity+')',
            0.9: 'rgba(255,234,0,'+opacity+')',
            1.0: 'rgba(255,0,0,'+opacity+')'
          }
        });
        resolve()
      });

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

  // 海量点画网点
  drawBranches (branches,cb) {
    if (this.layerBranches) {
      this.layerBranches.setData(branches)
      this.layerBranches.show()
    } else {
      this.uiReady.then(()=>{
        this.layerBranches = new this.PointSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:120,

          getPosition: function (item) {
            return [item.lng, item.lat];
          },
          getHoverTitle: function (item) {
            return item.name + (Number(item.biz_type) === 0 ? '_B' : '_B+');
          },
          renderConstructor: this.PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            getGroupId: function (item) {
              return item.biz_type
            },
            groupStyleOptions: function (gid) {
              let style = {
                pointStyle: {
                  width: 6,
                  height: 6,
                },
                pointHardcoreStyle: {
                  width: 2,
                  height: 2
                }
              }

              style.pointStyle.fillStyle =gid===0?'#292929':'#4179d7'

              return style
            },
            //鼠标hover时的title信息
            hoverTitleStyle: {
              position: 'top'
            }
          }
        });

        if(cb){
          this.layerBranches.on('pointClick',function(e,p){
            cb(p.data)
          })
        }

        this.layerBranches.setData(branches);
      })
    }
  },

  drawLines(data){
    if(this.layerLines){
      this.layerLines.setData(data)
      this.layerLines.show()
    }else{
      this.uiReady.then(()=>{

        this.layerLines = new this.PathSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:10,

          getPath:function(pathData) {
            return pathData.path;
          },

          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            //鼠标悬停在节点之间的连线上
            return pathData.begin_branch + ' 到 ' + pathData.end_branch;
          },

          getPosition: function (item) {
            return [item.lng, item.lat];
          },

          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'rgba(0,0,0,0.2)',
              lineWidth: 4,
              dirArrowStyle: true
            },
            pathLineHoverStyle:{
              strokeStyle: 'rgba(0,0,0,1)',
            },
            pathLineSelectedStyle:{
              strokeStyle: 'rgba(0,0,0,1)'
            }
          }
        });

        this.layerLines.setData(data);
      })
    }
  },
  
  drawLinesIn(data){
    if(this.layerLinesIn){
      this.layerLinesIn.setData(data)
      this.layerLinesIn.show()
    }else{
      this.uiReady.then(()=>{

        this.layerLinesIn = new this.PathSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:10,

          getPath:function(pathData) {
            return pathData.path;
          },

          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            //鼠标悬停在节点之间的连线上
            return pathData.begin_branch + ' 到 ' + pathData.end_branch;
          },

          getPosition: function (item) {
            return [item.lng, item.lat];
          },

          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'rgba(0,255,0,0.4)',
              lineWidth: 4,
              dirArrowStyle: true
            },
            pathLineHoverStyle:{
              strokeStyle: 'rgba(0,255,0,1)',
            },
            pathLineSelectedStyle:{
              strokeStyle: 'rgba(0,255,0,1)'
            }
          }
        });

        this.layerLinesIn.setData(data);
      })
    }
  },

  drawLinesOut(data){
    if(this.layerLinesOut){
      this.layerLinesOut.setData(data)
      this.layerLinesOut.show()
    }else{
      this.uiReady.then(()=>{

        this.layerLinesOut = new this.PathSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:10,

          getPath:function(pathData) {
            return pathData.path;
          },

          getHoverTitle: function(pathData, pathIndex, pointIndex) {
            //鼠标悬停在节点之间的连线上
            return pathData.begin_branch + ' 到 ' + pathData.end_branch;
          },

          getPosition: function (item) {
            return [item.lng, item.lat];
          },

          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: 'rgba(255,0,0,0.4)',
              lineWidth: 4,
              dirArrowStyle: true
            },
            pathLineHoverStyle:{
              strokeStyle: 'rgba(255,0,0,1)',
            },
            pathLineSelectedStyle:{
              strokeStyle: 'rgba(255,0,0,1)'
            }
          }
        });

        this.layerLinesOut.setData(data);
      })
    }
  },

  drawHot(data,max){
    this.hotmapReady.then(()=>{
      this.hotmap.setDataSet({
        data,
        max:max
      })
    })
  }
}
