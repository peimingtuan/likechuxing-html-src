/**
 * Created by garvey on 2017/8/11.
 */
const simplify = require('simplify')

const ICON = {
	// anchor：new BMap.Size(11, 31),
	START_POINT: new AMap.Icon({
    image: require('../images/start_point.png'),
    size: new AMap.Size(22, 34),
    imageSize: new AMap.Size(22, 34)
  }),

  // anchor：new BMap.Size(11, 31),
	END_POINT:new AMap.Icon({
    image: require('../images/end_point.png'),
    size: new AMap.Size(22, 34),
    imageSize: new AMap.Size(22, 34)
  }),

  // anchor：new BMap.Size(17, 34),
	SAME_POINT:new AMap.Icon({
    image: require('../images/start_end_point.png'),
    size: new AMap.Size(34, 34),
    imageSize: new AMap.Size(34, 34)
  }),

	// anchor: new BMap.Size(20, 42),
	GET_CAR_POINT:new AMap.Icon({
    image: require('../images/getCatPoint.png'),
    size: new AMap.Size(41, 45),
    imageSize: new AMap.Size(41, 45)
  })
}

let mapControl = {
	map:null,

	initMap(selector){
    this.map = new AMap.Map(selector,{
      resizeEnable: true,
      zoom: 3,
      // 西安，中国中心
      center: [108.894324, 34.285013]
    });
	},

	drawRoute(data){
    let points = calculatePoints(data);
    let start_point = points[0],
      end_point = points[points.length-1];

    // 画起点终点
    if(isSamePoint(start_point,end_point)){
    	this.drawBranch('same',start_point)
    }else{
      this.drawBranch('start',start_point)
      this.drawBranch('end',end_point)
    }

    // 画路径
    new AMap.Polyline({
			map:this.map,
			path:points.map(item=>[item.lng,item.lat]),
      strokeColor:"#494B51",
      strokeWeight:4,
      strokeOpacity:0.9
		});
    this.map.setFitView()
		this.moveUp()
	},

	drawBranch(type,point){
		let opt = {
      position: [point.lng, point.lat],
      map: this.map,
		}

		switch (type){
			case "start":
				opt.offset = new AMap.Pixel(-11, -31)
				opt.icon = ICON.START_POINT
				break;
			case "end":
        opt.offset = new AMap.Pixel(-11, -31)
        opt.icon = ICON.END_POINT
        break;
			case "same":
        opt.offset = new AMap.Pixel(-17, -34)
        opt.icon = ICON.SAME_POINT
        break;
			default:
        opt.offset = new AMap.Pixel(-20, -42)
        opt.icon = ICON.GET_CAR_POINT
				this.map.setCenter([point.lng,point.lat])
				this.map.setZoom(16)
        this.moveUp()
		}

		new AMap.Marker(opt);
	},

	moveUp(){
		// 修复地图实际中心点和显示中心点不匹配的偏移
		this.map.panBy(0,-80)
	}
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

module.exports=mapControl