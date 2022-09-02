import getVerification from '../../../js/getVerification'

let point_icon_url = require('./images/point_icon.png');

const $ = window.$;
const URL_LIST = [
	'https://api.likechuxing.com/open-app/pv',
	'https://api.likechuxing.com/open-app/uv',
	'https://api.likechuxing.com/chart/return-car-history',
	'https://api.likechuxing.com/chart/fetch-car-history'
];

let time_offset = 0

function init(){

	showHotLevel(10);



	$('.info').click(function(){
		$('.info_con').slideToggle()
	})

	$('.btn').on('click',function(){
		getData(type,begintime,endtime);
	})


	$('#save_hot').click(function(){
		let level = $('#hot_level').val();
		showHotLevel(level)
		let set = heatmap.getDataSet();
		set.max = Number(level);
		heatmap.setDataSet(set);
	})

}

let AMap = window.AMap;
let heatmap;
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
let point_store = {
	type_0 : {
		begintime:0,
		endtime:0,
		max:10,
		points:[]
	},
	type_1 : {
		begintime:0,
		endtime:0,
		max:10,
		points:[]
	},
	type_2 : {
		begintime:0,
		endtime:0,
		max:10,
		points:[]
	},
	type_3 : {
		begintime:0,
		endtime:0,
		max:10,
		points:[]
	}
}
let branch = [];
let display_branch = false;
let grid = null

init();

function getData(type, begintime, endtime) {
	let last_point=point_store['type_'+type];
	if(last_point.begintime == begintime && last_point.endtime == endtime && last_point.points.length > 0){
		$('#total').text('总计：'+last_point.points.length+'条');
		drawHot(last_point.points,last_point.max)
		return
	}

	$('#loadingToast').show()
	let url=URL_LIST[Number(type)]
	let time = Math.floor(new Date().getTime() / 1000) + time_offset
	let data = {
		begin_time:begintime,
		end_time:endtime,
		client_time: time,
		user_version: 'h5_1000'
	}

	data.verification = getVerification(data)
	$.post(url,data,function(data){
		if(data.status!=0){
			toast(data.msg)
			$('#loadingToast').hide()
		}else{
			last_point.begintime = begintime;
			last_point.endtime = endtime;
			if(Number(type) >= 2){
				let points = calPoint2(data.data);
				last_point.points = points[0];
				last_point.max = points[1]
			}else{
				last_point.points = calPoint(data.data);
			}
			drawHot(last_point.points, last_point.max)
		}
	})
}

function calPoint(data){
	let length = data.length;
	$('#total').text(length);
	let points=[];
	data.forEach(function(item){
		points.push({
			lng:item.user_lng,
			lat:item.user_lat,
			count:1
		})
	})
	return points
}

function calPoint2(data){
	let length = data.length;
	$('#total').text(length);
	let max = 10;
	let points=[];
	data.forEach(function(item){
		if(Number(item.ctn)>=max){
			max=item.ctn;
		}
		for (let i=0;i<item.ctn;i++){
			points.push({
				lng:Number(item.branch_lng)+getRadom(),
				lat:Number(item.branch_lat)+getRadom(),
				count:1
			})
		}
	})
	if(branch.length == 0){
		makePointMarker(data)
	}
	max=max/16
	return [points,max]
}

function drawHot(points, max){
	$('#loadingToast').hide()
	showHotLevel(max)
	heatmap.setDataSet({
		data: points,
		max: max
	});
}

function makePointMarker(data){
	data.forEach(function(item){
		let marker = new AMap.Marker({
			position: [item.branch_lng, item.branch_lat],
			title: item.branch_name+'('+item.ctn+')',
			icon: point_icon,
			offset: new AMap.Pixel(-17,-40),
			map: map
		});
		marker.on('click',function(){
			let label = this.getLabel();
			if(!label){
				this.setLabel({
					content:item.branch_name.replace(/(广州|网点)/g,'')+'('+item.ctn+')',
					offset:new AMap.Pixel(0,-20)
				})
			}else{
				this.setLabel({
					content:''
				})
			}
		})
		branch.push(marker)
	})
	display_branch=true;
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

function getRadom(){
	let num = 0.0006;
	return Math.random()*num*2-num;
}

function showHotLevel(level){
	let con = $('#show_hot_level');
	$('#hot_level').val(level)
	con.children().remove();
	for( let key in HOT_LEVEL_COLOR){
		let str ='<li  style="background-color:'+HOT_LEVEL_COLOR[key]+'">'+key*100+'% * max ≈ '+(level*key).toFixed(1)+'</li>';
		con.append(str)
	}
}





map.plugin(["AMap.CircleEditor"],function(){
	let circle = null

	$('#addGrid').click(function () {
		if (grid !== null){
			grid.close()
		}
		if (circle != null){
			map.remove(circle)
		}
		lines.forEach(item => {
			map.remove(item)
		})
		circle = new AMap.Circle({
			map: map,
			center:map.getCenter(),
			radius:1000,
			strokeColor: "#F33",
			strokeOpacity: 1,
			strokeWeight: 3,
			fillColor: "ee2200",
			fillOpacity: 0.2
		});
		grid = new AMap.CircleEditor(map,circle);
		grid.open()
	})

	$('#removeGrid').click(function () {
		grid.close()
		if (circle != null){
			map.remove(circle)
		}
		lines.forEach(item=>{
			map.remove(item)
		})
	})
	let lines = []
	$('#drawLine').click(function () {
		grid.close()
		map.remove(circle)
		lines.forEach(item => {
			map.remove(item)
		})
		let radius = circle.getRadius()
		let step = $('#grid_step').val()
		let bounds = circle.getBounds()

		let latStep = (bounds.northeast.lat-bounds.southwest.lat)*step/(2*radius)
		let lngStep = (bounds.northeast.lng-bounds.southwest.lng)*step/(2*radius)
		//画水平线
		let i=0
		while((bounds.southwest.lng + i*lngStep)<(bounds.northeast.lng+0.5*lngStep)){
			let line = new AMap.Polyline({
				path: [[bounds.southwest.lng+ i*lngStep,bounds.southwest.lat],[bounds.southwest.lng+i*lngStep,bounds.northeast.lat]],          //设置线覆盖物路径
				strokeColor: "#3366FF", //线颜色
				strokeOpacity: 1,       //线透明度
				strokeWeight: 5,        //线宽
				strokeStyle: "solid",   //线样式
				strokeDasharray: [10, 5] //补充线样式
			})
			lines.push(line)
			map.add(line)
			i++
		}
		//画垂直线
		let j=0
		while((bounds.southwest.lat + j*latStep)<(bounds.northeast.lat+0.5*latStep)){
			let line = new AMap.Polyline({
				path: [[bounds.southwest.lng,bounds.southwest.lat+j*latStep],[bounds.northeast.lng,bounds.southwest.lat+j*latStep]],          //设置线覆盖物路径
				strokeColor: "#3366FF", //线颜色
				strokeOpacity: 1,       //线透明度
				strokeWeight: 5,        //线宽
				strokeStyle: "solid",   //线样式
				strokeDasharray: [10, 5] //补充线样式
			})
			lines.push(line)
			map.add(line)
			j++
		}
	})

});



