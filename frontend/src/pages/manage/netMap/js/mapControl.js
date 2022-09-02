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
import store from './store'

const STYLE = {
  RECT:{
    fillColor: 'blue',
    fillOpacity: 0.05,
    strokeColor: 'blue',
    strokeWeight: 1,
    strokeOpacity: 0.1,
  },
  AREA_OPACITY:{
    fillOpacity: 0.5,
    strokeOpacity: 0.8,
  }
}

const mapControl = {
  map: null,
  PointSimplifier: null,

  point_marker: null,

  layerRect:null,
  layerRect_filter:null,
  layerArea: null,

  layerBranches: null,

  mouseTool: null,

  remarkRect: null,

  countArea: null,

  center: [108.9948437500, 34.2856130412],

  // 初始化地图
  initMap (elem) {
    return new Promise((resolve => {

      let conf = {
        mapStyle: 'amap://styles/whitesmoke',
        zoom: 5,//级别
        center: this.center
      }

      this.map = new AMap.Map(elem, conf);

      this.map.on('complete', function () {
        resolve()
      })

      let that = this
      window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {
        that.PointSimplifier = PointSimplifier
      })
    }))
  },

  // 设置城市
  setCity (lnglat) {
    //this.map.setCity(name)
    this.map.setZoomAndCenter(11, lnglat)
  },

  // 查看单个网点（挪视角，显示网点图标）
  viewPoint (point) {
    this.hidePoint()

    this.point_marker = new AMap.Marker({
      map: this.map,
      position: [point.lng, point.lat]
    })
    this.map.setZoomAndCenter(15, [point.lng, point.lat])
  },

  // 隐藏网点的图标
  hidePoint () {
    if (this.point_marker) this.point_marker.setMap(null)
  },

  // 海量点画网点
  drawBranches (branches) {
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
                    fillStyle: '#524bd7'
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

      }
    }
    this.layerBranches.on('pointClick',function(e,res){
      store.commit('setCurrentBranch',res.data)
    })
  },
  hideBranches () {
    if(this.layerBranches) this.layerBranches.hide()
  },
  showBranches(){
    if(this.layerBranches) this.layerBranches.show()
  },

  // 画方格
  drawRects (rects) {
    return new Promise(resolve => {
      let that = this
      setTimeout(function () {

        if(that.layerRect){
          that.layerRect.setMap(null)
          that.layerRect = null
        }

        that.layerRect = new AMap.OverlayGroup(rects.map(item => {
          return new AMap.Rectangle(Object.assign({
            zIndex:100,
            map: that.map,
            bounds: new AMap.Bounds([item.southWest.lng,item.southWest.lat], [item.northEast.lng,item.northEast.lat]),
            extData: item
          },STYLE.RECT))
        }))

        resolve()
      }, 0)
    })
  },
  rectsStrong(type){
    console.log(type)

    if(this.layerRect_filter){
      this.layerRect_filter.setMap(null)
      this.layerRect_filter = null
    }
    let rects = []
    switch (type){
      case 1:
        rects = store.state.rects.filter(rect=>rect.branches.length===0)
        break;
      case 2:
        rects = store.state.rects.filter(rect=>rect.branches.length>0)
        break;
      default:
        rects = []
    }

    if(rects.length > 0){
      this.layerRect_filter = new AMap.OverlayGroup(rects.map(item => {
        return new AMap.Rectangle({
          zIndex:-1,
          map: this.map,
          bounds: new AMap.Bounds([item.southWest.lng,item.southWest.lat], [item.northEast.lng,item.northEast.lat]),
          fillColor: 'blue',
          fillOpacity: 0.3,
          strokeColor: 'blue',
          strokeWeight: 1,
          strokeOpacity: 0.8
        })
      }))
    }

  },
  showRect(){
    this.layerRect.show()
  },
  hideRect(){
    this.layerRect.hide()
  },

  // 在rects上更改marker的style
  drawArea(){
    if(!this.layerRect){
      console.warn('mapControl.drawArea2未检测到layerRect')
      return
    }

    if(this.layerArea){
      this.layerArea.setMap(null)
      this.layerArea = null
    }

    let areas = []
    this.layerRect.eachOverlay(overlay=>{
      let data = overlay.getExtData()

      if(data.area_id){
        let color = data.getColor()
        overlay.setOptions(Object.assign({
          fillColor: color[0],
          strokeColor: color[1],
        },STYLE.AREA_OPACITY))

        overlay.on('click',this._areaClick)

        areas.push(overlay)
      }
    })

    this.layerArea = new AMap.OverlayGroup(areas)
  },

  // 片区点击
  _areaClick(e){
    let data = e.target.getExtData()
    store.commit('setAreaId',data.area_id)
  },

  // 隐藏片区
  hideArea () {
    if(!this.layerArea){
      console.warn('hideArea为找到layerArea',this.layerArea)
      return
    }

    this.layerArea.hide()

  },
  hideAreaExclude(id){
    if(!this.layerArea){
      console.warn('hideArea为找到layerArea',this.layerArea)
      return
    }

    this.layerArea.eachOverlay(overlay=>{
      let data = overlay.getExtData()
      if(data.area_id !== id){
        overlay.hide()
      }else{
        data.is_active = true
      }
    })
  },
  showArea(){
    if(!this.layerArea){
      console.warn('showArea为找到layerArea',this.layerArea)
      return
    }

    this.layerArea.show()
  },
  clearArea (){
    if (this.layerArea) {
      this.layerArea.eachOverlay(overlay=>{
        overlay.off('click',this._areaClick)
        overlay.setOptions(STYLE.RECT)
      })

      this.layerArea = null
    }
  },

  startMouseTool () {
    if (!this.mouseTool) {
      this.mouseTool = new AMap.MouseTool(this.map);

      let that = this
      this.mouseTool.on('draw', function ({type, obj}) {
        let bounds = obj.getBounds()
        obj.setMap(null)
        that.layerRect.eachOverlay(item => {
          let bounds_rect = item.getBounds()
          let sw = bounds_rect.getSouthWest()
          let ne = bounds_rect.getNorthEast()
          let points = [
            bounds_rect.getCenter(),
            [sw.lng, sw.lat],
            [sw.lng, ne.lat],
            [ne.lng, sw.lat],
            [ne.lng, ne.lat]
          ]
          if (points.some(point=>bounds.contains(point))) {
            that.toggleRect({
              target: item
            })
          }
        })

      })
    }

    this.mouseTool.rectangle({
      map: this.map
    })

  },
  endMouseTool () {
    this.mouseTool.close()
  },
  // 方格选中
  startRectClick () {
    if (!this.layerRect) {
      return
    }

    this.layerRect.on('click', this.toggleRect)
  },
  endRectClick () {
    this.layerRect.off('click', this.toggleRect)
  },

  toggleRect (obj) {
    let rect = obj.target
    let data = rect.getExtData()

    if (!data.is_active) {
      data.is_active = true
      rect.setOptions({
        fillColor: store.state.color_body,
        fillOpacity: 0.5,
        strokeColor: store.state.color_border,
        strokeOpacity:0.8
      })
    } else {
      data.is_active = false
      rect.setOptions({
        fillColor: 'blue',
        fillOpacity: 0.05,
        strokeColor: 'blue',
        strokeOpacity:0.1
      })
    }

    rect.setExtData(data)
  },
  clearEditArea () {
    this.layerRect.eachOverlay(item => {
      let data = item.getExtData()
      if(data.is_active && !data.area_id){
        data.is_active = false
        item.setOptions(STYLE.RECT)
      }
    })
  },
  updateColor () {
    this.layerRect.eachOverlay(item => {
      let data = item.getExtData()
      if (data.is_active) {
        item.setOptions(Object.assign({
          fillColor: store.state.color_body,
          strokeColor: store.state.color_border,
        },STYLE.AREA_OPACITY))
      }
    })
  },
  getActiveRects(){
    let rects = []
    this.layerRect.eachOverlay(item => {
      let data = item.getExtData()
      if (data.is_active) {
        data.is_active = false
        rects.push(data)
      }
    })
    return rects
  },

  startRemark(){
    if (!this.layerRect) {
      return
    }

    this.layerRect.on('rightclick', this._rectRightClick)
  },
  _rectRightClick(obj){
    let rect = obj.target
    let strokeWeight = rect.getOptions().strokeWeight

    if(strokeWeight !== 3){
      // 如果选中的不是当前选中的方块，则清除上次选中的，然后显示这次选中
      if(mapControl.remarkRect){
        mapControl.remarkRect.setOptions({
          strokeWeight:1,
          fillOpacity: 0.05,
        })
      }

      mapControl.remarkRect = rect
      store.commit('setRemarkRectId',mapControl.remarkRect.getExtData().id)

      mapControl.remarkRect.setOptions({
        strokeWeight:3,
        fillOpacity: 0.2,
      })
    }else{
      // 如果选中的是上次选中的，清除掉
      mapControl.clearRemarkRect()
    }
  },
  clearRemarkRect(){
    store.commit('setRemarkRectId',0)
    mapControl.remarkRect.setOptions({
      strokeWeight:1,
      fillOpacity: 0.05,
    })
  },
  endRemark(){
    this.layerRect.off('rightclick', this._rectRightClick)
  },

  showCountArea(path){
    if(this.countArea){
      this.countArea.setPath(path)
    }else{
      this.countArea = new AMap.Polygon({
        map:this.map,
        path,
        strokeWeight:2,
        strokeColor:'#111',
        strokeOpacity:0.6,
        fillColor:'#333',
        fillOpacity:0.1
      })
    }

  },
  hideCountArea(){
    if(this.countArea){
      this.countArea.setMap(null)
      this.countArea = null
    }
  }
}

export {
  mapControl
}