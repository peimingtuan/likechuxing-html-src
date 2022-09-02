/**
 * Created by Administrator on 2018/4/20.
 */
require('../css/public.css')
require('../css/commonFile/jobend.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
import Loading from '../../../../component/loading'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//获取url参数
var type = FoundationTools.getUrlParam('type');
var loading = new Loading()//加载loading
//初始化加载图片
$(".get-img").attr("src", require('../image/get-img.png'));
$(".return-img").attr("src", require('../image/return-img.png'));
$(".trail img").attr("src", require('../image/trail.png'));
//开关车门
var carparam = {
    mobile: sessionStorage.getItem("mobile"),
    car_info: ''
}
//初始化工单详情接口
var param = {
    mobile: sessionStorage.getItem("mobile"),
    work_order_id: sessionStorage.getItem("id"),
    coord_flag: '1',//是否返回轨迹信息
}
var arrytrailmany = [],//存放轨迹数组
    starticon = [],//起点
    endicon = [];//终点
$.post(getApiUrl('/work-order/detail'), param, function (data) {
    var result = data,
        status = result.status,
        data = result.data,
        msg = result.msg;
    loading.destroy()//清除loading
    if (status == '0') {
        //存储工单车辆详情
        sessionStorage.setItem("resultData2", JSON.stringify(data));
        carparam.car_info = data.plate_no;
        //车辆id
        sessionStorage.setItem("car_id", data.car_id);
        $(".content-top .span1").text(data.plate_no);
        $(".content-top .span2").text(data.brand_name);
        $(".content-top .span3").text(data.coord_km + "KM");//本次轨迹里程
        $(".content .p1 .span1").text(data.branch_addr);//取车网点
        $(".content .p1 .span2").text(data.begin_time);//取车时间
        $(".sync-detail .remain_km font").text(data.remain_km);//新增续航里程
        if (data.end_branch_id != '0') {
            $(".content .p2").removeClass("none");
            $(".content .p2 .span1").text(data.end_branch_addr);//还车网点
            $(".content .p2 .span2").text(data.end_time);//还车时间
        }
        if (data.coord_list.length == 0) {
            $("#container-end").addClass("none");
            $(".trail").removeClass("none");
        } else {
            let arrytrail = [],
                lng,
                lat;
            for (var i = 0; i < data.coord_list.length; i++) {
                lng = data.coord_list[i].lng;
                lat = data.coord_list[i].lat;
                arrytrail = [lng, lat];
                arrytrailmany.push(arrytrail);
            }
            console.log(arrytrailmany);
            starticon = arrytrailmany[0];
            endicon = arrytrailmany[arrytrailmany.length - 1];
            console.log(starticon);
            console.log(endicon);
            //创建地图
            var map = new AMap.Map('container-end', {
                zoom: 12
            });
            //添加点标记，并使用自己的icon
            var startmark = new AMap.Marker({
                map: map,
                position: starticon,
                offset: new AMap.Pixel(-12.5, -30),
                icon: new AMap.Icon({
                    size: new AMap.Size(25, 30),  //图标大小
                    image: require('../image/start-img.png'),
                    imageSize: new AMap.Size(23, 30)
                })
            });
            var endtmark = new AMap.Marker({
                map: map,
                position: endicon,
                offset: new AMap.Pixel(-12.5, -30),
                icon: new AMap.Icon({
                    size: new AMap.Size(25, 30),  //图标大小
                    image: require('../image/end-img.png'),
                    imageSize: new AMap.Size(25, 30)
                })
            });
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
        new Toast(msg)
    }
});
//跳转结束工单详情页
$(".job-detail").on("click", function () {
    if (type == '2') {
        window.location.href = "./jobdetails.html?type=2";
    } else {
        window.location.href = "./jobdetails.html";
    }
});
//同步油量
$(".sync-oiler").on("click", function () {
    $.post(getApiUrl('/work-order-kerb/endurance-mileage'), {
        mobile: sessionStorage.getItem("mobile"),
        car_id: sessionStorage.getItem("car_id")
    }, function (data) {
        new Toast(data.msg);
        if (data.status == '0') {
            $(".sync-detail .remain_km font").text(data.data.remain);
        }
    });
});
//开门
$(".open-cardoor").on("click", function () {
    let resultData = FoundationTools.syncEvent(carparam, getApiUrl('/car/open-door')),
        mSg = resultData.msg;
    new Toast(mSg);
});
//锁门
$(".close-cardoor").on("click", function () {
    let resultData = FoundationTools.syncEvent(carparam, getApiUrl('/car/close-door')),
        mSg = resultData.msg;
    new Toast(mSg);
});
//网点查询
$(".select-net").on("click", function () {
    window.location.href = "../../endwork/index.html#/selectmapnet2"
});
//结束工单后返回首页
$(".back_titlepage").on("click", function () {
    window.location.href = "../../manageOrderMain/index.html#/list";
});