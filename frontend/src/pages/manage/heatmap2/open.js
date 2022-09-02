import myAjax from "../../../component/myAjax/withJq";

/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: open
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/5/9-下午8:57
 Description:
 Param:
 Return:
 *************************************************/
require('./css/open.less')
 let store = require('./js/store.json')
import $ from '../../../../other_modules/jquery&ui/jquery&ui'
import getApiUrl from "../../../js/getApiUrl";
import parseURL from '../../../js/parseURL'
let query = parseURL(window.location.href).query
const city_list = [
  {
    id: 197,
    name: "广州市",
    lng: "113.264360",
    lat: "23.129080"
  },
  {
    id: 1,
    name: "北京市",
    lng: "116.000000",
    lat: "39.914935"
  },
  {
    id: 235,
    name: "成都",
    lng: "104.066999",
    lat: "30.662893"
  },
  {
    id: 169,
    name: "武汉",
    lng: "114.305250",
    lat: "30.592760"
  },
  {
    id: 183,
    name: "长沙",
    lng: "113.023789",
    lat: "28.200548"
  },
  {
    id: 74,
    name: "南京",
    lng: "118.773536",
    lat: "32.039730"
  }
]

$('.config_img').click(function(){
  $('.config').toggleClass('active')
})

for(let key in store){
  $('#time').append('<option value="'+key+'">'+key.replace('_','月')+'日</option>')
}

$('#time').on('change',function(){
  heatmap.setDataSet({
    data: calData(this.value),
    max:level
  });
})

$('#city').append(city_list.map(item => '<option value="' + item.id + '">' + item.name + '</option>')).on('change', function () {
  getData($(this).val())
})

let level = 10
var handle = $( "#custom-handle" );
$('#slider').slider({
  create: function() {
    handle.text( $( this ).slider( "value" ) );
  },
  slide: function( event, ui ) {
    handle.text( ui.value );
    level = ui.value
    heatmap.setDataSet({
      data: calData($('#time').val()),
      max:level
    })
  },
  value:10,
  min:1,
  max:99,
})

let map = new AMap.Map("map", {
  resizeEnable: true,
  center: [113.251288, 23.139916],
  zoom: 11
});
AMap.plugin(['AMap.ToolBar','AMap.Scale'],
  function(){
    map.addControl(new AMap.ToolBar());

    map.addControl(new AMap.Scale());
  });
let heatmap
map.plugin(["AMap.Heatmap"], function() {
  heatmap = new AMap.Heatmap(map, {
    radius: 25, //给定半径
    opacity: [0, 0.9],
    zIndex:400
  });
    heatmap.setDataSet({
      data: calData('3_1'),
      max:level
    });
});

getData(197)

function calData(key){
  let data = store[key]
  return data.map(item=>{
    return {
      lng:item[0],
      lat:item[1],
      count: item[2]
    }
  })
}

function getData(id) {
  id = Number(id)

  let city = city_list.find(item => item.id === id)
  if (!city) city = city_list[0]

  let data = {
/*    uuid: "123",
    sign: "sign",*/
    user_version: 'android_2106',
    user_sys_version: '23',
    user_lat: city.lat,
    user_lng: city.lng
  }
  if(city.id!==0){
    data.city_id = city.id
  }
  //if (id > 0) data.type = 'local';
  myAjax.post('https://api.likechuxing.com/branch/list', data, function (res) {
    if (res.status === 0) {
      makePointMarker(res.data)
    }
  })
}

function makePointMarker(data) {
  if (!data.length) {
    return
  }

  if(map) map.remove(map.getAllOverlays());

  let B = new AMap.Icon({
    image: require('./images/point_icon_b.png'),
    size: new AMap.Size(35, 40),
    imageSize: new AMap.Size(35, 40)
  })
  let B_plus = new AMap.Icon({
    image: require('./images/point_icon_b+.png'),
    size: new AMap.Size(35, 40),
    imageSize: new AMap.Size(35, 40)
  })
  let B_disabled = new AMap.Icon({
    image: require('./images/point_icon_b_disabled.png'),
    size: new AMap.Size(35, 40),
    imageSize: new AMap.Size(35, 40)
  })
  let B_plus_disabled = new AMap.Icon({
    image: require('./images/point_icon_b+_disabled.png'),
    size: new AMap.Size(35, 40),
    imageSize: new AMap.Size(35, 40)
  })

  data.forEach(item => {
    let icon = B
    if (item.biz_type === '1') icon = B_plus
    if (item.car_cnt === 0) {
      icon = B_disabled
      if (item.biz_type === '1') icon = B_plus_disabled
    }
    let marker = new AMap.Marker({
      icon: icon,
      title: item.name,
      position: [item.lng, item.lat],
      map
    })

    if (item.car_cnt > 0) {
      let content = '<div class="desc">' + item.car_cnt + '</div>';
      new AMap.Marker({
        content: content,
        position: [item.lng, item.lat],
        offset: new AMap.Pixel(10, -30),
        map: map,
        zIndex: 300
      });
    }
  })
  map.setFitView()
}