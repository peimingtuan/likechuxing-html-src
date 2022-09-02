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
require('../css/fourDriveOrPark/dispatchmap.css')
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
//头部提示部分样式修改 xurr
var type = FoundationTools.getUrlParam('type');//已完成加油状态
var enter = FoundationTools.getUrlParam('enter');//已完成加油状态
sessionStorage.setItem('type',type)
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
              //存储当前位置的经纬度
            sessionStorage.setItem('locationsLng', result.longitude);
            sessionStorage.setItem('locationsLat', result.latitude);
            var nowLng = sessionStorage.getItem('fourMapLng')||sessionStorage.getItem('locationsLng');
            var nowLat = sessionStorage.getItem('fourMapLat')||sessionStorage.getItem('locationsLat');
           	var fourId = sessionStorage.getItem('fourMapId')
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
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                type:sessionStorage.getItem("type")||type,
            }
            if(sessionStorage.getItem('city_id')){
            	param.city_id = sessionStorage.getItem('city_id');
            }
            if(enter=='four'){
	            if(sessionStorage.getItem('fourStatus')){param.status = sessionStorage.getItem('fourStatus') }
	            if(sessionStorage.getItem('check_biz_type')){param.biz_type = sessionStorage.getItem('check_biz_type') }
	            if(sessionStorage.getItem('loca_check')){
	            	if(sessionStorage.getItem('loca_check')==3||sessionStorage.getItem('loca_check')==4){
	            		param.drive_day = sessionStorage.getItem('loca_check')
	            	}else{
	            		param.is_local = sessionStorage.getItem('loca_check')
	            	}
	            	
	            }
	        }else{
	        	param.status='1,21';
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
                   
                    param.lng = positionResult.position.lng;
                    param.lat = positionResult.position.lat;
                    netshow(param)
                });
                positionPicker.start();
            });

            function netshow(param) {
                $.post(getApiUrl('/limit-line/map-transfer-list'), param, function (data) {
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
                        if (result.length != '0') {
                            $(".navition-bottom").addClass("none");
                            for (var i = 0; i < result.length; i++) {
                            	sessionStorage.setItem('biz_type',result[i].biz_type);
                            	sessionStorage.setItem('branch_id',result[i].id);
                            	sessionStorage.setItem('addr',result[i].address);
                            	console.log(result[i].lat)
                                let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
                                Array.push(netpoint);
                                addMarker(netpoint, result[i].name, result[i].address, result[i].move_num,result[i].id,result[i].biz_type);//小图标
                                addMarkerbig(netpoint, result[i].name, result[i].address, result[i].move_num,result[i].id,result[i].biz_type);//大图标
                            }
                            //map.setFitView();
                        } else {
                            new Toast("附近五公里内没有停车网点");
                            $(".navition-bottom").addClass("none");
                        }
                    } else {
                        new Toast(data.msg);
                    }
                    // 编写自定义函数,创建小图标标注
                    function addMarker(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
                        let classtype = '';
                        if (biz_type == '0') {
                            classtype = 'marker-route2';
                        } else {
                            classtype = 'marker-route';
                        }
                        let marker = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        if(fourId==branch_id){
                            marker.hide();
                        }
                        smallicon.push(marker);//存放小图标
                        setTimeout(()=>{
								if(type==1){$('.amap-marker .div1 .span1').css('background-color','#e74848');}
								if(type==2){$('.amap-marker .div1 .span1').css('background-color','#F5A623');}
								if(type==3){$('.amap-marker .div1 .span1').css('background-color','#7ED321');}
							},100)
                        marker.on('touchend', function () {
                        	sessionStorage.setItem('branch_id',branch_id);
                        	sessionStorage.setItem('biz_type',biz_type);
                            	sessionStorage.setItem('addr',address);
                            console.log(new Date())
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
                            sessionStorage.setItem('latdetail',netpoint[1]);
                            sessionStorage.setItem('lngdetail',netpoint[0]);
                            $(".navition-bottom .net").text(branch_name);
                            $(".navition-bottom .address").text(address);
                            $(".navition-bottom .lng").val(netpoint[0]);
                            $(".navition-bottom .lat").val(netpoint[1]);
                            $(".navition-bottom").removeClass("none");
                        });
                    }

                    // 编写自定义函数,创建大图标标注
                    function addMarkerbig(netpoint, branch_name, address, lin_recommend_car,branch_id,biz_type) {
                        let classtype = '';
                        if (biz_type == '0') {
                            classtype = 'bigmarker-route2';
                        } else {
                            classtype = 'bigmarker-route';
                        }
                        let marker2 = new AMap.Marker({
                            position: netpoint,
                            offset: new AMap.Pixel(-20.5, -48),
                            content: '<div class="' + classtype + ' marker-marker-bus-from"><div class="div1"><span class="span1">' + lin_recommend_car + '</span></div></div>',   //自定义点标记覆盖物内容
                            map: map//创建时直接赋予map属性
                        });
                        bigicon.push(marker2);//存放大图标
                        marker2.hide();
                        if(fourId==branch_id){
                            marker2.show();	
                            sessionStorage.setItem('latdetail',netpoint[1]);
                            sessionStorage.setItem('lngdetail',netpoint[0]);
                            sessionStorage.setItem('biz_type',biz_type);
                        	sessionStorage.setItem('branch_id',branch_id);
                        	sessionStorage.setItem('addr',address);
                            $(".navition-bottom .net").text(branch_name);
                            $(".navition-bottom .address").text(address);
                            $(".navition-bottom .lng").val(netpoint[0]);
                            $(".navition-bottom .lat").val(netpoint[1]);
                            $(".navition-bottom").removeClass("none");
                        }
                        setTimeout(()=>{
								if(type==1){$('.amap-marker .div1 .span1').css('background-color','#e74848');}
								if(type==2){$('.amap-marker .div1 .span1').css('background-color','#F5A623');}
								if(type==3){$('.amap-marker .div1 .span1').css('background-color','#7ED321');}
							},100)
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
        },
        onFail: function (err) {
            console.log(err);
        }
    });
});

//跳转搜索网点页面
$(".dispatch-search").on("click", function () {
    if(enter=='four'){
		window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=5&fourEnter=four';
	}else{
		window.location.href = '../carProblemsList/proOrder.html#/searchPro?enter=5';
	}
});
//跳转详情页面
$(".net").on("click", function () {
	if(enter=='four'){
		sessionStorage.setItem('fourEnter','four')
	}
    location.href = "fourList.html#/fourDetail"
});

//刷新页面
$(".refure-dispatchpage").on("click", function () {
    window.location.reload();
});

//返回(暂时隐藏)
$(".netdispatch-bottom button").on("click", function () {
    window.history.back();
});