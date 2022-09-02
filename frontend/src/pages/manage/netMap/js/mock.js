/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mock
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/11/1-5:26 PM
 Description:
 Param:
 Return:
 *************************************************/
import Mock from 'mockjs'
import _ from 'lodash'
import {branches, area} from './mockData.js'
import parseUrl from '../../../../js/parseURL'

const loadData = function (data) {
  return ({
    status: 0,
    msg: '',
    data: data || []
  })
}

const getCityId = function (res) {
  let city_id = parseUrl(res.body).query.city_id
  if (![183, 235].includes(Number(city_id))) city_id = 183
  return city_id
}

Mock.setup({
  timeout: '200-600'
})

Mock.mock(/\/time\/get/, () => {
  return loadData({timestamp: Math.floor(_.now() / 1000)})
})

Mock.mock(/get-branches/, res => {
  return loadData(branches[getCityId(res)])
})

Mock.mock(/get-areas-by-city-id/, res => {
  return loadData(area[getCityId(res)])
})

Mock.mock(/get-remark/, () => {
  return loadData()
})

Mock.mock(/getDataTable/, () => {
  function getRandomData(){
    return {
      date: '2018-9-15',
      city: '广州市',
      rect_total: Math.floor(100*Math.random()),
      rect_none: 20,
      rect_has: 80,
      branch_b: 17,
      branch_b_plus: 4
    }
  }

  return loadData({
    total:40,
    list:Array(14).fill(1).map(()=>getRandomData())
  })
})

Mock.mock(/edit-area/,()=>{
  return loadData()
})

Mock.mock(/create-area/,()=>{
  return loadData()
})

Mock.mock(/delete-area/,()=>{
  return loadData()
})

