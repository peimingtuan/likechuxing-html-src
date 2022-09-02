require('./style.less')
let data = require('./data')

let max = 0
let points = data.map(item=>{
  if(max < item[2])max = item[2]
  return {
    lng:item[0],
    lat:item[1],
    count:item[2]
  }
})
const HOT_LEVEL_COLOR = {
  1.0: 'red',
  0.9: '#ffea00',
  0.7: 'rgb(0, 255, 0)',
  0.65: 'rgb(117,211,248)',
  0.5: 'blue'
};
let map = new AMap.Map("map", {
  resizeEnable: true,
  center: ['114.30525','30.59276'],
  zoom: 11
});

let heatmap

map.plugin(["AMap.Heatmap"], function() {
  //初始化heatmap对象
  heatmap = new AMap.Heatmap(map, {
    radius: 10, //给定半径
    opacity: [0, 0.8],
    gradient:HOT_LEVEL_COLOR
  });
  console.log(max)
  heatmap.setDataSet({
    data: points,
    max: max
  });
});





