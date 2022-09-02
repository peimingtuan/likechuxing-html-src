import myAjax from '../../../../other_modules/like-request/withAxiosV2'
import './common.less'
import axios from 'axios'

const CITY = [
  {
    id:197,
    name:'广州',
    lng:113.25839,
    lat:23.142096
  },
  {
    id:235,
    name:'成都',
    lng:104.055633,
    lat:30.662648
  },
][1]

let map = new AMap.Map(document.querySelector('#map'), {
  mapStyle: 'amap://styles/darkblue',
  zoom:11,//级别
  center: [CITY.lng,CITY.lat],
/*  viewMode:'3D',
  pitch: 50,
  rotation: 0*/
});

AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function(PointSimplifier, $) {

  if (!PointSimplifier.supportCanvas) {
    alert('当前环境不支持 Canvas！');
    return;
  }

  var pointSimplifierIns = new PointSimplifier({
    map: map, //所属的地图实例

    getPosition: function(item) {

      if (!item) {
        return null;
      }

      //返回经纬度
      return [item.lng,item.lat];
    },
    getHoverTitle: function(dataItem, idx) {
      return idx + ': ' + dataItem.name;
    },
    renderOptions: {
      //点的样式
      pointStyle: {
        width: 6,
        height: 6,
        fillStyle:'#ed3800',
        lineWidth:1,
        strokeStyle:'#ED6233'
      },
      pointHardcoreStyle:{
        width:1,
        height:1
      },
      //鼠标hover时的title信息
      hoverTitleStyle: {
        position: 'top'
      }
    }
  });

  window.pointSimplifierIns = pointSimplifierIns;

  myAjax.post('https://api.likechuxing.com/branch/list',{
    user_lat:CITY.lat,
    user_lng:CITY.lng,
    city_id:CITY.id
  }).then(res=>{
    console.log(res)
    pointSimplifierIns.setData(res.data);
  })

});

axios.post('https://api.likechuxing.com/branch/list',{}).then(res=>{
  console.log(res)
})

