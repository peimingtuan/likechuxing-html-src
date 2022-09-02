/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: area.class.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/8/2-下午7:28
 Description:
 Param:
 Return:
 *************************************************/
const STEP_LNG = 0.004889840964512324
const STEP_LAT = 0.004496608029593652

const AREA_BOUNDS = {
  northEast: [113.50259363858036, 23.310367713154177],
  southWest: [113.17986413492277, 22.9776187189642]
}

export default class Area {
  constructor (){
    // 二维阵列
    this.rects = this._createArea()
    // 行数
    this.rows = this.rects.length
    // 列数
    this.columns = this.rects[0].length
  }

  // 生成网格，存入二维数组以简化计算
  _createArea(){
    let arr = []
    let id = 0
    for(let lat = AREA_BOUNDS.northEast[1];lat>=AREA_BOUNDS.southWest[1];lat-=STEP_LAT){
      let row = []
      for(let lng = AREA_BOUNDS.southWest[0];lng<=AREA_BOUNDS.northEast[0];lng+=STEP_LNG){
        id++
        row.push({
          id,
          lnglat:[lng,lat],
          supply:null,
          need:null,
          all:null
        })
      }
      arr.push(row)
    }
    return arr
  }

  // 通过经纬度计算某点在阵列中的位置，返回{行数索引，列数索引}
  _getCoord(lng,lat){
    // 计算的点不是区域边界，而是中心，所以结果需要加上0.5个单位进行修正
    let row_index = Math.floor((AREA_BOUNDS.northEast[1] - lat)/STEP_LAT+0.5)
    let column_index = Math.floor((lng - AREA_BOUNDS.southWest[0])/STEP_LNG+0.5)

    // 由于索引最大值 = length - 1 所以此处严格小于判断即可
    if(row_index >= 0 && row_index < this.rows && column_index >= 0 && column_index < this.columns){
      return {
        row_index,
        column_index
      }
    }else{
      return false
    }
  }

  addData(data){
    let coord = this._getCoord(data.lng,data.lat)
    if(coord){
      let area = this.rects[coord.row_index][coord.column_index]
      if(data.hasOwnProperty('supply'))area.supply += Number(data.supply)
      if(data.hasOwnProperty('need'))area.need = Math.round(Number(data.need))
      if(area.supply || area.need)area.all = (area.supply || 0) - (area.need || 0)
    }
  }

  getArea(type){
    let listBase = []
    let listSupply = []
    let listNeed = []

    this.rects.forEach(row=>{
      row.forEach(item=>{
        switch (type){
          case 'supply':
            if(item.supply > 0){
              listSupply.push(item)
            }else{
              listBase.push(item)
            }
            break;
          case 'need':
            if(item.need > 0){
              listNeed.push(item)
            }else{
              listBase.push(item)
            }
            break;
          default:
            // all
            if(item.all !== null){
              if(item.all>=0){
                listSupply.push({
                  id:item.id,
                  lnglat:item.lnglat,
                  supply:item.all
                })
              }else{
                listNeed.push({
                  id:item.id,
                  lnglat:item.lnglat,
                  need:-item.all
                })
              }
            }else{
              listBase.push(item)
            }
        }
      })
    })
    return {
      base:listBase,
      supply:listSupply,
      need:listNeed
    }
  }

  _getRect(id){
    if(id>0 && id<=this.rows*this.columns){
      let row_index = Math.floor(id/this.columns)
      let column_index = id%this.columns - 1
      return [row_index,column_index]
    }else{
      return null
    }
  }

  getRect(id){
    if(id>0 && id<=this.rows*this.columns){
      let row_index = Math.floor(id/this.columns)
      let column_index = id%this.columns - 1
      //console.log(row_index,column_index)
      if(column_index<0){
        row_index--
        column_index = this.columns - 1
      }
      return this.rects[row_index][column_index]
    }else{
      return null
    }
  }
}

