

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
import {level_color}from '../data'

export default {
  map: null,
  PointSimplifier: null,

  layerBranches: null,
  layerBranchesGo:null,

  layerRects:null,

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

  // 海量点画网点
  drawBranches (branches) {
    console.log('立刻网点：'+branches.length)

    if (this.layerBranches) {
      this.layerBranches.setData(branches)
      this.layerBranches.show()
    } else {
      if (this.PointSimplifier) {
        this.layerBranches = new this.PointSimplifier({
          map: this.map, //所属的地图实例
          autoSetFitView: false,
          zIndex:200,

          getPosition: function (item) {
            return [item.lng, item.lat];
          },
          getHoverTitle: function (item) {
            return item.name + (Number(item.biz_type) === 0 ? '_B' : '_B+');
          },
          renderConstructor: this.PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            eventSupport:true,
            getGroupId: function (item) {
              return item.level+'_'+item.biz_type
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

              let gid_arr = gid.split('_')
              let level = gid_arr[0]
              let biz_type = gid_arr[1]

              style.pointStyle.fillStyle =level_color[level]
              if(biz_type === '1')style.pointStyle.content='rect'

              return style
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

  drawBranchesGo (branches) {
    console.log('gofun网点：'+branches.length)
    if (this.layerBranchesGo) {
      this.layerBranchesGo.setData(branches)
      this.layerBranchesGo.show()
    } else {
      this.layerBranchesGo = new this.PointSimplifier({
        map: this.map, //所属的地图实例
        autoSetFitView: false,
        zIndex:200,

        getPosition: function (item) {
          return [item.lng, item.lat];
        },
        getHoverTitle: function (item) {
          return item.name;
        },
        renderOptions: {
          pointStyle: {
            width: 4,
            height: 4,
            fillStyle: 'green'
          },
          pointHardcoreStyle: {
            width: 2,
            height: 2
          },
          //鼠标hover时的title信息
          hoverTitleStyle: {
            position: 'top'
          }
        }
      });

      this.layerBranchesGo.setData(branches);
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
          strokeOpacity:0.7,
          strokeWeight:1
        })
      }))
    }
  },

  hideRects(){
    this.layerRects.hide()
  }
}
