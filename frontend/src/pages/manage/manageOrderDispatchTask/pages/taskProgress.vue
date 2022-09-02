<!--@xurr 1115 任务进度 -->
<template>
	<div class="taskProgress">
		<div class="dispatch-top">
		    *注：地图中相同颜色的图标为同一调度任务下的当前车辆位置（车辆图标）和调度网点位置（网点图标）。
		</div>
		<div id="dispatch-map"></div>
		<!--刷新页面-->
		<div class="refure-dispatchpage" @click="filterSearch">
		    <img src="../images/icon_refresh.png"/>
		</div>
		<!--定位icon-->
		<div class="current_location2"><img src="../images/mapfg.png"/></div>
		<!--导航弹框-->
		<div class="navition-bottom none">
		    <div class="left" @click="goList()">
		        <span class="net"></span><br/>
		        <span class="address"></span>
		    </div>
		    <div class="right">
		        <img class="navition-icon" src="../images/navition-icon.png"/><br/>
		        <span class="">导航</span>
		        <input type="hidden" value="" class="lng"/>
		        <input type="hidden" value="" class="lat"/>
		    </div>
		</div>
		
	</div>
</template>

<script>
	import $ from 'jquery'
	import {getOspApiUrl} from '../js/getApiUrl'
  	import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
  	import userData from '../../../../../other_modules/like-manageOrder/UserData' 
  	import SlideUpBox from '../../../../../other_modules/like-manageOrder/component/SlideUpBox'
	import FilterSingle from '../../../../../other_modules/like-manageOrder/component/FilterSingle'
	import FilterMultiple from '../../../../../other_modules/like-manageOrder/component/FilterMultiple'
  	import LikeButton from '../../../../../other_modules/like-manageOrder/component/Button'
  
  	import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
  	require("../../../../../other_modules/like-manageOrder/css/FilterBox.less")
  	require("../css/modal.css")
  	const OrderStatus = require('../js/orderStatus')
	export default {
	    name: "disMap",
	     components: {
	      SlideUpBox,
	      FilterSingle,
	      FilterMultiple,
	      LikeButton,
	    },
	    data () {
	      return {
	        dataReady: false,
	        item: {},
	        plate_no: '',
	        map:'',
	        smallicon:'',
	        bigicon:'',
	        Array:[],
	        branchArr:[],
	        modal:false,
	        filter_show: false,
	        status:0,
	        task_id:'',//任务id
	        car_lnglat:[],
	        marker:'',
	        driving:'',
			//任务类型
			//任务类型
			
	      }
	    },
	    mounted () {
	    	this.creatMap();
	    },
	    methods: {
	    	creatMap(){
	    		dd.getLocation().then(res => {
		          userData.save({
		            locationsLng: this.$route.query.lng||res.longitude,
		            locationsLat: this.$route.query.lat||res.latitude
		          })
//		          userData.save({
//		            locationsLng: this.$route.query.lng||'116.298611',
//		            locationsLat: this.$route.query.lat||'40.044257',
//		            mobile:'13521758602'
//		          })
			       this.map = new AMap.Map('dispatch-map', {
			            resizeEnable: true,
			            zoom: 13,
			            center: [userData.state.locationsLng, userData.state.locationsLat]
			        });
		        //初始化加载数据
		            var param = {
				        mobile:userData.state.mobile||'13521758602',
				        pack_id:this.$route.query.pack_id
		            }
		            this.Array = [];
		            this.branchArr = [];
		            this.smallicon = [];//存放小图标
		            this.bigicon = [];//存放大图标
		            var _this = this;
		            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {//拖动定位图标
		                var positionPicker = new PositionPicker({
		                    position: [userData.state.locationsLng, userData.state.locationsLat],
		                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
		                    iconStyle: {//自定义外观
		                        url: require("../images/location.png"),//图片地址
		                        size: [25, 50],  //要显示的点大小，将缩放图片
		                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
		                    },
		                    map: _this.map
		                });
		                positionPicker.on('success', function (positionResult) {
		                	if(_this.car_lnglat.length!=0){
		                		console.log(_this.car_lnglat)
		                	}else{
		                		_this.netshow(param);
		                	}
		                     	
		                });
		                positionPicker.start();
		            });  
		          
		          
		        }).catch(err => {
		          this.$_LIKE_toast('钉钉定位失败，请允许获取地理位置')
		    	})
	    	},
	    	netshow(param){
	    		var _this = this;
	    		myAjax.post(getOspApiUrl('algorithm/pack-process'), param).then(res => {
	                    let result = res.data;
	                    if (res.status == '0') {
	                    	 // 使用clearMap方法删除所有覆盖物
//		                    _this.map.clearMap();
							$('.refure-dispatchpage').css('display','block');
							$('.current_location2').css('display','block');
	                        if (result.length != '0') {
	                            let netpoint,netpoint2;
	                            for (var i = 0; i < result.length; i++) {
	                            	let carData = result[i].cars;
	                            	this.car_lnglat.push(carData);
	                            	for(var j=0;j<carData.length;j++){
	                            		if(carData[j].car_lng||carData[j].car_lat){
		                            		netpoint = [carData[j].car_lng, carData[j].car_lat];//当前网点位置信息
			                                _this.Array.push(netpoint);
			                                addMarker(netpoint, result[i].end_branch_name, result[i].end_branch_address,result[i].end_branch_type,i+1,result[i].end_branch_lng,result[i].end_branch_lat);//小图标
			                                addMarkerbig(netpoint, result[i].end_branch_name, result[i].end_branch_address,result[i].end_branch_type,i+1,result[i].end_branch_lng,result[i].end_branch_lat);//大图标
	                            		}
	                            	}
	                            	netpoint2 = [result[i].end_branch_lng, result[i].end_branch_lat];//当前网点位置信息
		                            _this.branchArr.push(netpoint2)
	                            	addMarker2(netpoint2, result[i].end_branch_name, result[i].end_branch_address,result[i].end_branch_type,i+1,result[i].end_branch_lng,result[i].end_branch_lat,netpoint);//小图标
		                            addMarkerbig2(netpoint2, result[i].end_branch_name, result[i].end_branch_address,result[i].end_branch_type,i+1,result[i].end_branch_lng,result[i].end_branch_lat,netpoint);//小图标
	                            }
	                        } else {
//	                            this.$_LIKE_toast("附近五公里内没有停车网点");
//	                            $(".navition-bottom").addClass("none");
	                        }
	                    } else {
	                        this.$_LIKE_toast(res.msg)
	                    }
	                    // 编写自定义函数,创建小图标标注
	                    function addMarker(netpoint, branch_name, address,biz_type,car_num,branch_lng,branch_lat) {
	                        let classtype = '';
	                        if (biz_type == '0') {
	                            classtype = 'marker-route2';
	                        } else {
	                            classtype = 'marker-route';
	                        }
	                        let car_img=require('../images/icon_car'+car_num+'.png');
	                        _this.marker = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            content: '<div class="' + classtype + ' marker-marker-bus-from"><img class="marker_img" src="'+car_img+'"/></div>',   //自定义点标记覆盖物内容
	                            map: _this.map//创建时直接赋予map属性
	                        });
	                        
	                        
	                        _this.smallicon.push(_this.marker);//存放小图标
	                        _this.marker.on('touchend', function () {
	                        	sessionStorage.setItem('biz_type',biz_type);
	                            	sessionStorage.setItem('addr',address);
	                            for (let j = 0, len = _this.smallicon.length; j < len; j++) {
	                                _this.smallicon[j].show();
	                            }
	                            let that = this;
	                            that.hide();
	                            let index = _this.smallicon.indexOf(that);
	                            for (let i = 0, len = _this.smallicon.length; i < len; i++) {
	                                _this.bigicon[i].hide();
	                            }
	                            _this.bigicon[index].show();
	                            sessionStorage.setItem('latdetail',netpoint[1]);
	                            sessionStorage.setItem('lngdetail',netpoint[0]);
	                            $(".navition-bottom .net").text(branch_name);
	                            $(".navition-bottom .address").text(address);
	                            $(".navition-bottom .lng").val(netpoint[0]);
	                            $(".navition-bottom .lat").val(netpoint[1]);
	                            $(".navition-bottom").removeClass("none");
	                            $(".current_location2").css('bottom','1.5rem')
				            	$(".refure-dispatchpage").css('bottom','1rem')
	                            _this.map.clearMap();
								_this.map.remove(_this.marker);
	                            _this.roadLine(car_num,branch_lng,branch_lat,netpoint);
	                            _this.car_lnglat = [];
//	                            _this.map.setFitView();
	                        });
	                    }
	                    function addMarker2(netpoint, branch_name, address,biz_type,car_num,branch_lng,branch_lat,carNet) {
	                        _this.marker = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            content: '<div class="branch_icon marker-marker-bus-from"><div class="div1"><span class="span1 bc' + car_num + '">' + car_num + '</span></div></div>',   //自定义点标记覆盖物内容
	                            map: _this.map//创建时直接赋予map属性
	                        });
	                        _this.smallicon.push(_this.marker);//存放小图标
	                        _this.marker.on('touchend', function () {
	                        	sessionStorage.setItem('biz_type',biz_type);
	                            	sessionStorage.setItem('addr',address);
	                            for (let j = 0, len = _this.smallicon.length; j < len; j++) {
	                                _this.smallicon[j].show();
	                            }
	                            let that = this;
	                            that.hide();
	                            let index = _this.smallicon.indexOf(that);
	                            for (let i = 0, len = _this.smallicon.length; i < len; i++) {
	                                _this.bigicon[i].hide();
	                            }
	                            _this.bigicon[index].show();
	                            sessionStorage.setItem('latdetail',netpoint[1]);
	                            sessionStorage.setItem('lngdetail',netpoint[0]);
	                            $(".navition-bottom .net").text(branch_name);
	                            $(".navition-bottom .address").text(address);
	                            $(".navition-bottom .lng").val(netpoint[0]);
	                            $(".navition-bottom .lat").val(netpoint[1]);
	                            $(".navition-bottom").removeClass("none");
				            	var carAll = _this.car_lnglat[car_num-1];
				            	$(".current_location2").css('bottom','1.5rem')
				            	$(".refure-dispatchpage").css('bottom','1rem')
				            	if(carAll){
		                            for(var i=0;i<carAll.length;i++){
		                            	var netpoints = [carAll[i].car_lng,carAll[i].car_lat]
		                            	if(carAll[i].car_lng||carAll[i].car_lat||carAll[i].car_lat!=0||carAll[i].car_lng!=0){
			                            	_this.map.clearMap();
						            		_this.map.remove(_this.marker);
			                            	_this.roadLine(car_num,branch_lng,branch_lat,netpoints,carAll)
			                            	_this.car_lnglat = [];
		                            	
		                            	}else{
		                            		this.$_LIKE_toast('未获取定位，请检查车机！')
		                            	}
		                            }
	                           	}
				            
		                    });
		                        
	                        
	                    }
	                    // 编写自定义函数,创建大图标标注
	                    function addMarkerbig2(netpoint, branch_name, address,biz_type,car_num,branch_lng,branch_lat) {
	                        let marker2 = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            zIndex:103,
	                            content: '<div class="big_branch_icon marker-marker-bus-from"><div class="div1 big_div"><span class="span1 big_span bc' + car_num + '">' + car_num + '</span></div></div>',   //自定义点标记覆盖物内容
	                            map: _this.map//创建时直接赋予map属性
	                        });
	                       _this.bigicon.push(marker2);//存放大图标
	                        marker2.hide();
	                        marker2.on('click', function () {
	
	                        });
	                    }
	                    // 编写自定义函数,创建大图标标注
	                    function addMarkerbig(netpoint, branch_name, address,biz_type,car_num,branch_lng,branch_lat) {
	                        let classtype = '';
	                        if (biz_type == '0') {
	                            classtype = 'bigmarker-route2';
	                        } else {
	                            classtype = 'bigmarker-route';
	                        }
	                        let car_img=require('../images/icon_car'+car_num+'.png');
	                        let marker2 = new AMap.Marker({
	                            position: netpoint,
	                            offset: new AMap.Pixel(-20.5, -48),
	                            zIndex:103,
	                            content: '<div class="' + classtype + ' marker-marker-bus-from big_icon"><img class="marker_img" src="'+car_img+'"/></div>',   //自定义点标记覆盖物内容
	                            map: _this.map//创建时直接赋予map属性
	                        });
	                        
	                       _this.bigicon.push(marker2);//存放大图标
	                        marker2.hide();
	                        marker2.on('click', function () {
	
	                        });
	                    }
	                     //导航
			            let driving;
			            AMap.plugin(["AMap.Driving"], function () {
			                var drivingOption = {
			                    policy: AMap.DrivingPolicy.LEAST_TIME,
			                    map: ''
			                };
			                driving = new AMap.Driving(drivingOption); //构造驾车导航类
			            });
			            //根据起终点坐标规划驾车路线
			            $(".navition-icon").on("click", function () {
			                driving.search(
			                    [userData.state.locationsLng, userData.state.locationsLat], [$(this).parent().find(".lng").val(), $(this).parent().find(".lat").val()],
			                    function (status, result) {
			                        driving.searchOnAMAP({
			                            origin: result.origin,
			                            destination: result.destination
			                        });
			                    });
			            });
			            //定位
			            $(".current_location2").on("click", function () {
			                _this.map.panTo([userData.state.locationsLng, userData.state.locationsLat]);
			            });
	                }).catch(err => {
				        console.log(err)
				    })
	    	},
	    	//汽车绘制路线
	    	roadLine(num,branch_lng,branch_lat,car,carAll){
	    		$(".current_location2").css('bottom','1.5rem')
				$(".refure-dispatchpage").css('bottom','1rem')
                 //导航
	            let _this=this;
			    //调用clear()函数清除上一次结果，可以清除地图上绘制的路线以及路径文本结果
			    if(_this.driving){
			    	_this.driving.clear();
	            }     
	            _this.car_lnglat = [];
	            AMap.plugin(["AMap.Driving"], function () {
	                var drivingOption = {
	                    policy: AMap.DrivingPolicy.LEAST_TIME,
	                    map: _this.map,
	                    hideMarkers:true,
	                };
	                _this.driving = new AMap.Driving(drivingOption); //构造驾车导航类
	            });
	            var car_lat=car[1],car_lng=car[0];
	            _this.driving.search(new AMap.LngLat(branch_lng, branch_lat), 
	            	new AMap.LngLat(car_lng,car_lat), function(status, result) {
	            		 if (status === 'complete') {
	                        $(".navition-bottom").removeClass("none");
				        } else {
				            console.log('获取驾车数据失败：' + result)
				        }
				});
				
	    	},
	    	
	    	filterShow () {
		        this.filter_show = true;
	      	},
	      	filterClose () {
	        	this.filter_show = false;
	      	},
	      	filterSearch(){
	      		$(".navition-bottom").addClass("none");
		        this.car_lnglat = [];
		        this.creatMap();
	      	},
	    	
	    },
  	}
</script>

<style scoped>
	body {
    width: 100%;
    height: 100%;
}

.box-footer {
        padding-top: 0.15rem;
        width: 100%;
        box-sizing: border-box;
    }
    .btn {
        width: 47%;
    }
.dispatch-top {
        position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    padding: .1rem .15rem;
    min-height: .25rem;
    line-height: .2rem; 
    font-size: .14rem;
    /* white-space: nowrap; */
    background: #fff;
    z-index: 100;
}

#dispatch-map {
    position: absolute;
    width: 100%;
    height: 100%;
}


/*ˢ�°�ť*/
.refure-dispatchpage {
	display: none;
    position: fixed;
    bottom: .1rem;
    right: .1rem;
    width: .45rem;
    height: .45rem;
    border-radius: 50%;
    z-index: 100;
}

.refure-dispatchpage img {
    width: .45rem;
}

/*��λicon*/
.current_location2 {
	display: none;
    position: fixed;
    bottom: .6rem;
    right: .12rem;
    width: .4rem;
    height: .4rem;
    z-index: 100;
}

.current_location2 img {
    vertical-align: middle;
    width: .4rem;
}

/*����*/
.netdispatch-bottom {
    width: 95%;
    position: fixed;
    bottom: .8rem;
    padding: 0 2.5%;
}

.netdispatch-bottom button {
    width: 100%;
    height: .8rem;
    background: #187aeb;
    border: none;
    outline: none;
    border-radius: 3px;
    text-align: center;
    color: #fff;
}

/*��������*/
.navition-bottom {
    box-sizing: border-box;
    position: fixed;
    bottom: .15rem;
    left: 2.5%;
    width: 95%;
    height: .8rem;
    border-radius: 5px;
    background: #fff;
}

.navition-bottom .left {
    box-sizing: border-box;
    padding: .18rem;
    width: 80%;
    height: 1rem;
    border-right: 1px solid #dcdcdc;
}

.navition-bottom .left span {
    width: 2.5rem;
    display: inline-block;
    /*line-height: .32rem;*/
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.navition-bottom .left .address {
    color: #999999;
}

.navition-bottom .right {
    box-sizing: border-box;
    width: 20%;
    height: .8rem;
    text-align: center;
}

.navition-bottom .right img {
    width: .21rem;
    vertical-align: middle;
    margin-top: .21rem;
}

/*Сͼ��*/
#dispatch-map /deep/ .amap-marker .marker-route,#dispatch-map /deep/ .amap-marker .marker-route2 {
    position: absolute;
    width: .13rem;
    height: .25rem;
    display: flex;
    justify-content: flex-end;
}
#dispatch-map /deep/ .amap-marker .branch_icon {
	display: flex;
    justify-content: center;
	display: -webkit-flex;
     -webkit-justify-content: center;
    position: absolute;
    width: .33rem;
    height: .38rem;
    background: url("../images/icon_point.png") no-repeat;
    background-size: 100%;
}
#dispatch-map /deep/ .amap-marker .big_branch_icon {
	display: flex;
    justify-content: center;
	display: -webkit-flex;
     -webkit-justify-content: center;
    position: absolute;
    width: .38rem;
    height: .43rem;
    background: url("../images/icon_point.png") no-repeat;
    background-size: 100%;
}

#dispatch-map /deep/.marker_img{
	max-width: 100%!important;
}
.marker_img{
	width: 100%;
	height: 100%;
	max-width: 100%!important;
}
/*��ͼ��*/
#dispatch-map /deep/ .amap-marker .bigmarker-route {
	/*display: flex;
    justify-content: flex-end;*/
    position: absolute;
    width: .18rem;
    height: .4rem;
    
}

#dispatch-map /deep/ .amap-marker .bigmarker-route2 {
	/*display: flex;
    justify-content: flex-end;*/
    position: absolute;
    width: .18rem;
    height: .4rem;
    
}

#dispatch-map /deep/ .amap-marker .div1 {
    box-sizing: border-box;
   	width: .2rem;
    height: .2rem;
    white-space: nowrap;
    /*padding: 2px;*/
    position: absolute;
    top: .05rem;
    background: #fff;
    border-radius: 10px;
    /*使数字居中处理*/
   display: flex;
   justify-content: center;
   align-items: center;
}
#dispatch-map /deep/ .amap-marker .div1.big_div {
    box-sizing: border-box;
   	width: .22rem;
    height: .22rem;
    white-space: nowrap;
    /*padding: 2px;*/
    position: absolute;
    top: .05rem;
    background: #fff;
    border-radius: 10px;
    /*使数字居中处理*/
   display: flex;
   justify-content: center;
   align-items: center;
}

#dispatch-map /deep/ .amap-marker .div1 .span1 {
    display: inline-block;
    width: .2rem;
    height: .2rem;
    box-sizing: border-box;
    line-height: 18px;
    /*margin-right: 8px;*/
    background: #fff;
    border-radius: 50%;
    text-align: center;
    font-size: .12rem;
    color: #fff;
    /*position: absolute;*/
}
#dispatch-map /deep/ .amap-marker .div1 .span1.big_span {
    display: inline-block;
    width: .22rem;
    height: .22rem;
    box-sizing: border-box;
    /*margin-right: 8px;*/
    background: #fff;
    border-radius: 50%;
    text-align: center;
    font-size: .12rem;
    color: #fff;
    /*position: absolute;*/
}

#dispatch-map /deep/ .amap-marker .div1 .span2 {
    display: inline-block;
    width: 18px;
    line-height: 18px;
    font-size: .12rem;
    position: absolute;
}

#dispatch-map /deep/ .amap-marker .marker-route2 .div1 .span2 {
    color: #999999;
}
#dispatch-map /deep/ .amap-marker .bigmarker-route2 .div1 .span2 {
    color: #999999;
}
.checkout{
	display: none;
    position: absolute;
    bottom: 1.64rem;
    right: .07rem;
    width: .45rem;
    height: .45rem;
    z-index: 100;
    text-align: center;
}
.checkout img {
    vertical-align: middle;
    width: .45rem;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc1{
	background: #ef1a27!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc2{
	background: #f99220!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc3{
	background: #f0e300!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc4{
	background: #88e422!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc5{
	background: #00853e!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc6{
	background: #08b2ce!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc7{
	background: #2f3093!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc8{
	background: #8f00ff!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc9{
	background: #fc66c7!important;
}
#dispatch-map /deep/ .amap-marker .div1 .span1.bc10{
	background: #8b572a!important;
}
</style>