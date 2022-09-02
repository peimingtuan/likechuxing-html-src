/**
 * Created by Administrator on 2018/5/7.
 */
require('../css/public.css')
require('../css/prepareWork/preparehistory.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl';
import {Confirm,Toast} from '../common/LikeAlert/index'
import myAjax from '../common/myAjax/withJq.js'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
waterMark({watermark_txt: sessionStorage.getItem('userName') + '-' + sessionStorage.getItem('mobile')});
dd.error(function (error) {
    new Toast("钉钉授权失败，请关闭页面重新打开")
});
dd.ready(function () {
    //加载图片
    $(".close-btn").attr("src", require('../image/prepareWork/close-icon.png'));
//获取历史记录
    myAjax.post(getApiUrl('/work-order-kerb/operate-history'), {
        mobile: sessionStorage.getItem("mobile"),
        order_id: sessionStorage.getItem("id")
    }, function (data) {
        let str = '';
        if (data.status == '0') {
            $(".top").removeClass("none");
            if (data.data.length != 0) {
                for (var i = 0; i < data.data.length; i++) {
                    let checkli = '<span class="check right">详情</span>';
                    if (data.data[i].type == '1' || data.data[i].type == '') {
                        checkli = '';
                    }
                    str += '<li><input type="hidden" value="' + data.data[i].id + '" class="id"/><input type="hidden" value="' + data.data[i].item_id + '" class="item_id"/><input type="hidden" value="' + data.data[i].type + '" class="type"/><input type="hidden" value="' + data.data[i].operate + '" class="operate"/><span class="span1">' + data.data[i].time + '</span>' + checkli + '<span class="span2">' + data.data[i].operate + '</span><br/><span class="span3">' + data.data[i].real_name + '</span>' +
                        '<span class="span4">(' + data.data[i].user_name + ')</span></li>';
                }
                $(".preparehistory-list").html(str);
            }
        } else {
            new Toast(data.msg)
        }
        //打开弹框
        $(".check").on("click", function () {
            let btn = $(this);
            $(".top-one").text($(this).parent().find(".operate").val());
            if ($(this).parent().find(".type").val() == '3') {
                //详情接口
                myAjax.post(getApiUrl('/work-order-kerb/history-result'), {
                    mobile: sessionStorage.getItem("mobile"),
                    id: $(this).parent().find(".id").val()
                }, function (data) {
                    if (data.status == '0') {
                        if (btn.parent().find(".item_id").val() == '1') {
                            $(".top-two").text('车牌号： ' + data.data.plate_no);
                            $(".top-two").css("line-height", "6rem");
                        } else {
                            if (btn.parent().find(".item_id").val() == '4') {
                                if (data.data.type == '1') {
                                    $(".top-two").html('车机： ' + data.data.tbox_no + '<br/>SIM卡号： ' + data.data.SIM);
                                    $(".top-two").css("line-height", "2rem");
                                } else {
                                    $(".top-two").text('车机： ' + data.data.tbox_no);
                                    $(".top-two").css("line-height", "6rem");
                                }
                            } else {
                                $(".top-two").text('GPS码： ' + data.data);
                                $(".top-two").css("line-height", "6rem");
                            }
                        }
                        $(".alert_window").removeClass("none");
                    } else {
                        new Toast(data.msg);
                    }
                });
            } else if ($(this).parent().find(".type").val() == '2') {
                //详情接口
                myAjax.post(getApiUrl('/work-order-kerb/history-result'), {
                    mobile: sessionStorage.getItem("mobile"),
                    id: $(this).parent().find(".id").val()
                }, function (data) {
                    if (data.status == '0') {
                        let str = '',
                            imageArray = [];
                        imageArray = data.data;
                        for (var i = 0; i < data.data.length; i++) {
                            str += '<div class="photo-img"><img src="' + data.data[i] + '" /></div>';
                        }
                        $(".top-two").html(str);
                        $(".alert_window").removeClass("none");
                        $(".photo-img img").on("click", function () {
                            //图片浏览器
                            dd.biz.util.previewImage({
                                urls: imageArray,//图片地址列表,数组
                                current: $(this).val(),//当前显示的图片链接
                                onSuccess: function (result) {
                                    /**/
                                },
                                onFail: function (err) {
                                    new Toast("查看大图失败")
                                }
                            });
                        });
                    } else {
                        new Toast(data.msg);
                    }
                });
            }
        });
    });
//关闭弹框
    $(".close-btn").on("click", function () {
        $(".alert_window").addClass("none");
    });
});