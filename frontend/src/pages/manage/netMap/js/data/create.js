/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: create
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/10/15-12:43 PM
 Description:
 Param:
 Return:
 *************************************************/
const fse = require('fs-extra')
import {getAreas} from './makeArea'

let citys = [
  {
    "id": 183,
    "lat": 28.200548,
    "lng": 113.023789,
    "name": "长沙市",
    bounds: {
      northEast: {lng: "113.059270", lat: "28.269818"},
      southWest: {lng: "112.919886", lat: "28.107305"}
    }
  },
  {
    "id": 235,
    "lat": 30.650909,
    "lng": 104.07074,
    "name": "成都市",
    bounds: {
      northEast: {lng: "104.213433", lat: "30.767592"},
      southWest: {lng: "103.891654", lat: "30.482557"}
    }
  }, {
    "id": 214,
    "lat": 22.51595,
    "lng": 113.3926,
    "name": "中山市",
    bounds: {
      northEast: {lng: "113.489822", lat: "22.587650"},
      southWest: {lng: "113.300072", lat: "22.360032"}
    }
  }, {
    "id": 213,
    "lat": 23.02067,
    "lng": 113.75179,
    "name": "东莞市",
    bounds: {
      northEast: {lng: "113.951675", lat: "23.090281"},
      southWest: {lng: "113.670081", lat: "22.774833"}
    }
  }, {
    "id": 202,
    "lat": 23.002012,
    "lng": 113.135147,
    "name": "佛山市",
    bounds: {
      northEast: {lng: "113.503337", lat: "23.295706"},
      southWest: {lng: "113.067508", lat: "22.978665"}
    }
  }, {
    "id": 197,
    "lat": 23.12908,
    "lng": 113.26436,
    "name": "广州市",
    bounds: {
      northEast: {lng: "113.503337", lat: "23.295706"},
      southWest: {lng: "113.067508", lat: "22.978665"}
    }
  }, {
    "id": 169,
    "lat": 30.59276,
    "lng": 114.30525,
    "name": "武汉市",
    bounds: {
      northEast: {lng: "114.419348", lat: "30.659701"},
      southWest: {lng: "114.164037", lat: "30.488543"}
    }
  }, {
    "id": 74,
    "lat": 32.05838,
    "lng": 118.79647,
    "name": "南京市",
    bounds: {
      northEast: {lng: "118.865550", lat: "32.109988"},
      southWest: {lng: "118.717156", lat: "31.941057"}
    }
  }
]

citys.forEach(item=>{
  let data = getAreas({
    lng:Number(item.lng),
    lat:Number(item.lat)
  },item.bounds)
  fse.writeJson('./'+item.name+'.json', data)
})