<template>
    <div id="endchargework" class="none">
        <div class="endwork-netname">
            <span>网点名称：</span>
            <input class="choice-net input-foucs" type="text" value="" placeholder="请选择网点"/>
            <span class="endwork-icon right">&#xe623;</span>
        </div>
        <div class="endwork-floor">
            <p class="choice-floor">
                <span>楼层：</span>
                <input class="floors input-foucs" type="text" value="" placeholder="请选择楼层" readonly/>
                <span class="endwork-icon right">&#xe623;</span>
            </p>

            <p>
                <span>车位号：</span>
                <input class="carposinum input-foucs" type="text" value="" placeholder="请输入车位号"/>
            </p>
        </div>
        <div class="endwork-state">
            <span>更改车辆状态：</span>
            <input class="car-state input-foucs" type="text" value="" placeholder="请选择车辆状态" readonly/>
            <input class="car-stateid" type="hidden" value=""/>
            <span class="endwork-icon right">&#xe623;</span>
        </div>
        <div class="remark-info">
            <span class="none">*</span>
  <textarea class="void_writeinfo" placeholder="请输入车辆状态备注信息，200字以内" maxlength="200">
</textarea>
        </div>
        <div class="endworkname-submit">
            <button>提交</button>
        </div>
        <!--alert弹框1-->
        <div class="net-contentwindow1 common_cover3 none">
            <div class="net-content1">
                <span class="close-icon">&#xe601;</span>

                <div class="top">
                    车机里程为0，请检查车机
                </div>
                <div class="bottom">
                    <span class="cancel">取消</span><span class="qure">继续提交</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    require('../../css/chargeWork/endchargework.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import {Select} from '../../../../../component/Select/index'
    import Loading from '../../../../../component/loading'
    export default{
        beforeCreate ()
    {
        document.title = '结束工单';
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
        $("body").unbind();//取消点击事件
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '结束工单',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        //接收URL参数
        var name = FoundationTools.getUrlvue(location.hash).name,
                branch_id=FoundationTools.getUrlvue(location.hash).branch_id;
        var inputlength = 3;
        $("#endchargework").removeClass("none");
        if (name && branch_id) {
            $(".choice-net").val(name);
            sessionStorage.setItem('branch_id',branch_id);//存储选择的网点id
            //初始化查看楼层是否只有一个
            if (sessionStorage.getItem('choicefloor')) {
                if (sessionStorage.getItem('choicefloor').split(',').length == 1) {
                    $(".floors").val(sessionStorage.getItem('choicefloor'));
                }
            }
        } else {
            $(".floors").val('');
        }
        //选择楼层弹框
        $(".floors").on("click", function () {
            let choicefloor = sessionStorage.getItem('choicefloor');
            let array = [];
            if (!choicefloor) {
                new Toast("请先选择网点名称");
                return false;
            }
            $.each(choicefloor.split(','), function (i, val) {
                var text = {
                    name: ''
                };
                text.name = val;
                array.push(text);
            });
            new Select({
                name: '楼层',
                options: array,
                callback: function (item) {
                    console.log(item);
                    $(".floors").val(item.name);
                }
            })
        });
        //更改车辆状态
        var array1 = [],
                array2 = [];
        $.post(getApiUrl('/work-order/car-status'), {
            mobile: sessionStorage.getItem("mobile")
        }, function (data) {
            if (data.status == '0') {
                array1=data.data;
                for(var i=0;i<array1.length;i++){
                    if(array1[i].id!='32'){//去掉故障
                        array2.push(array1[i]);
                    }
                }
            } else {
                new Toast(data.msg)
            }
        });
        var clicktag = 0;
        $(".endwork-state").on("click", function () {
            if (clicktag == 0) {
                clicktag = 1;
                new Select({
                    name: '更改车辆状态',
                    id: '车辆id',
                    options: array2,
                    callback: function (item) {
                        $(".car-state").val(item.name);
                        $(".car-stateid").val(item.id);
                    }
                })
            } else {
                new Toast("操作过于频繁")
            }
            setTimeout(function () {
                clicktag = 0;
            }, 2000)
        });
        //网点名称跳转页面
        $(".endwork-netname").on("click", function () {
            window.location.href = "../../endwork/index.html#/selectmapnet?type=5"//共用网点搜索页面
        })
        //激活提交按钮
        $("body").on("click", function () {
            let index = 0;
            if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
                if ($(".car-state").val() != '') {
                    inputlength = 2;
                }
            }
            $(".input-foucs").each(function () {
                if ($(this).val() != '') {
                    index++;
                }
            })
            if (index > inputlength) {
                $(".endworkname-submit button").addClass("endworkname-button");
            } else {
                $(".endworkname-submit button").removeClass("endworkname-button");
            }
        });
        $(".carposinum").on("input", function () {
            let index = 0;
            if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
                if ($(".car-state").val() != '') {
                    inputlength = 2;
                }
            }
            $(".input-foucs").each(function () {
                if ($(this).val() != '') {
                    index++;
                }
            })
            if (index > inputlength) {
                $(".endworkname-submit button").addClass("endworkname-button");
            } else {
                $(".endworkname-submit button").removeClass("endworkname-button");
            }
        });
        //提交按钮结束故障工单
        var clicktag2 = 0;
        $(".endworkname-submit button").on("click", function () {
            if ($(this).hasClass('endworkname-button')) {
                if ($(".car-stateid").val() == '32' || $(".car-stateid").val() == '31' || $(".car-stateid").val() == '33' || $(".car-stateid").val() == '25' || $(".car-stateid").val() == '23' || $(".car-stateid").val() == '20') {//状态为故障，维修，保养，保险,车辆整备，办公用车
                    if ($(".void_writeinfo").val() == "") {
                        new Toast("请填写备注信息");
                        return false;
                    }
                }
                // 禁用按钮防止重复提交
                let loading = new Loading()//加载loading
                let param = {
                    mobile: sessionStorage.getItem("mobile"),
                    order_id: sessionStorage.getItem('chargeorder_id'),//充电工单id
                    item_id: '7', //结束步骤id
                    params: {
                        branch_id: sessionStorage.getItem('branch_id'),//网点id
                        parking_floor: $(".choice-floor .floors").val(),//楼层
                        parking_no: $(".carposinum").val(),//车位号
                        remark: $(".void_writeinfo").val(),//备注信息
                        status: $(".endwork-state .car-stateid").val() //车辆状态id
                    }
                }
                if (clicktag2 == 0) {
                    clicktag2 = 1;
                    var time=window.setTimeout(function () {
                        clicktag2 = 0;
                        loading.destroy()//清除loading
                    }, 5000);
                    if (name == '工具车') {
                        param.params.is_tool_car = '1'
                    } else {
                        param.params.is_tool_car = '2'
                    }
                    postshow(param);
                    function postshow(param) {
                        $.ajax({
                            type: "post",
                            data: param,
                            url: getApiUrl('/vehicle-charging/operate'),
                            beforeSend: function () {

                            },
                            success: function (data) {
                                if (data.status == '0') {
                                    new Toast("请拉门确认已锁门");
                                    setTimeout(function () {
                                        window.location.href = "charge.html#/chargeworkfinshed";
                                    }, 2000)
                                } else if (data.status == '10011') {
                                    loading.destroy()//清除loading
                                    window.clearTimeout(time);//去掉定时器
                                    clicktag2 = 0;
                                    $(".net-contentwindow1 .top").text("车机里程为0，禁止上线，请更改其他状态");
                                    $(".net-contentwindow1 .bottom").html("<span class='cance2'>取消</span>");
                                    $(".net-contentwindow1").removeClass("none");
                                } else if (data.status == '10012') {
                                    loading.destroy()//清除loading
                                    window.clearTimeout(time);//去掉定时器
                                    clicktag2 = 0;
                                    $(".net-contentwindow1 .top").text("车机里程为0，请检查车机");
                                    $(".net-contentwindow1 .bottom").html('<span class="cancel">取消</span><span class="qure">继续提交</span>');
                                    $(".net-contentwindow1").removeClass("none");
                                    $(".net-contentwindow1").on("click", ".qure", function () {
                                        param.force_commit = '1';
                                        postshow(param);
                                        loading = new Loading()//加载loading
                                    });
                                } else if (data.status == '10013') {
                                    new Toast(data.msg);
                                    setTimeout(function () {
                                        window.location.href = "charge.html#/chargeworkfinshed";
                                    }, 2000)
                                } else {
                                    new Toast(data.msg);
                                }
                            }
                        });
                    }
                }
            }
        });

        //关闭弹框
        $(".close-icon").on("click", function () {
            $(".net-contentwindow1").addClass("none");
        });
        $(".net-contentwindow1").on("click", ".cancel", function () {
            $(".net-contentwindow1").addClass("none");
        });
        $(".net-contentwindow1").on("click", ".cance2", function () {
            $(".net-contentwindow1").addClass("none");
        });



    }
    }
</script>
