/**
 * Created by Administrator on 2017/12/26.
 */
require('../css/public.css')
require('../css/oilerSingle/returncarsingle.css')
import $ from 'jquery'
import FoundationTools from '../js/functionAjax'
import CarDamage from '../../../../component/carDamage/index'
//import ddTalk from '../js/ddTalk'
//验证页面是否在钉钉浏览器打开
//ddTalk.verify(navigator.userAgent);
//初始化接收URL参数
var type = FoundationTools.getUrlParam('type'),
    photo_flag = FoundationTools.getUrlParam('photo_flag');
//默认选中checkbox
$(".returncarsingle-check input").attr("checked", true);
$(".returncarsingle-check input").attr("disabled", true);
var returnsingleArray = [];
let carDamage = new CarDamage({
    parent: document.querySelector('.returncarsingle-content'),
    clickable: true,
    clickCallback: function (area) {
        let img = $('.carDamage_container .part[data-id="' + area.id + '"]')
        if (img.hasClass('select')) {
            img.removeClass('select')
            var index = returnsingleArray.indexOf(area.id);
            if (index > -1) {
                returnsingleArray.splice(index, 1);
            }
        } else {
            // $('.carDamage_container .part.select').removeClass('select')
            img.addClass('select')
            returnsingleArray.push(area.id)
        }
        if ($(".select").length > 0) {
            $(".returncarsingle-check input").prop("checked", false);
            $(".returncarsingle-nextbtn button").text("外观有伤，上传照片")
        } else {
            $(".returncarsingle-check input").prop("checked", true);
            $(".returncarsingle-nextbtn button").text("下一页")
        }
    }
});
//跳转下一页
$(".returncarsingle-nextbtn").on("click", function () {
    sessionStorage.setItem("returnsingleArray", returnsingleArray);
    if (type == '2') {
        if (photo_flag == '0') {
            window.location.href = "./returncarpicture.html?type=2&photo_flag=0";
        } else {
            window.location.href = "./returncarpicture.html?type=2";
        }
    } else if (type == '3') {
        if (photo_flag == '0') {
            window.location.href = "./returncarpicture.html?type=3&photo_flag=0";
        } else {
            window.location.href = "./returncarpicture.html?type=3";
        }
    } else if (type == '4') {
        if (photo_flag == '0') {
            window.location.href = "./returncarpicture.html?type=4&photo_flag=0";
        } else {
            window.location.href = "./returncarpicture.html?type=4";
        }
    } else if (type == '5') {
        if (photo_flag == '0') {
            window.location.href = "./returncarpicture.html?type=5&photo_flag=0";
        } else {
            window.location.href = "./returncarpicture.html?type=5";
        }
    } else {
        if (photo_flag == '0') {
            window.location.href = "./returncarpicture.html?photo_flag=0";
        } else {
            window.location.href = "./returncarpicture.html";
        }
    }
});