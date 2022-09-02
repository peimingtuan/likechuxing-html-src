<template>
    <div id="chargeworkfinshed" class="none">
        <div id="container-end"></div>
        <div class="trail none">
            <img src="../../image/trail.png"/><br/>
            <span>轨迹加载失败</span>
        </div>
        <div class="center"></div>
        <div class="content-top">
            <span class="span1">{{resultData.plate_no}}</span>
            <span class="span2">{{resultData.brand_name}}</span>
            <!--//本次轨迹里程-->
            <span class="right span3">{{resultData.coord_km}}KM</span>
        </div>
        <div class="content">
            <p class="p1">
                <img class="get-img" src="../../image/get-img.png"/>
                <!-- //取车网点-->
                <span class="span1">{{resultData.begin_branch}}</span><br/>
                <!-- 取车时间-->
                <span class="span2">{{resultData.start_time}}</span>
            </p>
            <p class="p3" v-if="resultData.charge_branch !=''">
                <img class="charge-img" src="../../image/chargeWork/charge.png"/>
                <!-- //充电网点-->
                <span class="span1">{{resultData.charge_branch}}</span><br/>
                <!-- 充电时间-->
                <span class="span2">{{resultData.charge_time}}</span>
            </p>
            <p class="p2" v-if="resultData.end_type =='1'">
                <img class="return-img" src="../../image/return-img.png"/>
                <!-- //还车网点-->
                <span class="span1">{{resultData.end_branch}}</span><br/>
                <!-- 还车时间-->
                <span class="span2">{{resultData.end_time}}</span>
            </p>
        </div>
        <div class="door-btn2">
            <span class="sync-oiler2">同步电量</span>
            <span class="open-cardoor2">开门</span>
            <span class="close-cardoor2">锁门</span>
        </div>
        <div class="sync-detail">
            <span class="remain_km">续航里程<font>{{resultData.remain_km}}</font>km</span>
            <span class="job-detail2 right">工单详情 &#xe623;</span>
        </div>
        <div class="content-bottom">
            <span class="select-net">查询网点</span>
            <span class="back_titlepage">返回首页</span>
        </div>
    </div>
</template>

<script>
    require('../../css/chargeWork/chargeworkfinshed.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import Loading from '../../../../../component/loading'
    export default{
        data()
    {
        return {
            resultData: ''//获取接口数据
            }
    }
    ,
    beforeCreate()
    {
        document.title = '充电工单';
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
        var _this=this;
        var loading = new Loading()//加载loading
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '充电工单',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        //开关车门
        var carparam = {
            mobile: sessionStorage.getItem("mobile"),
            car_info: ''
        }
        //初始化工单详情接口
        var param = {
            mobile: sessionStorage.getItem("mobile"),
            order_id: sessionStorage.getItem("chargeorder_id")//充电工单id
        }
        var arrytrailmany = [],//存放轨迹数组
                starticon = [],//起点
                chargeicon=[],//充电站
                endicon = [];//终点
        myAjax.post(getApiUrl('/vehicle-charging/order-detail'), param, function (data) {
            if (data.status == '0') {
                loading.destroy()//清除loading
                $("#chargeworkfinshed").removeClass("none");
                //存储车辆id
                sessionStorage.setItem("car_id", data.data.car_id);
                carparam.car_info = data.data.plate_no;
                _this.resultData=data.data;
                if(data.data.end_type=='1'){//正常结束
                    if(data.data.charge_coord_list || data.data.end_coord_list){
                            if(data.data.charge_coord_list.length !=0 && data.data.end_coord_list.length !=0){
                                showmap(1);
                            }else{
                                $("#container-end").addClass("none");
                                $(".trail").removeClass("none");
                            }
                    }else{
                        $("#container-end").addClass("none");
                        $(".trail").removeClass("none");
                    }
                }else if(data.data.end_type=='5'){//充电中上线
                    if(data.data.coord_list){
                        if(data.data.coord_list.length !=0){
                            showmap(2)
                        }else{
                            $("#container-end").addClass("none");
                            $(".trail").removeClass("none");
                        }
                    }else{
                        $("#container-end").addClass("none");
                        $(".trail").removeClass("none");
                    }
                }else{//转交其他工单
                    if(data.data.coord_list){
                        if(data.data.coord_list.length !=0){
                            showmap(3)
                        }else{
                            $("#container-end").addClass("none");
                            $(".trail").removeClass("none");
                        }
                    }else{
                        $("#container-end").addClass("none");
                        $(".trail").removeClass("none");
                    }
                }
                function showmap(type){
                    let arrytrail = [],
                            lng,
                            lat;
                    if(type==1){
                        for (var i = 0; i < data.data.charge_coord_list.length; i++) {
                            lng = data.data.charge_coord_list[i].lng;
                            lat = data.data.charge_coord_list[i].lat;
                            arrytrail = [lng, lat];
                            arrytrailmany.push(arrytrail);
                        }
                        starticon = arrytrailmany[0];//起始位置
                        chargeicon = arrytrailmany[arrytrailmany.length - 1];//充电位置
                        for (var i = 0; i < data.data.end_coord_list.length; i++) {
                            lng = data.data.end_coord_list[i].lng;
                            lat = data.data.end_coord_list[i].lat;
                            arrytrail = [lng, lat];
                            arrytrailmany.push(arrytrail);
                        }
                        endicon = arrytrailmany[arrytrailmany.length - 1];//结束位置
                    }else{
                        for (var i = 0; i < data.data.coord_list.length; i++) {
                            lng = data.data.coord_list[i].lng;
                            lat = data.data.coord_list[i].lat;
                            arrytrail = [lng, lat];
                            arrytrailmany.push(arrytrail);
                        }
                        starticon = arrytrailmany[0];
                        if(type==2){//充电中上线
                            chargeicon = arrytrailmany[arrytrailmany.length - 1];
                        }else{
                            endicon = arrytrailmany[arrytrailmany.length - 1];
                        }
                    }
                    //创建地图
                    var map = new AMap.Map('container-end', {
                        zoom: 12
                    });
                    //添加点标记，并使用自己的icon
                    if(starticon.length!=0){
                        let startmark = new AMap.Marker({
                            map: map,
                            position: starticon,
                            offset: new AMap.Pixel(-12.5, -30),
                            icon: new AMap.Icon({
                                size: new AMap.Size(25, 30),  //图标大小
                                image: require('../../image/start-img.png'),
                                imageSize: new AMap.Size(23, 30)
                            })
                        });
                    }
                    if(chargeicon.length!=0){
                        let chargemark = new AMap.Marker({//充电站
                            map: map,
                            position: chargeicon,
                            offset: new AMap.Pixel(-12.5, -30),
                            icon: new AMap.Icon({
                                size: new AMap.Size(25, 30),  //图标大小
                                image: require('../../image/chargeWork/chargestation.png'),
                                imageSize: new AMap.Size(23, 30)
                            })
                        });
                    }
                    if(endicon.length!=0){
                        let endtmark = new AMap.Marker({
                            map: map,
                            position: endicon,
                            offset: new AMap.Pixel(-12.5, -30),
                            icon: new AMap.Icon({
                                size: new AMap.Size(25, 30),  //图标大小
                                image: require('../../image/end-img.png'),
                                imageSize: new AMap.Size(25, 30)
                            })
                        });
                    }
                    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {

                        if (!PathSimplifier.supportCanvas) {
                            alert('当前环境不支持 Canvas！');
                            return;
                        }

                        var pathSimplifierIns = new PathSimplifier({
                            zIndex: 100,
                            map: map, //所属的地图实例

                            getPath: function (pathData, pathIndex) {

                                return pathData.path;
                            },
                            getHoverTitle: function (pathData, pathIndex, pointIndex) {

                                return null;
                            },
                            renderOptions: {

                                renderAllPointsIfNumberBelow: -1,//绘制路线节点，如不需要可设置为-1
                                //轨迹线的样式
                                pathLineStyle: {
                                    strokeStyle: 'green',
                                    lineWidth: 5,
                                    dirArrowStyle: true
                                }
                            }

                        });

                        window.pathSimplifierIns = pathSimplifierIns;

                        //设置数据
                        pathSimplifierIns.setData([{
                            path: arrytrailmany
                        }]);

                        //选中路线0
                        //pathSimplifierIns.setSelectedPathIndex(0);
                    });
                }
            } else {
                new Toast(data.msg)
            }
        });
        //同步电量
        $(".sync-oiler2").on("click", function () {
            myAjax.post(getApiUrl('/work-order-kerb/endurance-mileage'), {
                mobile:sessionStorage.getItem("mobile"),
                car_id:sessionStorage.getItem("car_id")
            }, function (data) {
                new Toast(data.msg);
                if (data.status == '0') {
                    $(".sync-detail .remain_km font").text(data.data.remain);
                }
            });
        });
        //开门
        $(".open-cardoor2").on("click", function () {
            myAjax.post(getApiUrl('/car/open-door'), carparam, function (data) {
                new Toast(data.msg);
            });
        });
        //锁门
        $(".close-cardoor2").on("click", function () {
            myAjax.post(getApiUrl('/car/close-door'), carparam, function (data) {
                new Toast(data.msg);
            });
        });
        //跳转结束工单详情页
        $(".job-detail2").on("click", function () {
            window.location.href = "charge.html#/finsheddetail";
        });
        //网点查询
        $(".select-net").on("click", function () {
            window.location.href = "../../endwork/index.html#/selectmapnet2"//共用网点查询页面
        });
        //结束工单后返回首页
        $(".back_titlepage").on("click", function () {
            window.location.href = "../../manageOrderMain/index.html#/list";
        });

    }
    }
</script>
