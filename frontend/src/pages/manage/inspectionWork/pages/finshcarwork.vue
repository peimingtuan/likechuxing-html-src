<template>
    <div id="finshcarwork">
        <div id="container-end"></div>
        <div class="trail none">
            <img src="../images/trail.png"/><br/>
            <span>轨迹加载失败</span>
        </div>
        <div class="center"></div>
        <div class="content-top">
            <span class="span1" v-if="resultData!=''">{{resultData.task.plate_no}}</span>
            <span class="span2" v-if="resultData!=''">{{resultData.task.car_status}}</span>
            <!--//本次轨迹里程-->
            <span class="right span3"></span>
        </div>
        <div class="content" v-if="resultData!=''">
            <p class="p1">
                <img class="get-img" src="../images/get-img.png"/>
                <!-- 取车网点-->
                <span class="span1">{{resultData.task.branch_name}}</span><br/>
                <!-- 取车时间-->
                <span class="span2">{{resultData.create_time}}</span>
            </p>
            <p class="p2" v-if="resultData.end_branch">
                <img class="return-img" src="../images/return-img.png"/>
                <!-- //还车网点-->
                <span class="span1">{{resultData.end_branch.name}}</span><br/>
                <!-- 还车时间-->
                <span class="span2">{{resultData.end_branch.end_time}}</span>
            </p>
        </div>
        <div class="door-btn2">
            <span class="sync-oiler2">同步油/电量</span>
            <span class="open-cardoor2">开门</span>
            <span class="close-cardoor2">锁门</span>
        </div>
        <div class="sync-detail">
            <span class="remain_km" v-if="resultData !=''">续航里程<font>{{resultData.task.remain_km}}</font>km</span>
            <span class="job-detail2 right">工单详情 &#xe623;</span>
        </div>
        <div class="content-bottom">
            <button class="select-net">查询网点</button>
            <button class="back_titlepage">返回首页</button>
        </div>
    </div>
</template>
<script>
    require("../css/finshcarwork.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Loading from '../../../../component/loading'
    export default{
        data ()
    {
        return {
            resultData: '',//获取接口数据
            opendoorbtn:true,//开门
            closedoorbtn:true, //关门
            plate_no:''
        }
    }
    ,
    created()
    {
        this.getdetail();//初始化工单详情
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
        //初始化车辆轨迹接口
        var arrytrailmany = [],//存放轨迹数组
                starticon = [],//起点
                endicon = [];//终点
        myAjax.post(getApiUrl('/vehicle-inspection/order-detail'),{
            mobile:sessionStorage.getItem("mobile"),
            order_id: _this.$route.query.id //工单id
        }).then(data=>{
            if (data.status == '0') {
                $(".content-top .span3").text(data.data.total_km+'KM')
                loading.destroy()//清除loading
                if(data.data.end_coord_list){
                    if(data.data.end_coord_list.length !=0){
                        showmap();
                    }else{
                        $("#container-end").addClass("none");
                        $(".trail").removeClass("none");
                    }
                }else{
                    $("#container-end").addClass("none");
                    $(".trail").removeClass("none");
                }
                function showmap(){
                    let arrytrail = [],
                            lng,
                            lat;
                        for (var i = 0; i < data.data.end_coord_list.length; i++) {
                            lng = data.data.end_coord_list[i].lng;
                            lat = data.data.end_coord_list[i].lat;
                            arrytrail = [lng, lat];
                            arrytrailmany.push(arrytrail);
                        }
                        starticon = arrytrailmany[0];//起点
                        endicon = arrytrailmany[arrytrailmany.length - 1];//终点

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
                                image: require('../images/start-img.png'),
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
                                image: require('../images/end-img.png'),
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
                _this.$_LIKE_toast(data.msg)
            }
        }).catch(data => {
            console.log(data)
        });

        //同步油电量
        $(".sync-oiler2").on("click", function () {
            myAjax.post(getApiUrl('/work-order-kerb/endurance-mileage'),{
                mobile:sessionStorage.getItem("mobile"),
                car_id:sessionStorage.getItem("car_id")
            }).then(data=>{
                _this.$_LIKE_toast(data.msg);
                if (data.status == '0') {
                    $(".sync-detail .remain_km font").text(data.data.remain);
                }
            }).catch(data => {
                console.log(data)
            });
        });
        //开门
        $(".open-cardoor2").on("click", function () {
            if(_this.opendoorbtn){
                _this.opendoorbtn=false;
                myAjax.post(getApiUrl('/car/open-door'),{
                    mobile:sessionStorage.getItem("mobile"),
                    car_info:_this.plate_no
                }).then(data=>{
                    _this.$_LIKE_toast(data.msg);
                }).catch(data => {
                    console.log(data)
                });
            }else{
                _this.$_LIKE_toast('开门过于频繁，请稍后重试')
            }
            setTimeout(function(){
                _this.opendoorbtn=true;
            },5000)
        });
        //锁门
        $(".close-cardoor2").on("click", function () {
            if(_this.closedoorbtn){
                _this.closedoorbtn=false;
                myAjax.post(getApiUrl('/car/close-door'),{
                    mobile:sessionStorage.getItem("mobile"),
                    car_info:_this.plate_no
                }).then(data=>{
                    _this.$_LIKE_toast(data.msg);
                }).catch(data => {
                    console.log(data)
                });
            }else{
                _this.$_LIKE_toast('关门过于频繁，请稍后重试')
            }
            setTimeout(function(){
                _this.closedoorbtn=true;
            },5000)
        });
        //跳转结束工单详情页
        $(".job-detail2").on("click", function () {
            window.location.href = "./index.html#/finshworkdetail?id="+ _this.$route.query.id;//工单id;
        });
        //网点查询
        $(".select-net").on("click", function () {
            window.location.href = '../endwork/index.html#/selectmapnet2'
        });
        //结束工单后返回首页
        $(".back_titlepage").on("click", function () {
            window.location.href = "../manageOrderMain/index.html#/list";
        });
    }
    ,
    methods: {
        getdetail(){
            myAjax.post(getApiUrl('/vehicle-wash/detail'),{
                mobile:sessionStorage.getItem("mobile"),
                id:sessionStorage.getItem("carwash_orderid") //工单id
            }).then(res=>{
                if(res.status==0){
                    this.resultData=res.data;
                    this.plate_no=res.data.task.plate_no;//车牌号
                    sessionStorage.setItem("car_id",this.resultData.task.car_id);
                }else{
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
    }
</script>