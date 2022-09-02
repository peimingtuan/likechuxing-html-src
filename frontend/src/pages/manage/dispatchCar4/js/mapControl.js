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

const getLightColor = function (color) {
  let rad = 0.5

  let _color = color.replace('#', '')

  let rgb = [_color.substr(0, 2), _color.substr(2, 2), _color.substr(4, 2)]

  return '#' + rgb.map(item => {
    /*
     * 1、16进制转10进制
     * 2、255-10进制(反色)
     * 3、乘以变浅系数
     * 4、再次反色恢复
     * 5、转回16进制
     */
    let color_temp = Math.floor(255 - (255 - parseInt(item, 16)) * rad).toString(16)
    return color_temp.length > 1 ? color_temp : '0' + color_temp
  }).join('')

}

const COLOR_SUPPLY = ['#fff135', '#c9da2e', '#93c326', '#5eac1f', '#269617']
const COLOR_SUPPLY_LIGHT = COLOR_SUPPLY.map(item => getLightColor(item))

const COLOR_NEED = ['#fff135', '#feb72f', '#fd7f28', '#fc4521', '#fd0c1b']
const COLOR_NEED_LIGHT = COLOR_NEED.map(item => getLightColor(item))

export default {
  map: null,
  PointSimplifier: null,

  layerBase: null,

  layerBranches: null,

  center: [108.9948437500, 34.2856130412],

  initMap (elem) {
    return new Promise((resolve => {

      this.map = new AMap.Map(elem, {
        mapStyle: 'amap://styles/whitesmoke',
        zoom: 5,//级别
        center: this.center
      });

      this.map.on('complete', function () {
        resolve()
      })
    }))
  },

  setCity (center) {
    this.map.setZoomAndCenter(12, center)
  },

  getStep (center) {
    let circle = new AMap.Circle({
      center,
      radius: 250
    })
    let bounds = circle.getBounds()
    let southWest = bounds.getSouthWest()
    let northEast = bounds.getNorthEast()
    let lng_diff = northEast.lng - southWest.lng
    let lat_diff = northEast.lat - southWest.lat
    return {
      lng_diff,
      lat_diff,
      lng_diff_half: lng_diff / 2,
      lat_diff_half: lat_diff / 2
    }
  },

  _getSupplyColor (item, max) {
    let index = Math.round(item * 4 / max)
    return COLOR_SUPPLY[index]
  },

  _getNeedColor (item, max) {
    let index = Math.round(item * 4 / max)
    return COLOR_NEED[index]
  },

  drawArea (area, type) {
    if (this.layerBase) {
      this.layerBase.setMap(null)
    }

    this.layerBase = new AMap.OverlayGroup(area.area.map(item => {
      let color = '#57b0f4'

      switch (type) {
        case 2:
          color = this._getNeedColor(item.need, area.max_need)
          break;
        case 1:
          color = this._getSupplyColor(item.supply, area.max_supply)
          break;
        default:
          if (item.diff >= 0) {
            color = this._getSupplyColor(item.diff, area.max_supply)
          } else {
            color = this._getNeedColor(-item.diff, area.max_need)
          }
      }

      let marker = new AMap.Rectangle({
        map: this.map,
        bounds: item.bounds,
        fillColor: color,
        fillOpacity: 0.6,
        strokeColor: '#333',
        strokeWeight: 1,
        strokeOpacity: 0.1,
      })

      marker.on('mouseover', function () {
        store.commit('setCurrentRect', item)
        marker.setOptions({
          strokeOpacity: 0.8
        })
      })

      marker.on('mouseout', function () {
        store.commit('setCurrentRect', null)
        marker.setOptions({
          strokeOpacity: 0.1
        })
      })

      return marker

    }))
  },

  drawBranches (branches) {
    if (this.layerBranches) {
      this.layerBranches.setData(branches)
      this.layerBranches.show()
    } else {
      let that = this
      window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {
        that.PointSimplifier = PointSimplifier

        that.layerBranches = new PointSimplifier({
          map: that.map, //所属的地图实例
          autoSetFitView: false,

          getPosition: function (item) {
            return [item.lng, item.lat];
          },
          getHoverTitle: function (item) {
            return item.name + '(' + item.car.length + ')';
          },
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
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

        that.layerBranches.setData(branches);
      });
    }
  },

  hideBranches () {
    if (this.layerBranches) this.layerBranches.hide()
  }
}
