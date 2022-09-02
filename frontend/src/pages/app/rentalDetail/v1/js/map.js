/**
 * Created by garvey on 2017/8/11.
 */
const coordtransform = require('coordtransform');
const simplify = require('simplify')

function Map(){
	let map = new BMap.Map("map");
	this.map=map;
	window.bd_map = map;


	this.icon_start_point = new BMap.Icon(require('../images/start_point.png'),new BMap.Size(22,34),{
		anchor: new BMap.Size(11, 34),
		imageSize:new BMap.Size(22,34)
	});
	this.icon_end_point = new BMap.Icon(require('../images/end_point.png'),new BMap.Size(22,34),{
		anchor: new BMap.Size(11, 34),
		imageSize:new BMap.Size(22,34)
	});
	this.icon_start_end_point = new BMap.Icon(require('../images/start_end_point.png'),new BMap.Size(34,34),{
		anchor: new BMap.Size(17, 34),
		imageSize:new BMap.Size(34,34)
	});
	this.icon_get_car_point = new BMap.Icon(require('../images/getCatPoint.png'), new BMap.Size(41, 45), {
		anchor: new BMap.Size(20, 42),
        imageSize:new BMap.Size(41,45)
	})

	this.point = null
	this.panToPoint = false
	/*
	let geolocation = new BMap.Geolocation()
	geolocation.getCurrentPosition(function (res) {
		if (geolocation.getStatus() === BMAP_STATUS_SUCCESS) {
			this.point = res.point
			if(this.panToPoint){
				this.map.centerAndZoom(this.point,11);
			}
		}
	}.bind(this))
	*/
}

Map.prototype.drawRoute = function (data, city_name) {
	let map = this.map;
	if(data.length < 2){
		//toast('行程未能生成有效轨迹数据')
		/*
		if (this.point) {
			this.map.centerAndZoom(this.point,11);
		}else{
			this.panToPoint = true
		}
		*/
		map.centerAndZoom('西安',3);  // 初始化地图,设置中心点坐标和地图级别
		map.setCurrentCity("西安");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
		let top_left_navigation = new BMap.NavigationControl();
		map.addControl(top_left_navigation)
		return
	}


	let points = calculatePoints(data);
	let B_points = [];
	points.forEach(function(item){
		let item_point = coordtransform.gcj02tobd09(item.lng,item.lat)
		B_points.push(new BMap.Point(item_point[0],item_point[1]))
	})
	let start_point = points[0],
		end_point = points[points.length-1];
	if(isSamePoint(start_point,end_point)){
		let marker = new BMap.Marker(start_point,{icon:this.icon_start_end_point})
		map.addOverlay(marker)
	}else{
		let marker={
			start_point:new BMap.Marker(start_point,{icon:this.icon_start_point}),
			end_point:new BMap.Marker(end_point,{icon:this.icon_end_point})
		}
		map.addOverlay(marker.start_point);
		map.addOverlay(marker.end_point);
	}

	let polyline = new BMap.Polyline(B_points, {strokeColor:"#494B51", strokeWeight:4, strokeOpacity:0.9});
	map.addOverlay(polyline);
	map.setViewport(B_points)
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	let top_left_navigation = new BMap.NavigationControl();
	map.addControl(top_left_navigation)
}

Map.prototype.drawStartPoint = function (data){
	let _point = coordtransform.gcj02tobd09(data.start_point_lng, data.start_point_lat)
    let point = new BMap.Point(_point[0], _point[1])
	this.map.centerAndZoom(point, 16)
    this.map.addOverlay(new BMap.Marker(point,{icon:this.icon_get_car_point}));
}

//判断两点是否是同一地点，地面近似50米左右
function isSamePoint(a,b){
	let standard = 0.0025;
	let dlat = a.lat-b.lat,
		dlng = a.lng-b.lng;
	return (dlat*dlat+dlng*dlng) < standard*standard
}

function calculatePoints(data){
	let points=[]
	data.forEach(function(item){
		points.push({
			x:item.lat*10000,
			y:item.lng*10000
		})
	})
	let simply_points = [];
	simplify(points).forEach(function(item){
		simply_points.push({
			lat:item.x/10000,
			lng:item.y/10000
		})
	})
	return simply_points
}

module.exports=Map