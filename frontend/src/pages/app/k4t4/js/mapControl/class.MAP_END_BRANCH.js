/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: class.MAP_END_BRANCH
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/6/1-下午7:01
 Description:
 Param:
 Return:
 *************************************************/
import MAP_BASE from "./class.MAP_BASE";
import Address from "../class/Address";
import POI from "../class/POI";
import Branch from "../class/Branch";

export default class MAP_END_BRANCH extends MAP_BASE {
  constructor() {
    super()
  }

  drawBranch({list,active_branch,marker_click}) {
    let that = this
    super.drawBranch({
      list,
      active_branch,
      marker_click: function (active_branch) {
        marker_click(active_branch)
        that.drawBranch({list,active_branch,marker_click})
      },
      hide_cnt:true
    })
  }

  search(keyword, callback) {
    // return Array with Address
    AMap.service(["AMap.PlaceSearch"], function () {
      let placeSearch = new AMap.PlaceSearch({ //构造地点查询类
        pageSize: 10,
        pageIndex: 1
      });
      //关键字查询
      placeSearch.search(keyword, function (status, result) {
        if (status === 'complete') {
          callback(result.poiList.pois.map(item => new Address({
            lat: item.location.lat,
            lng: item.location.lng,
            name: item.name,
            address: item.address
          })))
        } else {
          callback([])
        }
      });
    });
  }

  // 绑定dragend事件
  onDragend(cb) {
    // flag大头针扎在正中的位置
    this.map.on('dragend', () => {
      let center = this.map.getCenter()
      cb(new POI(center.lng, center.lat))
    })
  }
}
