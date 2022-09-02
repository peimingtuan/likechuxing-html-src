/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: area2.class.js
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/17-下午5:11
 Description:
 Param:
 Return:
 *************************************************/
import mapControl from './mapControl'

class Rect {
  constructor ({lng, lat, step,need}) {
    this.lng = lng
    this.lat = lat
    this.center = [lng, lat]
    this.bounds = new AMap.Bounds([lng-step.lng_diff_half,lat-step.lat_diff_half],[lng+step.lng_diff_half,lat+step.lat_diff_half])
    this.need = Number(need)
    this.supply = 0
    this.diff = -this.need
    this.zero = this.need === 0
  }

  setSupply(supply) {
    this.supply += Number(supply)
    this.diff = this.supply - this.need

    this.zero = Boolean(this.supply === 0 && this.need === 0)
    return this.supply
  }

}

export default class Area {
  constructor ({
                 lng, lat
               }) {
    this.center = [lng, lat]
    this.area = []
    this.step = mapControl.getStep(this.center)

    this.max_need = 0
    this.max_supply = 0
  }

  push (data) {
    let need = Number(data.need)
    if(need > this.max_need)this.max_need = need
    this.area.push(new Rect({
      lng: Number(data.lng),
      lat: Number(data.lat),
      need: need,
      step:this.step
    }))
  }

  loadSupply(branches){
    branches.forEach(item=>{
      let len = this.area.length
      for(let i = 0;i<len;i++){
        let area = this.area[i]
        if(area.bounds.contains([item.lng,item.lat])){
          let supply = area.setSupply(item.car.length)
          if(supply > this.max_supply)this.max_supply = supply
          break
        }
      }
    })


  }
}