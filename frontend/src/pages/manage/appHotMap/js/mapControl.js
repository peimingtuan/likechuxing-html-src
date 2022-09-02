import store from "../../netMap/js/store";

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
const HOT_LEVEL_COLOR = {
  1.0: 'red',
  0.9: '#ffea00',
  0.7: 'rgb(0, 255, 0)',
  0.65: 'rgb(117,211,248)',
  0.5: 'blue'
};

export default {
  map: null,
  PointSimplifier: null,

  layerBranches: null,

  heatmap: null,

  center: [113.251288, 23.139916],

  initMap (elem) {
    return new Promise((resolve => {

      this.map = new AMap.Map(elem, {
        center: this.center,
        resizeEnable: true,
        zoom: 11
      });

      this.map.on('complete', function () {
        resolve()
      })

      let that = this
      window.AMapUI.load(['ui/misc/PointSimplifier'], function (PointSimplifier) {
        that.PointSimplifier = PointSimplifier
      })

      this.map.plugin(["AMap.Heatmap"], function() {
        //初始化heatmap对象
        that.heatmap = new AMap.Heatmap(that.map, {
          radius: 10, //给定半径
          opacity: [0, 0.8],
          gradient:HOT_LEVEL_COLOR
        });

      });
    }))
  },

  setCity (name) {
    this.map.setCity(name)
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
            return [item.branch_lng, item.branch_lat];
          },
          getHoverTitle: function (item) {
            return item.branch_name + (Number(item.biz_type) === 0 ? '_B' : '_B+');
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

      }else{
        console.log('delay')
        setTimeout(this.drawBranches(branches),1000)
      }
    }
  },

  drawHot (points,max) {
    this.heatmap.setDataSet({
      data: points,
      max: max
    });
  }
}
