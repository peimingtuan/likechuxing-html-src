/**
 * Created by Administrator on 2017/12/21.
 */
require('../css/public.css')
require('../css/oilerSingle/carsingle.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import CarDamage from '../../../../component/carDamage/index'
import waterMark from '../../../../../other_modules/like-manageOrder/waterMark'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//初始化接收URL参数
var type=FoundationTools.getUrlParam('type');
//默认选中checkbox
$(".carsingle-check input").attr("checked", true);
$(".carsingle-check input").attr("disabled", true);
var singleArray=[];
let carDamage = new CarDamage({
    parent: document.querySelector('.carsingle-content'),
    clickable: true,
    clickCallback: function (area) {
        let img = $('.carDamage_container .part[data-id="' + area.id + '"]')
        if (img.hasClass('select')) {
            img.removeClass('select')
            var index = singleArray.indexOf(area.id);
            if (index > -1) {
                singleArray.splice(index, 1);
            }
        } else {
            img.addClass('select')
            singleArray.push(area.id)
        }
        if ($(".select").length > 0) {
            $(".carsingle-check input").prop("checked", false);
            $(".carsingle-nextbtn button").text("外观有伤，上传照片")
        } else {
            $(".carsingle-check input").prop("checked", true);
            $(".carsingle-nextbtn button").text("下一页")
        }
    }
});
//提交下一页
$(".carsingle-nextbtn button").on("click", function () {
    sessionStorage.setItem("singleArray", singleArray);
    if (type == '2') {
        window.location.href = "./getpicture.html?type=2"
    } else if (type == '3') {
        window.location.href = "./getpicture.html?type=3"
    } else {
        window.location.href = "./getpicture.html"
    }
});