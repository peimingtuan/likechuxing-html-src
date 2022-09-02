require('./css/index.less');
import myAjax from '../../../component/myAjax/withJq'
import getApiUrl from './js/getApiUrl'
import parseURL from '../../../js/parseURL'
import $ from '../../../../other_modules/jquery&ui/jquery&ui'

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

let map = null
let map2 = null
let map3 = null
let branches = []
let data = require('./js/test.json')
let history = data.open
var heatmap,heatmap2,heatmap3;
let animating=false
let query = parseURL(window.location.href).query


bindAction()
init('0')
getData(0)
initHot()
drawHot()

function animate(index){
  if(index > history.length-1){
    console.warn('当日数据不完整')
    return
  }
  if(index<23){
    index++
  }
  $("#slider").slider('value',index)
  changeTo(index)
  setTimeout(function(){
    if(animating){
      animate(index)
    }
  },$('#speed').val())
}

function changeTo(index){
  if(index > history.length-1){
    console.warn('当日数据不完整')
    return
  }
  let time = new Date(history[index].create_time)
  let hour = time.getHours()
  if(hour<10)hour = '0'+hour;
  let min = time.getMinutes()
  if(min<10)min = '0'+min;
  $('#time').text(hour+':'+min)

  heatmap.setDataSet({
    data: history[index].branch,
    max:7
  });
  heatmap2.setDataSet({
    data: data.order[index].branch,
    max:7
  });
  heatmap3.setDataSet({
    data: data.free[index].branch,
    max:7
  });
}

function bindAction(){

  $('#slider').slider({
    max:23,
  }).on('slide',function(e,res){
    animating=false
    changeTo(res.value)
  })
  $('#play').click(function(){
    $('#slider').slider({
      value:0
    })
    drawHot()
  })

  $('#city').append(city_list.map(item => '<option value="' + item.id + '">' + item.name + '</option>')).on('change', function () {
    getData($(this).val())
  })
  $('#layer').on('change',function(){
    map = null
    init($(this).val())
  })
  $('#hot').on('click',function(){
    if($('#date').val()===''){
      alert('请输入查询时段')
      return
    }
    if($(this).text() === '查询中'){
      return
    }

    getHotData()
  })
}

function drawHot(){
  if(history.length === 0){
    toast('数据未就绪，请稍等两秒重试')
    return false
  }else{
    heatmap.show()
    heatmap2.show()
    heatmap3.show()
    animate(0)
    animating=true
  }
}

function init(layer){
  let AMap = window.AMap;

  map = new AMap.Map("map", {
    resizeEnable: true,
    center: [113.251288, 23.139916],
    zoom: 11
  });
  map2 = new AMap.Map("map2", {
    resizeEnable: true,
    center: [113.251288, 23.139916],
    zoom: 11
  });
  map3 = new AMap.Map("map3", {
    resizeEnable: true,
    center: [113.251288, 23.139916],
    zoom: 11
  });
  AMapUI.loadUI(['control/BasicControl'], function (BasicControl) {
    map.addControl(new BasicControl.Zoom({
      position: 'lt'
    }));
  });
  makePointMarker(branches)
  initHot()
}

function getData(id) {
  id = Number(id)

  let city = city_list.find(item => item.id === id)
  if (!city) city = city_list[0]

  let data = {
    uuid: query.uuid,
    sign: query.sign,
    user_version: 'android_2106',
    user_sys_version: '23',
    user_lat: city.lat,
    user_lng: city.lng
  }
  if(city.id!==0){
    data.city_id = city.id
  }
  if (id > 0) data.type = 'local';
  myAjax.post(getApiUrl('/branch/list'), data, function (res) {
    if (res.status === 0) {
      branches = res.data
      makePointMarker(branches)
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

function initHot(){
  if(heatmap){
    heatmap.setDataSet({
      data: history[0].branch,
      max:7
    })
  }else{
    map.plugin(["AMap.Heatmap"], function() {
      heatmap = new AMap.Heatmap(map, {
        radius: 25, //给定半径
        opacity: [0, 0.9],
        zIndex:400
      });
      heatmap.setDataSet({
        data: history[0].branch,
        max:7
      });
      heatmap.hide()
    });
    map2.plugin(["AMap.Heatmap"], function() {
      heatmap2 = new AMap.Heatmap(map2, {
        radius: 25, //给定半径
        opacity: [0, 0.9],
        zIndex:400
      });
      heatmap2.setDataSet({
        data: data.order[0].branch,
        max:7
      });
      heatmap2.hide()
    });
    map3.plugin(["AMap.Heatmap"], function() {
      heatmap3 = new AMap.Heatmap(map3, {
        radius: 25, //给定半径
        opacity: [0, 0.9],
        zIndex:400
      });
      heatmap3.setDataSet({
        data: data.free[0].branch,
        max:7
      });
      heatmap3.hide()
    });
  }
}

function toast(msg) {
  if (msg != '') {
    document.querySelector('#toast-msg').innerHTML = msg;
    document.querySelector('#toast-con').style.display = 'block';
    setTimeout(function () {
      document.querySelector('#toast-con').style.display = 'none';
    }, 2500)
  }
}




