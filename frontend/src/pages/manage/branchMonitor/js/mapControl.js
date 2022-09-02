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
import $ from "../../../../../other_modules/jquery&ui/jquery&ui";

const B = new AMap.Icon({
  image: require('../images/point_icon_b.png'),
  size: new AMap.Size(35, 40),
  imageSize: new AMap.Size(35, 40)
})
const B_plus = new AMap.Icon({
  image: require('../images/point_icon_b+.png'),
  size: new AMap.Size(35, 40),
  imageSize: new AMap.Size(35, 40)
})
const B_disabled = new AMap.Icon({
  image: require('../images/point_icon_b_disabled.png'),
  size: new AMap.Size(35, 40),
  imageSize: new AMap.Size(35, 40)
})
const B_plus_disabled = new AMap.Icon({
  image: require('../images/point_icon_b+_disabled.png'),
  size: new AMap.Size(35, 40),
  imageSize: new AMap.Size(35, 40)
})

export default {
  map: null,

  layer: new window.AMap.TileLayer(),
  layer_satellite: new window.AMap.TileLayer.Satellite(),

  layerBase: null,

  layerBranches: null,
  heatmap: null,

  center: [108.9948437500, 34.2856130412],

  initMap (elem) {
    return new Promise((resolve => {

      this.map = new AMap.Map(elem, {
        center: this.center,
        resizeEnable: true,
        layers: [this.layer],
        zoom: 5
      });

      this.map.on('complete', function () {
        resolve()
      })
    }))
  },

  setCity (name) {
    this.map.setCity(name)
  },

  drawBranches (branches) {

    if (this.map) this.map.remove(this.map.getAllOverlays());

    branches.forEach(item => {
      let icon = B
      if (item.biz_type === '1') icon = B_plus
      if (item.car_cnt === 0) {
        icon = B_disabled
        if (item.biz_type === '1') icon = B_plus_disabled
      }
      let marker = new AMap.Marker({
        icon: icon,
        title: item.name + '(' + item.id + ')',
        position: [item.lng, item.lat],
        map: this.map
      })

      if (item.car_cnt > 0) {
        let content = '<div class="desc">' + item.car_cnt + '</div>';
        new AMap.Marker({
          content: content,
          position: [item.lng, item.lat],
          offset: new AMap.Pixel(10, -30),
          map: this.map,
          zIndex: 300
        });
      }
    })

    let that = this
    setTimeout(function () {
      that.map.setZoom(11)
    }, 800)
  },

  setLayer (type) {
    if (type === '1') {
      this.map.setLayers([this.layer])
    } else {
      this.map.setLayers([this.layer_satellite])
    }
  },

  drawHot (data) {
    if (this.heatmap) {
      this.heatmap.setDataSet({
        data: data.branch,
        max: 7
      })
    } else {
      let that = this
      this.map.plugin(["AMap.Heatmap"], function () {
        that.heatmap = new AMap.Heatmap(that.map, {
          radius: 25, //给定半径
          opacity: [0, 0.9],
          zIndex: 400
        });
        that.heatmap.setDataSet({
          data: data.branch,
          max: 7
        });
      });
    }
  },

  hideBranches () {
    if (this.layerBranches) this.layerBranches.hide()
  }
}
