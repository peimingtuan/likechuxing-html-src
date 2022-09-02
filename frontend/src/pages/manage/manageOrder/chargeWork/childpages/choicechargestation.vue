<!--xurr chargenetinfo.type 1 办公用车工单入口-->
<template>
    <div id="choicechargestation">
        <div class="dispatch-search">
            <span class="net-enter">请输入网点名称</span>
            <span class="icon">&#xe605;</span>
        </div>
        <div id="dispatch-map"></div>
        <!--刷新页面-->
        <div class="refure-dispatchpage">
            <img src="../../image/refre-icon.png"/>
        </div>
        <!--定位icon-->
        <div class="current_location2"><img src="../../image/mapfg.png"/></div>
        <!--导航弹框-->
        <div class="navition-bottom none">
            <span class="net">中关村科技地面网点</span>
            <input type="hidden" class="net_id" value=""/>
        </div>
        <div class="netdispatch-bottom">
            <button>提交</button>
        </div>
    </div>
</template>

<script>
    require('../../css/chargeWork/choicechargestation.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import Loading from '../../../../../component/loading'
    import ddConfigs from '../../js/ddConfigs'
    export default{
        beforeCreate ()
    {
        document.title = '选择充电站';
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {
        $(".mask_div").show();//展示水印
    }
    ,
    mounted()
    {
        $(".mask_div").hide();//隐藏水印
        ddConfigs.config();//钉钉授权
        var loading = new Loading()//加载loading
        //接收URL参数
        var chargenetinfo = FoundationTools.getUrlvue(location.hash);
        dd.error(function (error) {
            new Toast("钉钉授权验证失败，请关闭页面重新打开")
        });
        dd.ready(function () {
             //钉钉获取定位
            dd.device.geolocation.get({
                targetAccuracy: 200,
                coordinate: 1,
                withReGeocode: false,
                useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
                onSuccess: function (result) {
        //存储当前位置的经纬度
        sessionStorage.setItem('locationsLng',result.longitude || 116.300175 );
        sessionStorage.setItem('locationsLat',result.latitude ||  40.044955);
        var map = new AMap.Map('dispatch-map', {
            resizeEnable: true,
            zoom: 13,
            center: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')]
        });

        //初始化加载数据
        var param = {
            mobile: sessionStorage.getItem("mobile") || 18501935330,
            lng: sessionStorage.getItem('locationsLng'),
            lat: sessionStorage.getItem('locationsLat')
        }
        if(chargenetinfo.name){//来自搜索页面
            param.lng = chargenetinfo.lng;
            param.lat = chargenetinfo.lat;
            map.panTo([param.lng,param.lat])
        }
         var  Array = [],
                 smallicon = [],//存放小图标
                 bigicon = [];//存放大图标
        AMapUI.loadUI(['misc/PositionPicker'], function (PositionPicker) {
            var positionPicker = new PositionPicker({
                position: [sessionStorage.getItem('locationsLng'), sessionStorage.getItem('locationsLat')],
                mode: 'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                iconStyle: {//自定义外观
                    url: require("../../image/location.png"),//图片地址
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
            $.post(getApiUrl('/vehicle-charging/charging-branch'), param, function (data) {
                let result = data.data;
                $(".netdispatch-bottom button").removeClass("submit-btn");//提交按钮置灰
                if (data.status == '0') {
                    // 使用clearMap方法删除所有覆盖物
                    map.clearMap();
                    Array = [];
                    smallicon = [];
                    bigicon = [];
                    loading.destroy()//清除loading
                    if (result.length != '0') {
                        $(".navition-bottom").addClass("none");
                        for (var i = 0; i < result.length; i++) {
                            let netpoint = [result[i].lng, result[i].lat];//当前网点位置信息
                            Array.push(netpoint);
                            addMarker(result[i].id, result[i].name, netpoint);//小图标
                            addMarkerbig(netpoint,result[i].id);//大图标
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
                function addMarker(net_id, branch_name, netpoint) {
                    let marker = new AMap.Marker({
                        position: netpoint,//marker所在的位置
                        offset: new AMap.Pixel(-23, -50),
                        icon: new AMap.Icon({
                            size: new AMap.Size(46, 50),  //图标大小
                            image: require("../../image/chargeWork/chargeicon.png"),
                            imageSize: new AMap.Size(46, 50)
                        }),
                        map: map//创建时直接赋予map属性
                    });
                    smallicon.push(marker);//存放小图标
                    if(chargenetinfo.name) {//来自搜索页面
                        if(chargenetinfo.branch_id==net_id){
                            marker.hide();
                            $(".navition-bottom .net").text(chargenetinfo.name);//充电站名称
                            $(".navition-bottom .net_id").val(net_id);//充电站id
                            $(".navition-bottom").removeClass("none");
                            $(".netdispatch-bottom button").addClass("submit-btn");//提交按钮点亮
                        }
                    }
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
                        $(".navition-bottom .net").text(branch_name);//充电站名称
                        $(".navition-bottom .net_id").val(net_id);//充电站id
                        $(".navition-bottom").removeClass("none");
                        $(".netdispatch-bottom button").addClass("submit-btn");//提交按钮点亮
                    });
                }

                // 编写自定义函数,创建大图标标注
                function addMarkerbig(netpoint,net_id) {
                    let marker2 = new AMap.Marker({
                        position: netpoint,//marker所在的位置
                        offset: new AMap.Pixel(-25, -60),
                        icon: new AMap.Icon({
                            size: new AMap.Size(50, 60),  //图标大小
                            image: require("../../image/chargeWork/bigchargeicon.png"),
                            imageSize: new AMap.Size(50, 60)
                        }),
                        map: map//创建时直接赋予map属性
                    });
                    bigicon.push(marker2);//存放大图标
                    marker2.hide();
                    if(chargenetinfo.name) {//来自搜索页面
                        if(chargenetinfo.branch_id==net_id){
                            marker2.show();
                        }
                    }
                    marker2.on('touchend', function () {

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
                    new Toast("获取当前定位失败")
                }
            });
        });

        //跳转搜索网点页面
        $(".dispatch-search").on("click", function () {
            location.href = "charge.html#/searchchargenet";
        });

        //刷新页面
        $(".refure-dispatchpage").on("click", function () {
            window.location.reload();
        });
        //提交
        $(".netdispatch-bottom button").on("click", function () {
        	if($(this).hasClass("submit-btn")&&chargenetinfo.type==1){
                window.location.href="../../manageOrderOfficecar/index.html#/chargeInfo?order_id="+chargenetinfo.order_id+"&branch_name="+$(".navition-bottom .net").text()+"&branch_id="+$(".navition-bottom .net_id").val();//跳转充电信息页面
        	}
            if($(this).hasClass("submit-btn")){
                window.location.href="charge.html#/addchargeinfo?branch_name="+$(".navition-bottom .net").text()+"&net_id="+$(".navition-bottom .net_id").val();//跳转充电信息页面
            }
        });
    }
    }
</script>
