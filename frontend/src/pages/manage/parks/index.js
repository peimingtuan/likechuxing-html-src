require('./css/index.less');
let data = require('./format_1.json')

function init(data){

	AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
		map.addControl(new BasicControl.Zoom({
			position: 'lt'
		}));
	});

	AMapUI.loadUI(['misc/PointSimplifier'], function(PointSimplifier) {
		var pointSimplifierIns = new PointSimplifier({
			map: map, //关联的map
			compareDataItem: function(a, b, aIndex, bIndex) {
				//数据源中靠后的元素优先，index大的排到前面去
				return aIndex > bIndex ? -1 : 1;
			},
			getPosition: function(dataItem) {
				//返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
				return dataItem.loc.split(',')
			},
			getHoverTitle: function(dataItem, idx) {
				//返回数据项的Title信息，鼠标hover时显示
				return dataItem.name + '-' + dataItem.address;
			},
			renderOptions: {
				//点的样式
				pointStyle: {
					fillStyle: 'red' //蓝色填充
				}
			}
		});
		pointSimplifierIns.setData(data);
	})


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

init(data);

