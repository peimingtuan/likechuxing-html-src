/**
 * Created by Administrator on 2018/7/17.
 */
require('../css/public.css')
require('../css/destineCar/changecarstatus.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import getApiUrl from '../js/getApiUrl'
import myAjax from '../common/myAjax/withJq.js'
import {Confirm,Toast} from '../common/LikeAlert/index'
import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
ddTalk.verify(navigator.userAgent);
//获取参数
var _car_info, _status;
var plate_no = FoundationTools.getUrlParam("plate_no"),//车牌号
    carstatus = FoundationTools.getUrlParam("status");//当前车辆状态
if (plate_no) {
    _car_info = plate_no;
} else {
    window.history.back();
}

//获取状态
$('input').click(function () {
    _status = $(this).val();
});

var clicktag = 0;//控制连击变量
$('#statusSure').click(function () {
    var _des, desVal = $('#changeDes').val();
    desVal == "" ? _des = '无' : _des = desVal;

    if (_status) {
        if (_status == 1 || _status == 37) {
            window.location.href = './latticepoint.html?name=' + _car_info + '&status=' + _status + '&desc=' + _des;
        } else {
            //备注原因必填
            if (_status == 20 || _status == 32 || _status == 25 || _status == 31 || _status == 33 || _status == 34 || _status == 35 || _status == 23) {
                //车辆整备，车辆故障，保险，维修，保养，巡检，年检，办公用车
                if ($('#changeDes').val() == '') {
                    new Toast('此状态备注为必填');
                    return false;
                }
            }
            if (clicktag == 0) {
                clicktag = 1;
                myAjax.post(getApiUrl("car/change-status"), {
                    car_info: _car_info,
                    status: _status,
                    desc: _des,
                    mobile: sessionStorage.getItem("mobile")
                }, function (data) {
                    if (data.status == '0') {
                        new Toast(data.msg)
                        setTimeout(function () {
                            window.location.href = '../../manageOrderCardetail/index.html?plate_no=' + plate_no;
                        }, 1000)
                    } else {
                        new Toast(data.msg)
                    }
                });
                setTimeout(function () {
                    clicktag = 0;
                }, 5000);
            } else {
                new Toast("操作过于频繁")
            }
        }
    } else {
        new Toast('状态信息必填')
    }

});
