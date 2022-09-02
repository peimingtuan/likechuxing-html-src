/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: data
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2018-12-03-17:21
 * Description:
 *
 * @param {param1} some description
 *
 *************************************************/
const bounds = {
  southWest: {lng: 103.890097, lat: 30.481990},
  northEast: {lng: 104.214731, lat: 30.833392},
  step: {
    lng: 0.005236,
    lat: 0.004505
  }
}

const level_color={
  s:'#ff0000',
  a:'#70b3e6',
  b:'#1a10ff',
  c:'#fefe00',
  d:'#ffa000',
  e:'#00ff00',
  other:'#333333',
}

export {
  bounds,
  level_color
}
