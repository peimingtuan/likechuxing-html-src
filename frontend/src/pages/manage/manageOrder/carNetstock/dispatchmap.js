/**
 * Created by Administrator on 2018/5/30.
 */
/**
 * Created by Administrator on 2018/5/28.
 */
/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/carNetstock/dispatchmap.css')
//require('../../../../component/vconsole')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
import ddConfigs from '../js/ddConfigs'
ddConfigs.config();//钉钉授权
//初始化加载图片
$(".current_location2 img").attr("src", require("../image/mapfg.png"));//定位icon
$(".refure-dispatchpage img").attr("src",require("../image/refre-icon.png"));//刷新
$(".navition-bottom .right img").attr("src", require('../image/dispatch/navition-icon.png'));
$(".checkout img").attr("src", require('../image/icon_check.png'));
$(".guide_map img").attr("src", require('../image/icon_guide.png'));
//头部提示部分样式修改 xurr
var type = FoundationTools.getUrlParam('type');//已完成加油状态
var enter = FoundationTools.getUrlParam('enter');//已完成加油状态
var lngdetail = FoundationTools.getUrlParam('lng');
var latdetail = FoundationTools.getUrlParam('lat');
var searchId = FoundationTools.getUrlParam('branch_id');
let BRANCH_ID,LNG,LAT,BIZ_TYPE,CURRENT_COUNTS,ADDRESS;

sessionStorage.setItem('type',type);
$(function(){
	var topHei = $('.dispatch-top').height();
	$(".dispatch-search").css('top',topHei+20);
})
var loading = new Loading()//加载loading
dd.ready(function () {
    //钉钉获取定位
    dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,
        withReGeocode: true,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {
//              存储当前位置的经纬度
            sessionStorage.setItem('locationsLng', result.longitude);
            sessionStorage.setItem('locationsLat', result.latitude);
            var nowLng = lngdetail||sessionStorage.getItem('locationsLng');
            var nowLat = latdetail||sessionStorage.getItem('locationsLat');
            var map = new AMap.Map('dispatch-map', {
                resizeEnable: true,
                zoom: 13,
                center: [nowLng, nowLat]
            });

            //初始化加载数据
            
            var param = {
                mobile: sessionStorage.getItem("mobile")||'13521758602',
                lng: nowLng||'116.298611',
                lat: nowLat||'40.044257',
                city_id: sessionStorage.getItem('city_id'),
                car_num:'0',
                biz_type:'-1',
                property:'-1',
            }
            var Array = [],
                smallicon = [],//存放小图标
                bigicon = [];//存放大图标
            AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {//拖动定位图标
                var positionPicker = new PositionPicker({
                    position: [nowLng, nowLat],
                    mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    iconStyle: {//自定义外观
                        url: require("../image/location.png"),//图片地址
                        size: [25, 50],  //要显示的点大小，将缩放图片
                        ancher: [12.5, 50],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
                    },
                    map: map
                });
                positionPicker.on('success', function (positionResult) {
                	
				    computeDis(positionResult.position.lng,positionResult.position.lat);
                	
                    
                });
                positionPicker.start();
            });
           function computeDis(lng,lat){//计算拖动距离
				var m1 = new AMap.Marker({
			        map: map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(nowLng, nowLat)
			    });
	        	var m2 = new AMap.Marker({
			        map: map,
			        draggable:true,
			        content:'<div class="map_mark"></div>',
			        position:new AMap.LngLat(lng, lat)
			    });
		        var p1 = m1.getPosition();
		        var p2 = m2.getPosition();
		        var distances = Math.round(p1.distance(p2));
		        var path = [p1,p2];
		        console.log(distances)
               	if(distances==0||distances>=1000){
               		param.car_num=sessionStorage.getItem('car_nums')||'0';
	                param.biz_type=sessionStorage.getItem('biz_types')||'-1';
	                param.property=sessionStorage.getItem('propertys')||'-1';
                    param.lng = lng;
                    param.lat = lat;
               		netshow(param)
               	}
           };
            function netshow(param) {
                $.post(getApiUrl('/branch-car-stock/map-branch'), param, function (data) {
                    let result = data.data;
                    if (data.status == '0') {
                    	 // 使用clearMap方法删除所有覆盖物
	                    map.clearMap();
	                    Array = [];
	                    smallicon = [];
	                    bigicon = [];
                        loading.destroy()//清除loading
						$('.refure-dispatchpage').css('display','block');
						$('.current_location2').css('display','block');
						$('.checkout').css('display','block');
                        if (result.length != '0') {
                            $(".navition-bottom").addClass("none");
                            $('.guide_map').css("display",'none');
                            $('.current_location2').css('bottom','1rem');
                            $('.right_all').css('bottom','1.5rem');
                            for (var i = 0; i < result.length; i++) {
                                let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
                                Array.push(netpoint);
                                // "current_counts"//当前车辆数    "free_counts"//空闲车辆数" over_counts"//超车数"  total_parking_fee"//总计停车费用
                                addMarker(result[i].id,netpoint, result[i].name, result[i].address,result[i].current_counts ,result[i].free_counts,result[i].over_counts,result[i].total_parking_fee,result[i].biz_type);//小图标
                                addMarkerbig(result[i].id,netpoint, result[i].name, result[i].address,result[i].current_counts ,result[i].free_counts,result[i].over_counts,result[i].total_parking_fee,result[i].biz_type);//大图标
                            }
                            //map.setFitView();
                        } else {
                            new Toast("附近五公里内没有停车网点");
                            $(".navition-bottom").addClass("none");
                            $('.guide_map').css("display",'none');
                            $('.current_location2').css('bottom','1rem');
                            $('.right_all').css('bottom','1.5rem');
                        }
                    } else {
                        new Toast(data.msg);
                    }
                    // 编写自定义函数,创建小图标标注
                    function addMarker(branch_id, netpoint, branch_name, address, current_counts,free_counts,over_counts,total_parking_fee,biz_type) {
                        let classtype = '',OVERCOUNT=over_counts;
                        if(over_counts>0){
                        	OVERCOUNT ="+"+over_counts;
                        }
                        if (biz_type == '0') {
                            classtype = 'marker-route2';
                        } else {
                            classtype = 'marker-route';
                        }
                        let marker = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + current_counts + '</span><span class="span2">' + free_counts + '</span><span class="span3">' + OVERCOUNT + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        if(searchId==branch_id){
                            marker.hide();
                        }
                        smallicon.push(marker);//存放小图标
                        marker.on('touchend', function () {
                            for (let j = 0, len = smallicon.length; j < len; j++) {
                                smallicon[j].show();
                            }
                            let that = this;
                            that.hide();
                            let index = smallicon.indexOf(that);
                            for (let i = 0, len = smallicon.length; i < len; i++) {
                                bigicon[i].hide();
                            }
                            bigicon[index].show();
                            
                            BRANCH_ID = branch_id;
	                        LNG = netpoint[0];
	                        LAT = netpoint[1];
	                        BIZ_TYPE = biz_type;
	                        CURRENT_COUNTS = current_counts;
	                        ADDRESS = address;
                            biz_type != '0'?$('.right').css('display','block'):$('.right').css('display','none')
                            $('.right p span').text(total_parking_fee)
                            $(".navition-bottom .net").text(branch_name);
                            $(".navition-bottom .address").text(address);
                            $(".guide_map .lng").val(netpoint[0]);
                            $(".guide_map .lat").val(netpoint[1]);
                            $(".navition-bottom").removeClass("none");
                            $('.guide_map').css('display','block');
                            $('.current_location2').css('bottom','-1.5rem');
                            $('.right_all').css('bottom','6.5rem')
                            
                        });
                    }

                    // 编写自定义函数,创建大图标标注
                    function addMarkerbig(branch_id, netpoint, branch_name, address, current_counts,free_counts,over_counts,total_parking_fee,biz_type) {
                        let classtype = '',OVERCOUNT=over_counts,ISBIG='';
                        if(over_counts>0){
                        	OVERCOUNT ="+"+over_counts;
                        }
                        if (biz_type == '0') {
                            classtype = 'bigmarker-route2';
                        } else {
                            classtype = 'bigmarker-route';
                        }
                        
//                      if(searchId==branch_id){
//                      	ISBIG = 'isbig'
//                      }else{
//                      	ISBIG = 'notbig'
//                      }
                        let marker2 = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            zIndex:103,
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + current_counts + '</span><span class="span2">' + free_counts + '</span><span class="span3">' + OVERCOUNT + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        bigicon.push(marker2);//存放大图标
                        marker2.hide();
                        if(searchId==branch_id){
                            map.setZoom('15'); 
                            marker2.show();
                            BRANCH_ID = branch_id;
	                        LNG = netpoint[0];
	                        LAT = netpoint[1];
	                        BIZ_TYPE = biz_type;
	                        CURRENT_COUNTS = current_counts;
	                        ADDRESS = address;
                            biz_type != '0'?$('.right').css('display','block'):$('.right').css('display','none')
                            $('.right p span').text(total_parking_fee)
                            $(".navition-bottom .net").text(branch_name);
                            $(".navition-bottom .address").text(address);
                            $(".guide_map .lng").val(netpoint[0]);
                            $(".guide_map .lat").val(netpoint[1]);
                            $(".navition-bottom").removeClass("none");
                            $('.guide_map').css('display','block');
                            $('.current_location2').css('bottom','-1.5rem');
                            $('.right_all').css('bottom','6.5rem')
                        }
                        marker2.on('click', function () {

                        });
                    }
                });
            }

            //导航
            var driving;
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
                    [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')], [$(this).parent().find(".lng").val(), $(this).parent().find(".lat").val()],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            });
            //定位
            $(".current_location2").on("click", function () {
                map.panTo([sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]);
            });
            //记录打开弹框前已筛选的值
			var colorArray = [];
			//打开筛选弹框
			$(".netstockContentFilter").on("click", function () {
			    colorArray = [];
			    $(".confirm-carstock span").each(function () {
//			    	if($(this).children('input').val()==)
			        if ($(this).hasClass("color")) {
			            colorArray.push($(this));
			        }
			    });
			   
			    $(".carstock_window").removeClass("none");
			});
			//关闭筛选弹框
			$(".close-carstock").on("click", function () {
			    $(".confirm-carstock span").removeClass("color");
			    for (var i = 0; i < colorArray.length; i++) {
			        colorArray[i].addClass("color");
			    }
			    $(".carstock_window").addClass("none");
			})
			
			//点击确定按钮关闭弹框
			$(".carstate-sure").on("click", function () {
				var biz_type=[],property=[],biz_types,propertys,car_nums;
			    
			    $(".confirm-carnetstate .color").each(function () {//网点类型
			        biz_type.push($(this).find("input").val());
			    });
			    $(".confirm-carnetstate2 .color").each(function () {//网点属性
			        property.push($(this).find("input").val());
			    });
			    $(".confirm-carstate .color").each(function () {//超车数量
			        car_nums = $(this).find("input").val();
			    });
			    biz_types = biz_type.join(',');
			    propertys = property.join(',');
			    
			    let param = {
			        mobile: sessionStorage.getItem('mobile'),
			        city_id: sessionStorage.getItem('city_id'),//权限城市id
			        page: 1, //页数
			        car_num: car_nums,//超车数量
			        lng: nowLng,
			        lat: nowLat,
			        property: propertys,//网点属性
			        biz_type: biz_types//网点类型
			    }
			    sessionStorage.setItem('car_nums',car_nums);
			    sessionStorage.setItem('biz_types',biz_types);
			    sessionStorage.setItem('propertys',propertys);
			    
			    netshow(param);
			    $(".carstock_window").addClass("none");
			})
			//点击选项变换颜色
			$(".state").on("click", function () {
			    if ($(".confirm-carstate .color").length > 1) {
			        if ($(this).hasClass("color")) {
			            $(this).removeClass("color");
			        } else {
			            $(this).addClass("color");
			        }
			    } else {
			        $(this).addClass("color");
			    }
			    $(".allcarstate").removeClass("color");
			});
			$(".nettype").on("click", function () {
			    if ($(".confirm-carnetstate .color").length > 1) {
			        if ($(this).hasClass("color")) {
			            $(this).removeClass("color");
			        } else {
			            $(this).addClass("color");
			        }
			    } else {
			        $(this).addClass("color");
			    }
			    $(".allnettype").removeClass("color");
			});
			$(".nettype2").on("click", function () {
			    if ($(".confirm-carnetstate2 .color").length > 1) {
			        if ($(this).hasClass("color")) {
			            $(this).removeClass("color");
			        } else {
			            $(this).addClass("color");
			        }
			    } else {
			        $(this).addClass("color");
			    }
			    $(".allnettype2").removeClass("color");
			});
			
			//点击重置按钮
			$(".carstate-reset").on("click", function () {
			    $(".nettype").removeClass("color");
			    $(".allnettype").addClass("color");
			    $(".nettype2").removeClass("color");
			    $(".allnettype2").addClass("color");
			    $(".state").removeClass("color");
			    $(".allcarstate").addClass("color");
			});
			//点击全部
			$(".allcarstate").on("click", function () {
			    $(".state").removeClass("color");
			    $(this).addClass("color");
			});
			$(".allnettype").on("click", function () {
			    $(".nettype").removeClass("color");
			    $(this).addClass("color");
			});
			$(".allnettype2").on("click", function () {
			    $(".nettype2").removeClass("color");
			    $(this).addClass("color");
			});
        },
        onFail: function (err) {
            console.log(err);
        }
    });
});

//跳转搜索网点页面
$(".dispatch-search").on("click", function () {
	sessionStorage.removeItem('biz_types');
    sessionStorage.removeItem('propertys');
    sessionStorage.removeItem('car_nums');
    window.location.href = './netselect.html?type=4'
});
//跳转详情页面
$(".net").on("click", function () {
	sessionStorage.removeItem('biz_types');
    sessionStorage.removeItem('propertys');
    sessionStorage.removeItem('car_nums');
	window.location.href = "./netdetail.html?branch_id=" +BRANCH_ID + "&lng=" + LNG + "&lat=" + LAT + "&biz_type=" + BIZ_TYPE + "&current_counts=" + CURRENT_COUNTS + "&address=" + ADDRESS;
});

//刷新页面
$(".refure-dispatchpage").on("click", function () {
    window.location.reload();
});

//返回(暂时隐藏)
$(".netdispatch-bottom button").on("click", function () {
    window.history.back();
});

