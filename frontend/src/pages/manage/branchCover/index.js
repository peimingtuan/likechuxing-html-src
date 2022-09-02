require('./css/index.less');
let point_icon_url = require('./images/point_icon.png');
import data from './branchParks.json'

function init(){

	AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
		map.addControl(new BasicControl.Zoom({
			position: 'lt'
		}));
	});

	makePointMarker(data)

	drawDistrict()
}

function makePointMarker(data){
	data.forEach(function(item){
		let circle = new AMap.Circle({
			map:map,
			center: [item.lng, item.lat],
			radius: 500,
			strokeColor: '#111111',
			strokeOpacity: 0.6,
			strokeWeight: 2,
			fillColor:'#111111',
			fillOpacity: 0.2
		})
		circles.push(circle)
		parks=parks.concat(item.parkingPlaces)
	})
	map.setFitView()
	AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {
		// 停车场
		var parkSimplifierIns = new PointSimplifier({
			map: map, //关联的map
			compareDataItem: function(a, b, aIndex, bIndex) {
				//数据源中靠后的元素优先，index大的排到前面去
				return aIndex > bIndex ? -1 : 1;
			},
			getPosition: function(dataItem) {
				//返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
				return dataItem.loc.split(',');
			},
			getHoverTitle: function(dataItem, idx) {
				//返回数据项的Title信息，鼠标hover时显示
				return dataItem.name;
			},
			renderOptions: {
				//点的样式
				pointStyle: {
					fillStyle: 'blue' //蓝色填充
				}
			}
		});
		parkSimplifierIns.setData(parks);

		// 网点
		var pointSimplifierIns = new PointSimplifier({
			map: map, //关联的map
			compareDataItem: function(a, b, aIndex, bIndex) {
				//数据源中靠后的元素优先，index大的排到前面去
				return aIndex > bIndex ? -1 : 1;
			},
			getPosition: function(dataItem) {
				//返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
				return [dataItem.lng,dataItem.lat]
			},
			getHoverTitle: function(dataItem, idx) {
				//返回数据项的Title信息，鼠标hover时显示
				return dataItem.name;
			},
			renderOptions: {
				//点的样式
				pointStyle: {
					fillStyle: 'red' //蓝色填充
				}
			}
		});
		pointSimplifierIns.setData(data);
	});
}

function drawDistrict(){
	var colors = [
		"#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
		"#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
		"#651067", "#329262", "#5574a6", "#3b3eac"
	];

	AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {

		//创建一个实例
		var districtExplorer = new DistrictExplorer({
			map: map,
			eventSupport: true
		});

		//创建一个辅助Marker，提示鼠标内容
		var tipMarker = new AMap.Marker({
			//启用冒泡，否则click事件会被marker自己拦截
			bubble: true
		});

		//监听feature的hover事件
		districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
			var isHover = e.type === 'featureMouseover';

			if (!isHover) {
				tipMarker.setMap(null);
				return;
			}

			tipMarker.setMap(map);

			tipMarker.setPosition(e.originalEvent.lnglat);

			var text=''
			if (district.find(item => item.id == feature.properties.adcode)){
				text = (district.find(item => item.id == feature.properties.adcode).pre*100).toFixed(2)
			}else{
				var points = feature.geometry.coordinates[0][0]
				var polygon = new AMap.Polygon({
					path:points
				})
				//var area = (polygon.getArea()/1000000).toFixed(1)
				var pre = calCircleInDistrict(polygon)
				district.push({
					id: feature.properties.adcode,
					pre:pre
				})
				text = (pre*100).toFixed(2)
			}

			tipMarker.setLabel({
				offset: new AMap.Pixel(20, 20),
				content: feature.properties.name+' 网点覆盖占比'+text+'%'
			});

		});
		//监听鼠标在feature上滑动
		districtExplorer.on('featureMousemove', function(e, feature) {
			//更新提示位置
			tipMarker.setPosition(e.originalEvent.lnglat);
		});

		var adcode = 440100;

		districtExplorer.loadAreaNode(adcode, function(error, areaNode) {

			//更新地图视野
			map.setBounds(areaNode.getBounds(), null, null, true);

			//清除已有的绘制内容
			districtExplorer.clearFeaturePolygons();

			//绘制子区域
			districtExplorer.renderSubFeatures(areaNode, function(feature, i) {

				var fillColor = colors[i % colors.length];
				var strokeColor = colors[colors.length - 1 - i % colors.length];

				return {
					cursor: 'default',
					bubble: true,
					strokeColor: strokeColor, //线颜色
					strokeOpacity: 1, //线透明度
					strokeWeight: 1, //线宽
					fillColor: fillColor, //填充色
					fillOpacity: 0.2, //填充透明度
				};
			});

			//绘制父区域
			districtExplorer.renderParentFeature(areaNode, {
				cursor: 'default',
				bubble: true,
				strokeColor: 'black', //线颜色
				strokeOpacity: 1, //线透明度
				strokeWeight: 1, //线宽
				fillColor: null, //填充色
				fillOpacity: 0.35, //填充透明度
			});
		});
	});
}

function calCircleInDistrict(polygon){
	var start = new Date().getTime()
	var step = 80
	var bounds = polygon.getBounds()
	var sw = bounds.getSouthWest()
	var ne = bounds.getNorthEast()
	var step_lng = (ne.lng-sw.lng)/step
	var step_lat = (ne.lat-sw.lat)/step
	var count_dis = 0
	var count_circle = 0

	for (var i=0;i<step;i++){
		for(var j=0;j<step;j++){
			var _bounds = new AMap.Bounds([sw.lng+j*step_lng,sw.lat+i*step_lat],[sw.lng+(j+1)*step_lng,sw.lat+(i+1)*step_lat])
			var _center = _bounds.getCenter()


			if(polygon.contains(_center)){
				count_dis++
				if(circles.some( cir => cir.contains(_center))){
					count_circle++
				}
			}
		}
	}
	console.log(new Date().getTime()-start+'ms')
	return count_circle/count_dis
}

function toast(msg){
	if(msg!=''){
		document.querySelector('#toast-msg').innerHTML=msg;
		document.querySelector('#toast-con').style.display='block';
		setTimeout(function(){
			document.querySelector('#toast-con').style.display='none';
		},2500)
	}
}

let AMap = window.AMap;
let map = new AMap.Map("map", {
	resizeEnable: true,
	center: [113.251288, 23.139916],
	zoom: 11
});
let point_icon = new AMap.Icon({
	size: new AMap.Size(35, 40),
	image: point_icon_url,
	imageSize: new AMap.Size(35,40)
})
let parks = [];
let circles = [];
let district =[]
window.district = district



init();

