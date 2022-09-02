<template>
    <div id="carchargelist">
        <div class="chargelist-content">
            <span class="chargelistSelect">&#xe605;&nbsp;&nbsp;搜索</span>
            <span class="chargelistFilter">&#xe638;&nbsp;&nbsp;筛选</span>
            <span class="chargelistRefle">&#xe8d0;&nbsp;&nbsp;刷新</span>
        </div>
        <ul class="charge-List">

        </ul>
        <!--confirm提示框-->
        <div class="confirm_window common_cover none">
            <div class="common_content">
                <div class="confirm-title">
                    筛选
                    <span class="close-confirm">&#xe601;</span>
                </div>
                <div class="confirm-content">
                    <p>工单状态</p>

                    <p class="confirm-carstate">
                        <span class="allcaroiler color">全部<input type="hidden" value=""/></span>
                        <span class="caroiler">待充电<input type="hidden" value="1"/></span>
                        <span class="caroiler">充电开始<input type="hidden" value="2"/></span>
                        <span class="caroiler">充电中上线<input type="hidden" value="3"/></span>
                        <span class="caroiler">充电完成<input type="hidden" value="4"/></span>
                        <span class="caroiler">工单完成<input type="hidden" value="5"/></span>
                    </p>

                    <p>充电方式</p>

                    <p class="confirm-style">
                        <span class=""><input class="all" type="radio" name="chargestyle" value=""
                                              checked/>全部</span><br>
                        <span class=""><input type="radio" name="chargestyle" value="1"/>快充</span>
                        <span class=""><input type="radio" name="chargestyle" value="2"/>慢充</span>
                    </p>
                </div>
                <div class="confirm-bottom">
                    <button class="confirm-reset">重置</button>
                    <button class="confirm-sure">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../css/chargeWork/carchargelist.css')
    import $ from 'jquery'
    import getApiUrl from '../../js/getApiUrl'
    import FoundationTools from '../../js/functionAjax'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import myAjax from '../../common/myAjax/withJq.js'
    import PullUpDown from '../../../../../component/pullDonwRefresh/index'
    import Loading from '../../../../../component/loading'
    export default {
        data ()
    {
        return {

        }
    }
    ,
    beforeCreate()
    {
        document.title = '车辆充电工单';
    },
    mounted()
    {
        dd.ready(function () {
            document.addEventListener('backbutton', function (e) {

            });
            dd.biz.navigation.setTitle({
                title: '车辆充电工单',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        var loading = new Loading()//加载loading
        //初始化车辆充电工单接口
        var param = {
            mobile: sessionStorage.getItem('mobile'),
            car_id: sessionStorage.getItem('car_id'),
            limit: 10,//每页大小
            page: '1'//页码
        };
        //手动固定父元素的高，否则scroll不起作用
        $('.charge-List').height($(window).height() - $('.chargelist-content').height());
        show(param)
        function show(param) {
            myAjax.post(getApiUrl('/vehicle-charging/order-list'), param, function (data) {
                if (data.status == '0') {
                    loading.destroy()//清除loading
                    var recordrentList = data;
                    var str = '',
                            strstart = '',
                            strend = '';
                    if(recordrentList.data.length==0){
                        new Toast("暂无数据")
                    }else{
                        for (var i = 0; i < recordrentList.data.length; i++) {
                            strstart = recordrentList.data[i].vin.substring(0, 11);
                            strend = recordrentList.data[i].vin.substring(11, 17);
                            let type = '';
                            if(recordrentList.data[i].status=='2' || recordrentList.data[i].status=='3'){
                                if (recordrentList.data[i].type == '1') {
                                    type = '<span>快充</span>';
                                } else if (recordrentList.data[i].type == '2') {
                                    type = '<span>慢充</span>';
                                }
                            }
                            str += '<li><input type="hidden" value="' + recordrentList.data[i].id + '" class="order_id"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span class="right">充电' + recordrentList.data[i].id + '</span><br/>' +
                                    '<span>' + recordrentList.data[i].status_name + '</span><span>约续航' + recordrentList.data[i].remain_km + '公里</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span>' + type + '<br/><span class="work-time"><font>工单时长：</font>' + recordrentList.data[i].last_time + '</span></li>';
                        }
                    }
                    $(".charge-List").html(str);
                    //上拉，下拉获取数据
                    var index = 0;
                    let pullUpDown = new PullUpDown({
                        listClassName: '',
                        content: str,
                        parent: document.querySelector('.charge-List'),
                        pullDownRefresh: function (cb) {
                            let that = this
                            setTimeout(function () {
                                let str = '',
                                        strstart = '',
                                        strend = '';
                                param.page = 1;
                                index = 0;
                                myAjax.post(getApiUrl('/vehicle-charging/order-list'), param, function (data) {
                                    let recordrentList = data;
                                    if (recordrentList.status != '0') {
                                        new Toast(recordrentList.msg);
                                        return false;
                                    }
                                    if (recordrentList.data.length != 0) {
                                        for (var i = 0; i < recordrentList.data.length; i++) {
                                            strstart = recordrentList.data[i].vin.substring(0, 11);
                                            strend = recordrentList.data[i].vin.substring(11, 17);
                                            let type = '';
                                            if(recordrentList.data[i].status=='2' || recordrentList.data[i].status=='3'){
                                                if (recordrentList.data[i].type == '1') {
                                                    type = '<span>快充</span>';
                                                } else if (recordrentList.data[i].type == '2') {
                                                    type = '<span>慢充</span>';
                                                }
                                            }
                                            str += '<li><input type="hidden" value="' + recordrentList.data[i].id + '" class="order_id"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span class="right">充电' + recordrentList.data[i].id + '</span><br/>' +
                                                    '<span>' + recordrentList.data[i].status_name + '</span><span>约续航' + recordrentList.data[i].remain_km + '公里</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span>' + type + '<br/><span class="work-time"><font>工单时长：</font>' + recordrentList.data[i].last_time + '</span></li>';
                                        }
                                        that.changeContent(str);
                                        cb(true)
                                    }else{
                                        new Toast("暂无数据")
                                    }
                                });
                            }, 400)
                        },
                        pullUpLoad: function (cb) {
                            let that = this
                            setTimeout(function () {
                                let str = '',
                                        strstart = '',
                                        strend = '';
                                index++;
                                param.page = index + 1;
                                myAjax.post(getApiUrl('/vehicle-charging/order-list'), param, function (data) {
                                    let recordrentList = data;
                                    if (recordrentList.status != '0') {
                                        new Toast(recordrentList.msg);
                                        return false;
                                    }
                                    if (recordrentList.data.length == 0) {
                                        cb(false)
                                    } else {
                                        for (var i = 0; i < recordrentList.data.length; i++) {
                                            strstart = recordrentList.data[i].vin.substring(0, 11);
                                            strend = recordrentList.data[i].vin.substring(11, 17);
                                            let type = '';
                                            if(recordrentList.data[i].status=='2' || recordrentList.data[i].status=='3'){
                                                if (recordrentList.data[i].type == '1') {
                                                    type = '<span>快充</span>';
                                                } else if (recordrentList.data[i].type == '2') {
                                                    type = '<span>慢充</span>';
                                                }
                                            }
                                            str += '<li><input type="hidden" value="' + recordrentList.data[i].id + '" class="order_id"/><input class="carworkstate" type="hidden" value="' + recordrentList.data[i].status + '"/><span>' + recordrentList.data[i].plate_no + ' （<font class="font1">' + strstart + '</font>' + strend + '）</span><span class="right">充电' + recordrentList.data[i].id + '</span><br/>' +
                                                    '<span>' + recordrentList.data[i].status_name + '</span><span>约续航' + recordrentList.data[i].remain_km + '公里</span><span>' + recordrentList.data[i].brand_name + ' ' + recordrentList.data[i].model_name + '</span>' + type + '<br/><span class="work-time"><font>工单时长：</font>' + recordrentList.data[i].last_time + '</span></li>';
                                        }
                                        that.appendContent(str);
                                        cb(true)
                                    }
                                });
                            }, 400)
                        }
                    })
                } else {
                    new Toast(data.msg)
                }
            });
        }

        //跳转搜索页
        $(".chargelistSelect").on("click", function () {
            window.location.href = "../../manageOrderMain/index.html#/list";
        });
        //记录打开弹框前已筛选的值
        var colorArray = [];
        //打开筛选弹框
        $(".chargelistFilter").on("click", function () {
            colorArray = [];
            $(".confirm-carstate span").each(function () {
                if ($(this).hasClass("color")) {
                    colorArray.push($(this));
                }
            });
            $(".confirm_window").removeClass("none");
        });
        //关闭筛选弹框
        $(".close-confirm").on("click", function () {
            $(".confirm-carstate span").removeClass("color");
            for (var i = 0; i < colorArray.length; i++) {
                colorArray[i].addClass("color");
            }
            $(".confirm_window").addClass("none");
        })

        //点击确定按钮关闭弹框
        $(".confirm-sure").on("click", function () {
            let param = {
                        mobile: sessionStorage.getItem('mobile'),
                        car_id: sessionStorage.getItem('car_id'),
                        limit: 10,//每页大小
                        page: '1'//页码
                    },
                    status = [];
            $(".color").each(function () {
                if ($(this).find("input").val() != '') {
                    status.push($(this).find("input").val());
                } else {
                    status = [];
                    return false;
                }
            })
            if (status.length != 0) {
                param.status = status.join(',');
            }
            $(".confirm-style input").each(function () {
                if ($(this).is(':checked') && $(this).val() != '') {
                    param.type = $(this).val();
                    return false;
                }
            });
            show(param);
            $(".confirm_window").addClass("none");
        })
        //刷新页面
        $(".chargelistRefle").on("click", function () {
            let param = {
                        mobile: sessionStorage.getItem('mobile'),
                        car_id: sessionStorage.getItem('car_id'),
                        limit: 10,//每页大小
                        page: '1'//页码
                    },
                    status = [];
            $(".color").each(function () {
                if ($(this).find("input").val() != '') {
                    status.push($(this).find("input").val());
                } else {
                    status = [];
                    return false;
                }
            })
            if (status.length != 0) {
                param.status = status.join(',');
            }
            $(".confirm-style input").each(function () {
                if ($(this).is(':checked') && $(this).val() != '') {
                    param.type = $(this).val();
                    return false;
                }
            });
            show(param);
            new Toast("刷新成功")
        })
        //点击选项变换颜色
        $(".caroiler").on("click", function () {
            if ($(".color").length > 1) {
                if ($(this).hasClass("color")) {
                    $(this).removeClass("color");
                } else {
                    $(this).addClass("color");
                }
            } else {
                $(this).addClass("color");
            }
            $(".allcaroiler").removeClass("color");
        });
        //点击重置按钮
        $(".confirm-bottom .confirm-reset").on("click", function () {
            $(".caroiler").removeClass("color");
            $(".allcaroiler").addClass("color");
            $(".confirm-style .all").prop("checked", true);
        });
        //点击全部
        $(".allcaroiler").on("click", function () {
            $(".caroiler").removeClass("color");
            $(this).addClass("color");
        });
        //跳转工单页
        $(".charge-List").on("click", "li", function () {
            //车辆工单信息接口
            let workId = $(this).find(".order_id").val();
            sessionStorage.setItem("chargeorder_id", workId);
            if ($(this).find(".carworkstate").val() == '5') {
                window.location.href = "./charge.html#/chargeworkfinshed";
            } else {
                window.location.href = "./charge.html#/chargedetail";
            }
        });
    }
    ,
    methods: {

        }
    }
</script>