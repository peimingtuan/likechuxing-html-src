/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: draw
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/9/13-下午7:44
 Description:
 Param:
 Return:
 *************************************************/
let map = new AMap.Map("container", {
  resizeEnable: true,
  center: [116.403322, 39.900255],//地图中心点
  zoom: 5 //地图显示的缩放级别
});
window.editor = {}

window.start = function () {
  let center = map.getCenter()
  let step = 0.05
  let arr = [
    [center.lng - step, center.lat - step],
    [center.lng + step, center.lat - step],
    [center.lng + step, center.lat + step],
    [center.lng - step, center.lat + step]
  ]

  editor._polygon = new AMap.Polygon({
    map: map,
    path: arr,
    strokeColor: "#0000ff",
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#f5deb3",
    fillOpacity: 0.35
  });

  editor._polygonEditor = new AMap.PolyEditor(map, editor._polygon);
}

editor.startEditPolygon = function () {
  editor._polygonEditor.open();
}
editor.closeEditPolygon = function () {
  editor._polygonEditor.close();
  console.log(JSON.stringify(editor._polygon.getPath().map(item => [item.lng, item.lat])))
}

new AMap.Polygon({
  map: map,
  path: [
    [114.266194, 30.555093],
    [114.265679, 30.554991],
    [114.268415, 30.576349],
    [114.268898, 30.576673]
  ],
  fillColor: 'red',
  fillOpacity: 0.2
})

new AMap.Polygon({
  map: map,
  path: [
    [114.279682, 30.554501],
    [114.279483, 30.554238],
    [114.294766, 30.545862],
    [114.295078, 30.546227],
  ],
  fillColor: 'blue',
  fillOpacity: 0.2
})


