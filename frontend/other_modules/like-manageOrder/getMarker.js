/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: markerCreater
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-22-11:29
 * Description:返回高德地图的marker遮罩物
 *
 * @param {param1} some description
 *
 *************************************************/


const markerConfig = {
  branch:{
    offset:new AMap.Pixel(-20, -40),
    size: new AMap.Size(40, 47),
    imageSize: new AMap.Size(40, 47),

    offset_large:new AMap.Pixel(-30, -60),
    size_large: new AMap.Size(60, 70),
    imageSize_large: new AMap.Size(60, 70)
  },

  // 网点右上角车辆数
  branchNum:{
    contentTemplate:'<div class="likeMap-branchNum">$num$</div>',
    offset:new AMap.Pixel(1, -46),

    contentTemplate_large:'<div class="likeMap-branchNum active">$num$</div>',
    offset_large:new AMap.Pixel(6, -67)
  }
}

window.AMap.Pixel.prototype.translate = function(rate){
  let x = Math.floor(this.x * rate)
  let y = Math.floor(this.y * rate)

  return new AMap.Pixel(x,y)
}
window.AMap.Size.prototype.translate = function(rate){
  let width = Math.floor(this.width*rate)
  let height = Math.floor(this.height*rate)

  return new AMap.Size(width,height)
}


// zoomIn
window.AMap.Marker.prototype.zoomIn = function (rate) {
  let zoomIn_rate = rate || 3 / 2

  this.is_zoomIn = true

  let offset = this.getOffset()
  this.setOffset(offset.translate(zoomIn_rate))

  let icon = this.getIcon()
  if(icon){
    let icon_new = new AMap.Icon({
      image: icon.B.image,
      size: icon.B.size.translate(zoomIn_rate),
      imageSize: icon.B.imageSize.translate(zoomIn_rate)
    })
    this.setIcon(icon_new)
  }

}

// zoomOut
window.AMap.Marker.prototype.zoomOut = function (rate) {
  let zoomOut_rate = rate || 2 / 3

  this.is_zoomIn = false

  let offset = this.getOffset()
  this.setOffset(offset.translate(zoomOut_rate))

  let icon = this.getIcon()
  if(icon){
    let icon_new = new AMap.Icon({
      image: icon.B.image,
      size: icon.B.size.translate(zoomOut_rate),
      imageSize: icon.B.imageSize.translate(zoomOut_rate)
    })
    this.setIcon(icon_new)
  }
}

function getMarker({type, poi, map,extData,content}) {
  if (!window.AMap) throw new Error('You need import AMap JSSDK first!')

  switch (type) {

    // 大头针
    case "pin":
      return new AMap.Marker({
        position: poi,
        map: map,
        offset: new AMap.Pixel(-10, -40),
        icon: new AMap.Icon({
          image: require('./images/Map/center_poi.png'),
          size: new AMap.Size(20, 40),
          imageSize: new AMap.Size(20, 40)
        }),
        extData:extData
      });

    // 定位小蓝点
    case "user":
      return new AMap.Marker({
        position: poi,
        map: map,
        offset: new AMap.Pixel(-10, -10),
        icon: new AMap.Icon({
          image: require('./images/Map/user_poi.png'),
          size: new AMap.Size(20, 20),
          imageSize: new AMap.Size(20, 20)
        }),
        extData:extData
      });

    case "branch_b":
      return new AMap.Marker({
        position: poi,
        map: map,
        offset: markerConfig.branch.offset,
        icon: new AMap.Icon({
          image: require('./images/Map/branch_b.png'),
          size: markerConfig.branch.size,
          imageSize: markerConfig.branch.imageSize
        }),
        extData:extData
      });

    case "branch_b+":
      return new AMap.Marker({
        position: poi,
        map: map,
        offset: markerConfig.branch.offset,
        icon: new AMap.Icon({
          image: require('./images/Map/branch_b+.png'),
          size: markerConfig.branch.size,
          imageSize: markerConfig.branch.imageSize
        }),
        extData:extData
      });

    case "branchNum":
      return new AMap.Marker({
        position: poi,
        map: map,
        offset: markerConfig.branchNum.offset,
        content:content,
        extData:extData
      });

    // 高德默认
    default:
      return new AMap.Marker({
        position: poi,
        map: map,
        extData:extData
      })
  }
}

export {
  getMarker,
  markerConfig
} 