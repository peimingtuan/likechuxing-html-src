/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: POI
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/8-下午5:26
 Description:表示一个位置点，只有经纬度
 Param:
 Return:
 *************************************************/
import coordtransform from 'coordtransform'

// 常用坐标系的列表，第一项为默认坐标系（gcj02）
const GPS_TYPE = [
  'gcj02',
  'wgs84',
  'bd09'
]

// 东北角纬度、经度   西南角纬度、经度
const CHINA_INCLUDE_RECTANGLE = [
  // 新疆北部
  [49.220400, 79.446200, 42.889900, 96.330000],
  // 东北大部
  [53.750601,131.465394 , 39.62498,110.658149 ],
  // 佳木斯以东地区
  [48.518722,135.178722,44.787913,131.465394],
  // 中部大部
  [42.889900, 77.940003, 29.529700, 124.193255],
  // 新疆和田西部地区
  [41.32147,77.940003,35.418413,73.398017],
  // 西藏南部
  [29.529700, 82.968400, 26.718600, 97.035200],
  // 长江以南大部
  [29.529700, 97.025300, 20.414096, 124.367395],
  // 海南岛及南沙诸岛
  [20.414096, 120.215394, 3.955004, 108.26313]
]

const CHINA_EXCLUDE_RECTANGLE = [
  // 越南北部，云南广西边境一带
  [22.284000, 101.865200, 20.414096, 106.665000],
  // 新疆北部以东，蒙古地区
  [49.220400,96.330000,45.249979,91.102485],
  // 呼伦贝尔以西，俄罗斯境内
  [53.750601, 110.658149, 50.325700, 119.127000],
  // 呼和浩特以北蒙古地区
  [50.325700,115.491272,45.546978,110.658149],
  // 大兴安岭以东，俄罗斯境内
  [53.750601,131.465394,49.919764,127.62104],
  // 牡丹江市以南的朝鲜地区
  [42.002701,131.465394,39.62498,128.357124],
  // 丹东以东朝鲜地区
  [40.841168,128.357124,39.62498,125.76435],
]

export default class POI {
  constructor (lng, lat, type) {
    // 默认是第一项：gcj02
    if (GPS_TYPE.indexOf(type) === -1) type = GPS_TYPE[0]

    let lng_base = this._formatNum(lng)
    let lat_base = this._formatNum(lat)

    switch (type) {
      case 'gcj02':
        this.lng = lng_base
        this.lat = lat_base
        break;

      case 'wgs84':
        let wgs84 = coordtransform.wgs84togcj02(lng_base, lat_base)
        this.lng = this._formatNum(wgs84[0])
        this.lat = this._formatNum(wgs84[1])
        break;

      case 'bd09':
        let bd09 = coordtransform.bd09togcj02(lng_base, lat_base)
        this.lng = this._formatNum(bd09[0])
        this.lat = this._formatNum(bd09[1])
    }
  }

  // 返回的数据最多保留小数点后6位
  _formatNum (num) {
    let _num = Number(num)
    return Math.round(_num * 1000000) / 1000000
  }

  getLngLat (type) {
    if (GPS_TYPE.indexOf(type) === -1) type = GPS_TYPE[0]

    switch (type) {
      case 'gcj02':
        return [this.lng, this.lat]

      case 'wgs84':
        let wgs84 = coordtransform.gcj02towgs84(this.lng, this.lat)
        return [this._formatNum(wgs84[0]), this._formatNum(wgs84[1])]

      case 'bd09':
        let bd09 = coordtransform.gcj02tobd09(this.lng, this.lat)
        return [this._formatNum(bd09[0]), this._formatNum(bd09[1])]
    }
  }

  inChina () {
    /*
     *  该快速算法来源于诺基亚，将地图划分成若干包含和排除的
     *  矩形块，判断点是否在包含块且不再排除块中。基于原始的
     *  数据以gcj02坐标系为准细化并增加了部分矩形区域的经纬
     *  度，涵盖南沙诸岛、台湾省及钓鱼岛。范围示意图请见"中
     *  国经纬度范围.png"
     */
    let isInclude = CHINA_INCLUDE_RECTANGLE.some(item=>{
      return this.lng <= item[1] && this.lng >= item[3] && this.lat <= item[0] && this.lat >= item[2]
    })

    let isExclude = CHINA_EXCLUDE_RECTANGLE.some(item=>{
      return this.lng <= item[1] && this.lng >= item[3] && this.lat <= item[0] && this.lat >= item[2]
    })

    return isInclude && !isExclude
  }
}
