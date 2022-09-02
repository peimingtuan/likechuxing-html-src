
let data = require('./car_num')

let map = new AMap.Map("map", {
  resizeEnable: true,
  center: [113.251288, 23.139916],
  zoom: 11
});

data.forEach(item=>{
  getBranchCntMarker(item)
})

function getBranchCntMarker(item) {
  let className = "point_car_cnt"

  let offset = new AMap.Pixel(5, -49)
  let zIndex = 100
  return new AMap.Marker({
    content: '<div class="' + className + '">' + item.car_num + '</div>',
    position: [item.lng, item.lat],
    offset: offset,
    map: map,
    zIndex: zIndex
  });
}





