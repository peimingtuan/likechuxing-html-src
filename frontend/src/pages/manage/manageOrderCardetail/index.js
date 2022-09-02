require('../manageOrder/css/public.css')
require('./css/carDetail/cardetail.css')
require('../manageOrder/css/lost_goods_window.less')
import $ from 'jquery'
import FoundationTools from '../manageOrder/js/functionAjax'
import getApiUrl from './js/getApiUrl';
import myAjax from '../manageOrder/common/myAjax/withJq.js'
import {Confirm,Toast} from '../manageOrder/common/LikeAlert/index'
import waterMark from '../../../../other_modules/like-manageOrder/waterMark'
import Loading from '../../../component/loading'
require('../../../component/vconsole')
//验证页面是否在钉钉浏览器打开
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
//获取url参数
var plate_no = FoundationTools.getUrlParam('plate_no'),
    task_id = FoundationTools.getUrlParam('task_id'),
    type = FoundationTools.getUrlParam('type'),
    carwash_orderid=FoundationTools.getUrlParam('carwash_orderid');//carwash_orderid来自待检查列表的洗车工单id
var begin_branch_lng,
    begin_branch_lat,
    end_branch_lng,
    end_branch_lat;//取车网点，还车网点经纬度
//获取钉钉授权
import ddConfigs from '../manageOrder/js/ddConfigs'
ddConfigs.config()
dd.error(function (err) {
    new Toast("钉钉授权验证失败，请关闭页面重新打开")
});
var loading = new Loading()//加载loading
// 遗失物品列表
let lost_arr = []
//初始化加载图片
$(".dispose img").attr("src", require("./images/carDetail/handle.png"));//故障工单处理
$(".daoh img").attr("src", require("./images/carDetail/daohang.png"));//导航
$(".general img").attr("src", require("./images/carDetail/qungj.png"));//全景check-icon
$(".newbuilt-work-style .check-icon").attr("src", require("./images/carDetail/check-icon.png"));//新建里面的查看
//车辆详情按钮样式更换
$(".change-netstatus>img").attr("src", require("./images/carDetail/top-left.png"));
$(".change-carstatus>img").attr("src", require("./images/carDetail/bottom-left.png"));
$(".currentPage>img").attr("src", require("./images/carDetail/top-right.png"));
$(".morechoice>img").attr("src", require("./images/carDetail/bottom-right.png"));
$(".change-netstatus .chang-net").attr("src", require("./images/carDetail/chang-net.png"));
$(".change-carstatus .chang-statue").attr("src", require("./images/carDetail/chang-statue.png"));
$(".currentPage .location").attr("src", require("./images/carDetail/location.png"));
$(".morechoice .more").attr("src", require("./images/carDetail/more.png"));
//中间图标
$(".cardetail-center .center-img").attr("src", require("./images/carDetail/center.png"));
$(".cardetail-center .left-img").attr("src", require("./images/carDetail/shan-d.png"));
$(".cardetail-center .top-img").attr("src", require("./images/carDetail/open-door.png"));
$(".cardetail-center .right-img").attr("src", require("./images/carDetail/ming-d.png"));
$(".cardetail-center .bottom-img").attr("src", require("./images/carDetail/close-door.png"));
//下拉小图标
$(".cardetail-tool2 .xia-l").attr("src", require("./images/carDetail/xia-l.png"));
$(".transorm-icon img").attr("src", require("./images/carDetail/transorm-icon.png"));
//更多弹框里面小图标
$(".drivingPage img").attr("src", require("./images/carDetail/driver.png"));
$(".policyPage img").attr("src", require("./images/carDetail/bao.png"));
$(".history-carsingle img").attr("src", require("./images/carDetail/singer.png"));
$(".operaHistory img").attr("src", require("./images/carDetail/do-history.png"));
$(".changeRemark img").attr("src", require("./images/carDetail/remark.png"));
$(".asny-oiler img").attr("src", require("./images/carDetail/oiler.png"));
//车辆详情接口
var param = {
    mobile:sessionStorage.getItem("mobile"),
    PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
    content:plate_no
};
if(task_id){//来自调度任务列表
    param.algorithm_task_id=task_id;
    sessionStorage.setItem("task_id",task_id);
}else{
    sessionStorage.removeItem("task_id");
}
//权限配置
var items=[
    'open_door', //开门
    'close_door', //锁门
    'flash_light', //闪灯
    'whistle', //鸣笛
    'driver_license', //行驶证
    'policy', //保险单
    'location', //当前位置
    'history', //操作历史
    'create_oil', //新建加油,调度工单
    'create_dispatch', //新建调度工单
    'create_vehicle', //新建故障工单
    'create_vehicle_wash', //新建洗车工单
    'car_control_change_status', //更改车辆状态
    'change_branch', //更改车辆网点
    'car_failure_list', //查看历史验车单
    'update_remark', //修改备注
    'syn_remain', //同步油电量
    'vehicle_office', //办公用车工单
    'create_accident',//新建保险工单
    'vehicle_move'//新建挪车工单
];
//缓存权限
if(sessionStorage.getItem("peicardetailer")){
    permission(JSON.parse(sessionStorage.getItem("peicardetailer")))
}else{
    myAjax.post(getApiUrl('/permission/list'), {
        mobile: sessionStorage.getItem("mobile"),
        items: items.toString()
    }, function (data) {//0无权限，1有权限
        if (data.status == '0') {
            sessionStorage.setItem("peicardetailer", JSON.stringify(data));
            permission(data)
        } else {
            new Toast(data.msg);
        }
    });
}
function permission(data){
    $(".open-door-value").val(data.data.open_door);//开门
    $(".close-door-value").val(data.data.close_door);//锁门
    $(".flash-light-value").val(data.data.flash_light);//闪灯
    $(".whistle-value").val(data.data.whistle);//鸣笛
    $(".drivingPage-value").val(data.data.driver_license);//行驶证
    $(".policyPage-value").val(data.data.policy);//保险单
    $(".currentPage-value").val(data.data.location);//当前位置
    $(".operaHistory-value").val(data.data.history);//操作历史
    $(".change-carstatus-value").val(data.data.car_control_change_status);//更改车辆状态
    $(".change-netstatus-value").val(data.data.change_branch);//更改车辆网点
    $(".history-carsingle-value").val(data.data.car_failure_list);//查看历史验车单
    $(".changeRemark-value").val(data.data.update_remark);//修改备注
    $(".asny-oiler-value").val(data.data.syn_remain);//同步油电量
    $(".more-alert input").each(function(){
        if($(this).val()=='0'){
            $(this).parent().remove();
        }
    })
    if (data.data.create_oil == '0') {//无权限
        $(".new-cardetail").remove();//新建加油，调度工单
    }
    if (data.data.create_dispatch == '0') {//无权限
        $(".new-diapatch").remove();//新建调度工单
    }
    if (data.data.create_vehicle == '0') {//无权限
        $(".new-trouble").remove();//新建故障工单
    }
    if (data.data.vehicle_office == '0') {//无权限
        $(".new-office").remove();//新建办公用车工单
	}
    if (data.data.create_accident == '0') {//无权限
        $(".new-insurance").remove();//新建事故工单
    }
    if (data.data.create_vehicle_wash == '0') {//无权限
        $(".new-carwash").remove();//新建洗车工单
    }
    if (data.data.vehicle_move == '0') {//无权限
        $(".new-move").remove();//新建挪车工单
    }
}
//车辆详情
myAjax.post(getApiUrl('/work-order/car-detail'), param, function (data) {
    if (data.status == '0') {
        let resultData = data.data;
        if(resultData=='' || JSON.stringify(resultData)=="{}" || resultData instanceof Array){
            new Toast("暂无该车辆详情");
            setTimeout(function(){
                window.history.back();
            },2000)
            return false;
        }else{
            loading.destroy()//清除loading
            //展示页面
            $(".cardetail-block").removeClass("none");
        }
        sessionStorage.setItem("resultData", JSON.stringify(resultData));
        if (resultData.chengdu_limit_record) {//成都限行
            $(".gz-limit").addClass("none");//广州限行隐藏
            if (resultData.chengdu_limit_record == '1') {//今日
                $(".chengdu-limt").removeClass("none");
            } else if (resultData.chengdu_limit_record == '2') {//明日
                $(".chengdu-limt").text("明日限行");
                $(".chengdu-limt").addClass("chengdu-limt2");
                $(".chengdu-limt").removeClass("none");
            }
        }
        if (resultData.limit_record) {//广州限行
            let limit_record = resultData.limit_record,//限行情况
                str = '',
                open='<div class="div-com opencar">开</div>',
                stop= '<div class="div-com stopcar">停</div>',
                wait= '<div class="div-com waitingcar">待</div>';
            if (resultData.plate_no.indexOf("粤A") != '-1' && resultData.plate_no != '') {
                str += '<div class="today"><div>今</div><div class="opencar">开</div></div><div class="moring"><div>明</div><div class="opencar">开</div></div>';
                for (var j = 2; j < limit_record.length; j++) {
                    str += open;
                }
            } else {
                if (limit_record[0].limit == '0') {
                    str +='<div class="today"><div>今</div><div class="opencar">开</div>';
                }else if(limit_record[0].limit == '1'){
                    str +='<div class="today stop-ff8e8e"><div>今</div><div class="stopcar">停</div>';
                }else if(limit_record[0].limit == '2'){
                    str +='<div class="today wait-D1D1D1"><div>今</div><div class="waitingcar">待</div>';
                }
                if (limit_record[1].limit == '0') {
                    str +='</div><div class="moring"><div>明</div><div class="opencar">开</div>';
                }else if(limit_record[1].limit == '1'){
                    str +='</div><div class="moring stop-ff8e8e"><div>明</div><div class="stopcar">停</div>';
                }else if(limit_record[1].limit == '2'){
                    str +='</div><div class="moring wait-D1D1D1"><div>明</div><div class="waitingcar">待</div>';
                }
                str+='</div>'
                for (var j = 2; j < limit_record.length; j++) {
                    if (limit_record[j].limit == '0') {//0不限行，1限行,2表示不确定
                        str += open;
                    } else if (limit_record[j].limit == '1') {
                        str += stop;
                    } else if (limit_record[j].limit == '2') {
                        str += wait;
                    }
                }
            }
            $(".cardetail-content .gz-limit").html(str);
        }
        //初始化加载数据
        sessionStorage.setItem('car_id', resultData.car_id);//车辆id
        sessionStorage.setItem("carcity_id", resultData.city_id);//车辆所在城市id
        var strend = resultData.vin.substring(11, 17);
        //车牌号
        $(".cardetail-content .plate_no").html('<font class="font1">'+resultData.plate_no + '</font> (' + strend + ')');
        //车辆品牌
        $(".cardetail-content .brand_name").text(resultData.brand_name);
        //车辆颜色
        $(".cardetail-content .car-color").text(resultData.color);
        //车机类型
        if(resultData.car_factory){
            $(".cardetail-content .carqube").text(resultData.car_factory);
        }
        //续航里程
        $(".cardetail-content .remain_km").text('约续航' + resultData.remain_km + '公里');
        //车辆状态
        $(".cardetail-content .status_name").text(resultData.status_name);
        //新增车辆状态时长
        $(".status-time .time").text('状态时长：'+resultData.during_sec);
        //取车网点类型
        if (resultData.biz_type == '0') {//合作网点
            $(".mapb").attr("src", require('./images/carDetail/net-b.png'));
            $(".mapb").css({"width":".8rem","top":"-.1rem"})
        } else if (resultData.biz_type == '1') {//非合作网点
            $(".mapb").attr("src", require('./images/carDetail/netB.png'));
            //停车费用
            if (resultData.park_fee != '') {
                $(".park_fee font").text(resultData.park_fee);
                $(".park_fee").removeClass("none");
            }
        }
        begin_branch_lng=resultData.begin_branch_lng;
        begin_branch_lat=resultData.begin_branch_lat;
        //网点是否为限行网点，优化中被取消
        //if (resultData.area) {
        //    if (resultData.area == '1') {
        //        $(".cardetail-content .img2").attr("src", require('./images/carDetail/traffic.png'));
        //    } else {
        //        $(".cardetail-content .img2").attr("src", require('./images/carDetail/notraffic.png'));
        //    }
        //    $(".cardetail-content .img2").removeClass("none");
        //}
        //停车位置
        var current_parking_no = '';
        if (resultData.current_parking_no != '') {
            current_parking_no = '-'+resultData.current_parking_no;
        }
        $(".branch_addr").text(resultData.branch_addr + ' ' + resultData.current_parking_floor +current_parking_no);
        //是否来自调度任务列表，有还车网点
        if (resultData.end_branch_name) {
            if (resultData.end_branch_type == '0') {
                $(".mapb2").attr("src", require('./images/carDetail/net-b.png'));
                $(".mapb2").css({"width":".8rem","top":"-.1rem"})
            } else if (resultData.end_branch_type == '1') {
                $(".mapb2").attr("src", require('./images/carDetail/netB.png'));
            }
            $(".branch_addr2").text(resultData.end_branch_name);
            end_branch_lng=resultData.end_branch_lng;
            end_branch_lat=resultData.end_branch_lat;
            $(".returnnet").removeClass("none");//展示还车网点
            $(".get-block").removeClass("none");//展示取车网点的取字
        }
        //车辆状态的备注信息
        if (resultData.last_desc != '') {
            $(".bottom .span2").text(resultData.last_desc);
            $(".bottom").removeClass("none");
        }
        //是否可以创建工单
        if (resultData.oil_num == '0' && resultData.dispatch_num == '0' && resultData.fault_num.num == '0' &&resultData.repair_num == '0' &&resultData.wash_num == '0'&& resultData.office_num == '0') {
            $(".new_work").addClass("can_new_work");
        }
        if ( resultData.office_num == '0' && resultData.office_deny == '0') {//办公用车，只有空闲和整备可创建
            $(".newBtn10").addClass("can_new_work");
        }
        if ( resultData.move_num == '0'&&resultData.status!=2&&resultData.status!=4) {//挪车，只有租赁中和长租不可创建
            $(".newBtn13").addClass("can_new_work");
        }
        if ( resultData.zombie_num == '0'&&resultData.status==1) {//预警，只有空闲可创建
            $(".newBtn8").addClass("can_new_work");
        }
        let cartype;
        if (resultData.power_type == '1') {//1为电车，其他为油车
            cartype = '充电工单';
        } else {
            cartype = '加油工单';
        }

        //是否有加油或充电工单
        $(".new-cardetail font").text(cartype + "(" + resultData.oil_num + ")");
        //是否有调度工单
        $(".new-diapatch font").text("调度工单 (" + resultData.dispatch_num + ")");
        //是否有故障工单
        $(".new-trouble font").text("故障工单 (" + resultData.fault_num.num + ")");

        //是否有洗车工单
        $(".new-carwash font").text("洗车工单 (" + resultData.wash_num + ")");
        
        //是否有车辆问题跟踪列表
        $(".new-troublerecord font").text("车辆问题记录单 (" + resultData.porblem_num + ")");
        // 遗失工单
        var lost_num = resultData.lost_num || 0
        $(".new-lost font").text("遗失物品工单 (" + lost_num + ")");
        //维修工单
        $(".new-service font").text("维修工单 (" + resultData.repair_num + ")");
        //事故保险工单
        $(".new-insurance font").text("事故保险工单 (" + resultData.accident_num + ")");
        //年检工单
        $(".new-Review font").text("年检工单 (" + Math.abs(resultData.examine_num) + ")");
          // 保养工单
        $(".new-maintain font").text("保养工单 (" + (resultData.maintain_num || 0) + ")");
        //跳转预警工单181204
        $(".new-warning font").text("预警工单 (" + resultData.zombie_num + ")");

        //跳转办公用车工单 181217 new-office
        $(".new-office font").text("办公用车 (" + resultData.office_num + ")");

        var zombie_num = resultData.zombie_num;
        if(zombie_num=='1'){
        	$('.newBtn8').addClass('none');
        	$('.check').removeClass('none')
        }
        //年检限制
        var examine_num =  resultData.examine_num    
        if(examine_num===1){
            $('.newBtn').css('color', '#D1D1D1')
            $('.newBtn2').css('color', '#D1D1D1')
            $('.newBtn3').css('color', '#D1D1D1')
            $('.newBtn4').css('color', '#D1D1D1')
            $('.newBtn5').css('color', '#D1D1D1')
            $('.newBtn6').css('color', '#D1D1D1')
            $('.newBtn7').css('color', '#D1D1D1')
            $('.newBtn8').css('color', '#D1D1D1')
            $('.newBtn9').css('color', '#D1D1D1')
            $('.newBtn10').css('color', '#D1D1D1')
            $('.newBtn11').css('color', '#D1D1D1')
        }else{
            //跳转新建加油工单页面
            $(".newBtn").on("click", function () {
                if ($(this).hasClass("can_new_work")) {
                    if (resultData.power_type == '1') {//1为电车，其他为油车
                        window.location.href = "../manageOrder/chargeWork/charge.html#/newbuiltcharge"
                    } else {
                        window.location.href = "../manageOrder/oilerSingle/newbuiltwork.html"
                    }
                }
            });
            //跳转新建调度工单页面
            $(".newBtn2").on("click", function () {
                if ($(this).hasClass("can_new_work")) {
                    window.location.href = "../manageOrder/schedulingJob/newbuiltdisapat.html"
                }
            });
            //跳转处理故障工单页面
            if (resultData.fault_num.num == '1') {
                $(".newBtn3").addClass("none");
                $(".dispose").removeClass("none");
                sessionStorage.setItem('order_id', resultData.fault_num.order_id);//存储故障工单id
                $(".dispose").on("click", function () {
                    if (resultData.fault_num.step < 2) {
                        window.location.href = "../manageOrder/faultWork/faultdetail2.html"
                    } else if (resultData.fault_num.step == 2) {
                        window.location.href = "../manageOrder/faultWork/faultwork.html"
                    }else{
                        window.location.href = "../manageOrder/faultWork/faultdetail.html"
                    }
                });
            }
            //跳转新建故障工单页面
            $(".newBtn3").on("click", function () {
                if ($(this).hasClass("can_new_work")) {
                    window.location.href = "../manageOrder/faultWork/newbuiltfault.html"
                }
            });
            //跳转新建车辆问题列表页面
            $(".newBtn4").on("click", function () {
                window.location.href = "../manageOrder/carProblemsList/proOrder.html#/proCheck"
            });
            //遗失工单
            if (lost_num < 1) {
                $('.newBtn5').addClass("can_new_work");//可创建遗失工单
                $('.newBtn5').click(function () {
                    window.location.href = '../manageOrderLostManagement/index.html#/new?car_id=' + resultData.car_id
                })
            }
            //跳转维修工单列表
            $(".newBtn6").on("click", function () {
                window.location.href = "../manageOrderService/index.html#/list?car_id=" + resultData.car_id
            });
            //事故保险工单
            $('.newBtn7').click(function () {
                if ($(this).hasClass("can_new_work")){
                    window.location.href = '../accidentWorkList/index.html#/createWork?car_id=' + resultData.car_id+'&plate_no='+resultData.plate_no
                }
            })
            //预警工单
            $(".newBtn8").on("click", function () {
                if($(this).hasClass("can_new_work")){
                    window.location.href = "../manageOrderWarning/index.html#/newWarning?car_id=" + resultData.car_id
                }
            });
            //新建洗车工单
            $(".newBtn9").on("click",function(){
                if ($(this).hasClass("can_new_work")) {
                    if(carwash_orderid){
                        window.location.href = "../manageOrdercarwash/index.html#/newbuiltcarwash?carwash_orderid="+carwash_orderid;
                    }else{
                        window.location.href = "../manageOrdercarwash/index.html#/newbuiltcarwash"
                    }
                }
            });
            $(".newBtn10").on("click", function () {
                if ($(this).hasClass("can_new_work")) {
                    window.location.href = "../manageOrderOfficecar/index.html#/newOffice?car_id=" + resultData.car_id
                }
            });

            // 保养工单
            if (Number(resultData.maintain_num) === 0) {
                $('.newBtn11').addClass("can_new_work");
                $('.newBtn11').click(function () {
                    window.location.href = '../manageOrderMaintenance/index.html#/new?car_id=' + resultData.car_id
                })
            } else {
                $('.newBtn11').text('查看')
                $('.new-maintain').click(function () {
                    window.location.href = '../manageOrderMaintenance/index.html#/carHistoryList?car_id=' + resultData.car_id
                })
            }
        }

      

        //事故保险工单

        $(".new-insurance .left").click(function(){
            window.location.href = '../accidentWorkList/index.html#/?car_id=' + resultData.car_id
        })

        //跳转预警工单181204

        $(".new-warning .left").on("click", function () {
        	window.location.href = "../manageOrderWarning/index.html#/warnHis?car_id=" + resultData.car_id
        })
        
        
        $(".check").on("click", function () {
            window.location.href = "../manageOrderWarning/index.html#/warningOrder?order_id=" + resultData.zombie_order_id
        });
        //跳转办公用车工单 181217 new-office
        $(".new-office .left").on("click", function () {
        	window.location.href = "../manageOrderOfficecar/index.html#/myList?car_id=" + resultData.car_id
        })
        var office_num = resultData.office_num;
        $(".newBtn10").on("click", function () {
        	if ($(this).hasClass("can_new_work")) {
            	window.location.href = "../manageOrderOfficecar/index.html#/newOffice?car_id=" + resultData.car_id
        	}
        });
        //跳转挪车工单 190102 new-move
        $(".new-move font").text("挪车工单 (" + resultData.move_num + ")");
        $(".new-move .left").on("click", function () {
        	window.location.href = "../manageOrderMovecar/index.html#/myList?car_id=" + resultData.car_id
        })
        $(".newBtn13").on("click", function () {
        	if ($(this).hasClass("can_new_work")) {
            	window.location.href = "../manageOrderMovecar/index.html#/newMove?car_id=" + resultData.car_id
        	}
        });
        //新建巡检工单
        $(".newBtn14").on("click", function () {
            window.location.href = "../inspectionWork/index.html#/newbuilt";
            //if ($(this).hasClass("can_new_work")) {
            //    window.location.href = "../inspectionWork/index.html#/newbuilt";
            //}
        });
        //跳转该车辆加油工单历史页
        $(".new-cardetail .left").on("click", function () {
            if (resultData.power_type != '1') {//1为电车，其他为油车
                window.location.href = "../manageOrder/oilerSingle/caroilerhistory.html"
            }else{
                window.location.href = "../manageOrder/chargeWork/charge.html#/carchargelist"
            }
        });
        //跳转该车辆调度工单历史页
        $(".new-diapatch .left").on("click", function () {
            window.location.href = "../manageOrder/schedulingJob/caroilerhistory2.html"
        });
        //跳转该车辆故障工单历史页
        $(".new-trouble .left").on("click", function () {
            window.location.href = "../manageOrder/faultWork/carfaultlist.html"
        });

        //年检跳转列表
        $(".new-Review .left").click(function(){
            window.location.href = '../annualReview/index.html#/carWorkList?car_id=' + resultData.car_id
        })
        if(examine_num===0){
            $('.newBtn12').click(function () {
                if ($(this).hasClass("can_new_work")){
                    window.location.href = '../annualReview/index.html#/createWork?car_id=' + resultData.car_id+'&plate_no='+resultData.plate_no
                }
            })
        }else{
            $('.newBtn12').css('color', '#aaa')
        }
        //跳转该车辆洗车工单历史页
        $(".new-carwash .left").on("click", function () {
            window.location.href = "../manageOrdercarwash/index.html#/operacarwashlist"
        });

        let param2 = {
            mobile: sessionStorage.getItem("mobile"),
            car_info: resultData.plate_no || strend,
            PhoneInfo: sessionStorage.getItem("PhoneInfo") || ''
        };
        //打开车门操作
        $(".open-door").on("click", function () {
            if($(".open-door-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            myAjax.post(getApiUrl('/car/open-door'), param2, function (res) {
                if (res.data.length > 0) {
                    lost_arr = res.data
                    dealLostGoods()
                } else {
                    new Toast(res.msg);
                }
            });
        });
        //锁门操作
        $(".close-door").on("click", function () {
            if($(".close-door-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            myAjax.post(getApiUrl('/car/close-door'), param2, function (data) {
                new Toast(data.msg);
            });
        });
        //闪灯操作
        $(".flash-light").on("click", function () {
            if($(".flash-light-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            myAjax.post(getApiUrl('/car/flash-light'), param2, function (data) {
                new Toast(data.msg);
            });
        });
        //鸣笛操作
        $(".whistle").on("click", function () {
            if($(".whistle-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            myAjax.post(getApiUrl('/car/whistle'), param2, function (data) {
                new Toast(data.msg);
            });
        });
        let plateNumber;
        if (resultData.plate_no == '') {
            plateNumber = strend;
        } else {
            plateNumber = resultData.plate_no;
        }
        //跳转行驶证页面
        $(".drivingPage").on("click", function () {
            window.location.href = "../manageOrder/oilerSingle/drivingLicense.html?name=" + plateNumber;
        });
        //跳转保险单页面
        $(".policyPage").on("click", function () {
            window.location.href = "../manageOrderMain/index.html#/car/insurance?plate_no=" + plateNumber;
        });
        $(".currentPage").on("click", function () {
            if($(".currentPage-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            window.location.href = "../manageOrder/oilerSingle/carLocation.html?name=" + plateNumber;
        });
        //操作历史
        $(".operaHistory").on("click", function () {
            window.location.href = "../manageOrder/oilerSingle/changeHistory.html?name=" + plateNumber;
        });
        //更改车辆状态
        $(".change-carstatus").on("click", function () {
            if($(".change-carstatus-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            if(resultData.status=='2'){
                new Toast("租赁中状态车辆禁止更改状态");
                return false;
            }
            window.location.href = "../manageOrder/destineCar/changecarstatus.html?plate_no=" + plateNumber+"&status="+resultData.status;
        });
        //更改车辆网点
        $(".change-netstatus").on("click", function () {
            if($(".change-netstatus-value").val()=='0'){
                new Toast("暂无该功能权限");
                return false;
            }
            window.location.href = "../manageOrder/commonFile/changenetstatus.html?plate_no=" + plateNumber + "&branch_name=" + resultData.branch_addr + "&floor=" + resultData.current_parking_floor + "&parking_no=" + resultData.current_parking_no + "&branch_id=" + resultData.branch_id;
        });
        //查看历史验车单
        $(".history-carsingle").on("click", function () {
            window.location.href = "../manageOrder/carProblemsList/proOrder.html#/pictureHis";
        });
        //取车网点全景图
        $(".get-general").on("click",function(){
            if(resultData.walk_overall_view && resultData.walk_overall_view!=''){//全景链接
                window.location.href = resultData.walk_overall_view;
            }else{
               new Toast("该网点没有全景图")
            }
        });
        //还车网点全景图
        $(".return-right").on("click",function(){//全景链接
            if(resultData.drive_overall_view && resultData.drive_overall_view!=''){
                window.location.href = resultData.drive_overall_view;
            }else{
                new Toast("该网点没有全景图")
            }
        })
    } else {
        new Toast(data.msg);
    }
});

$('#lost_yes').click(function () {
    myAjax.post(getApiUrl('/lost-record/confirm'), {
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        status: 1,
        order_id: lost_arr[0].id
    }, function (data) {
        lost_arr.splice(0, 1)
        if (lost_arr.length > 0)dealLostGoods()
        else $('.lostBox').hide()
    });
})
$('#lost_no').click(function () {
    myAjax.post(getApiUrl('/lost-record/confirm'), {
        mobile: sessionStorage.getItem("mobile"),
        PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
        status: 2,
        order_id: lost_arr[0].id
    }, function (data) {
        lost_arr.splice(0, 1)
        if (lost_arr.length > 0)dealLostGoods()
        else $('.lostBox').hide()
    });
})
$('#lost_cancel').click(function () {
    $('.lostBox').hide()
})

function dealLostGoods() {
    let item = lost_arr[0]
    $('#lost').text(item.lost)
    $('#lost_detail').text(item.lost_detail)
    $('.lostBox').show()

}

//跳转车辆问题记录单详情页
$(".new-troublerecord .left").on("click", function () {
    window.location.href = '../manageOrder/carProblemsList/proOrder.html#/carProDetail';
});

//导航
var driving;
AMap.plugin(["AMap.Driving"], function () {
    var drivingOption = {
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map: ''
    };
    driving = new AMap.Driving(drivingOption); //构造驾车导航类
});
dd.ready(function () {
    //返回
    if (type == 1) {
        dd.biz.navigation.setLeft({
            control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {
                window.location.href = "../manageOrderMain/index.html#/list";
            },
            onFail: function (err) {
            }
        });
    } else {
        dd.biz.navigation.setLeft({
            control: false,//是否控制点击事件，true 控制，false 不控制， 默认false
            text: '',//控制显示文本，空字符串表示显示默认文本
            onSuccess: function (result) {

            },
            onFail: function (err) {
            }
        });
    }
    //取车网点导航
    $(".daoh1").on("click", function () {
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (data) {
                driving.search(
                    [data.longitude, data.latitude], [begin_branch_lng, begin_branch_lat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            onFail: function (err) {
                new Toast("钉钉获取定位失败")
            }
        });
    });
    //还车网点导航
    $(".daoh2").on("click", function () {
        //钉钉获取定位
        dd.device.geolocation.get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: false,
            useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
            onSuccess: function (data) {
                driving.search(
                    [data.longitude, data.latitude], [end_branch_lng, end_branch_lat],
                    function (status, result) {
                        driving.searchOnAMAP({
                            origin: result.origin,
                            destination: result.destination
                        });
                    });
            },
            onFail: function (err) {
                new Toast("钉钉获取定位失败")
            }
        });
    });
});
//车辆详情按钮样式修改
//打开更多弹框
$(".morechoice span").on("click",function(){
    if($(this).hasClass("open")){
        $(this).removeClass("open");
        $(".transorm-icon img").css("transform", "rotate(0deg)");
        $(".transorm-icon img").css("-webkit-transform", "rotate(0deg)");
        $(".morechoice .outer-img").attr("src",require("./images/carDetail/bottom-right.png"));
        $(".more-alert").addClass("none");
    }else{
        if($(".more-alert span").length>0){
            $(".transorm-icon img").css("transform", "rotate(180deg)");
            $(".transorm-icon img").css("-webkit-transform", "rotate(180deg)");
            $(".morechoice .outer-img").attr("src",require("./images/carDetail/bottom-right2.png"));
            $(".more-alert").removeClass("none");
            $(".morechoice span").addClass("open");
        }else{
            new Toast("暂无更多内容")
        }
    }
});


//修改备注信息
//打开备注弹框
$(".changeRemark").on("click",function(){
    $(".void_writeinfo").val($(".cardetail-content .bottom .span2").text());//带出原有备注信息
    $(".record-number .font1").text($(".void_writeinfo").val().length);
    $(".record-number .font2").text(200-$(".void_writeinfo").val().length);
    $(".more-alert").addClass("none");
    $(".more-alert span").removeClass("open");
    $(".transorm-icon img").css("transform", "rotate(0deg)");
    $(".transorm-icon img").css("-webkit-transform", "rotate(0deg)");
    $(".morechoice .outer-img").attr("src",require("./images/carDetail/bottom-right.png"));
    $(".editremark_window").removeClass("none");
    $(".void_writeinfo").focus();
});
//input事件
$(".void_writeinfo").on("input",function(){
    $(".record-number .font1").text($(this).val().length);
    $(".record-number .font2").text(200-$(this).val().length);
});
//关闭备注弹框
$(".give-up-edit").on("click",function(){
    $(".editremark_window").addClass("none");
    $(".morechoice span").removeClass("open");
});
//长按清空数据
let timeOutEvent;
$(".clear-void").on({
    touchstart: function(e){
        e.preventDefault();//阻止默认行为
        timeOutEvent = setTimeout(function(){
            //此处为长按事件
            $(".void_writeinfo").val("");
            $(".record-number .font1").text('0');
            $(".record-number .font2").text('200');
        },500);
    },
    //touchmove: function(e){
    //    e.preventDefault();
    //    clearTimeout(timeOutEvent);
    //},
    touchend: function(e){
        e.preventDefault();//阻止默认行为
        clearTimeout(timeOutEvent);
        if(timeOutEvent!=0){//点击
            //此处为点击事件
        }
        //return false;
    }
});
//提交备注信息
$(".sub-edit-remark").on("click",function(){
    if($(".void_writeinfo").val()==''){
        new Toast("请先输入备注信息")
        return false;
    }
    myAjax.post(getApiUrl('/work-order/update-remark'), {
        mobile: sessionStorage.getItem("mobile"),
        car_id: sessionStorage.getItem("car_id"),
        remark: $(".void_writeinfo").val()
    }, function (data) {
        $(".editremark_window").addClass("none");
        $(".morechoice span").removeClass("open");
        if(data.status=='0'){
            $(".cardetail-content .bottom .span2").text(data.data.remark);
            $(".cardetail-content .bottom").removeClass("none");
        }else{
            new Toast(data.msg)
        }
    });
});

//同步油电量
$(".asny-oiler").on("click", function () {
    myAjax.post(getApiUrl('/work-order-kerb/endurance-mileage'), {
        mobile:sessionStorage.getItem("mobile"),
        car_id:sessionStorage.getItem("car_id")
    }, function (data) {
        $(".more-alert").addClass("none");
        $(".morechoice span").removeClass("open");
        $(".transorm-icon img").css("transform", "rotate(0deg)");
        $(".transorm-icon img").css("-webkit-transform", "rotate(0deg)");
        $(".morechoice .outer-img").attr("src",require("./images/carDetail/bottom-right.png"));
        new Toast(data.msg);
        if (data.status == '0') {
            //更新续航里程
            $(".remain_km").text('约续航' + data.data.remain + '公里');
        }
    });
});