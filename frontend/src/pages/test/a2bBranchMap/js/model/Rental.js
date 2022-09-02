/*************************************************
 * Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 * File name: Rental
 * Author: garvey sunjiawei@likechuxing.com
 * Version: 1.0.0
 * Date: 2019-01-07-18:08
 * Description:
 *
 *************************************************/
module.exports = class Rental {
  constructor (rental) {
    this.begin_time = Number(rental[0])
    let begin_date = new Date(this.begin_time * 1000)
    this.begin_time_hour = begin_date.getHours() + begin_date.getMinutes() / 60

    this.end_time = Number(rental[1])
    let end_date = new Date(this.end_time * 1000)
    this.end_time_hour = end_date.getHours() + end_date.getMinutes() / 60

    this.begin_branch = rental[2]
    this.begin_biz_type = Number(rental[3])
    this.begin_branch_poi = [Number(rental[4]), Number(rental[5])]

    this.end_branch = rental[6]
    this.end_biz_type = Number(rental[7])
    this.end_branch_poi = [Number(rental[8]), Number(rental[9])]

    this.path = this.getGeodesicPath(this.begin_branch_poi, this.end_branch_poi, 5)
    this.day_begin_time = new Date(new Date(this.begin_time*1000).toLocaleDateString()).getTime()/1000
    this.begin_time_offset = this.begin_time - this.day_begin_time
    this.end_time_offset = this.end_time - this.day_begin_time
  }

  getGeodesicPoints (start, end, pointsNum) {
    2 === start.length && (start = new AMap.LngLat(start[0], start[1]));
    2 === end.length && (end = new AMap.LngLat(end[0], end[1]));
    pointsNum = pointsNum || 30;
    let segments = pointsNum + 1 || Math.round(Math.abs(start.lng - end.lng));
    if (!segments || Math.abs(start.lng - end.lng) < .001) return [];

    let n, f, A, B, x, y, z, lat, lon, itpLngLats = [], PI = Math.PI, d2r = PI / 180, r2d = 180 / PI, asin = Math.asin,
      sqrt = Math.sqrt, sin = Math.sin, pow = Math.pow, cos = Math.cos, atan2 = Math.atan2, lat1 = start.lat * d2r,
      lon1 = start.lng * d2r, lat2 = end.lat * d2r, lon2 = end.lng * d2r,
      d = 2 * asin(sqrt(pow(sin((lat1 - lat2) / 2), 2) + cos(lat1) * cos(lat2) * pow(sin((lon1 - lon2) / 2), 2)));

    for (n = 1; n < segments; n += 1) {
      f = 1 / segments * n;
      A = sin((1 - f) * d) / sin(d);
      B = sin(f * d) / sin(d);
      x = A * cos(lat1) * cos(lon1) + B * cos(lat2) * cos(lon2);
      y = A * cos(lat1) * sin(lon1) + B * cos(lat2) * sin(lon2);
      z = A * sin(lat1) + B * sin(lat2);
      lat = atan2(z, sqrt(pow(x, 2) + pow(y, 2)));
      lon = atan2(y, x);
      itpLngLats.push(new AMap.LngLat(lon * r2d, lat * r2d));
    }
    return itpLngLats;
  }

  getGeodesicPath (start, end, pointsNum) {
    2 === start.length && (start = new AMap.LngLat(start[0], start[1]));
    2 === end.length && (end = new AMap.LngLat(end[0], end[1]));
    let points = [start];
    points.push.apply(this,this.getGeodesicPoints(start, end, pointsNum));
    points.push(end);
    return points;
  }

  is_during (time) {
    return this.begin_time_offset <= time && this.end_time_offset >= time
  }

}