<template>
    <div id="searchchargenet">
        <div class="searchnetTop">
            <input class="search-net" name="" type="text" value="" autofocus="true" placeholder="请输入网点名称"/><span
                class="cancel-btn">取消</span>
            <span class="clear-icon2 none">&#xe601;</span>
        </div>
        <div class="net-content">
            <p class="">历史搜索
                <span class="delete-icon right">&#xe6db;</span>
            </p>

            <div class="searchnetHistory">
            </div>
        </div>
        <div class="selectnetResult none">
            <span class="resulticon2">&#xe6b9;</span><br/>
            查询结果不存在
        </div>
        <ul class="searchnetwork-list">

        </ul>
    </div>
</template>
<script>
    require('../../css/chargeWork/searchchargenet.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl';
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {}
    }
    ,
    beforeCreate()
    {
        document.title = '搜索充电站';
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {
        $("body").css("background", "#fff");
    }
    ,
    mounted()
    {
        $("body").css("background", "#f6f6f6");
        //网点历史搜索记录
        if (localStorage.getItem("peichargenet")) {
            let netrecord = JSON.parse(localStorage.getItem("peichargenet"));
            let recordItem = '';
            if (netrecord.length != '0') {
                for (var i = 0; i < netrecord.length; i++) {
                    recordItem += "<span>" + netrecord[i].name + "<input type='hidden' value='" + netrecord[i].name + "' class='name' /><input class='branch_id' type='hidden' value='" + netrecord[i].id + "' /><input class='lng' type='hidden' value='" + netrecord[i].lng + "' /><input class='lat' type='hidden' value='" + netrecord[i].lat + "' /></span>";
                }
                $(".searchnetHistory").html(recordItem);
            } else {
                $(".net-content").addClass("none");
            }
        }
        $('.searchnetwork-list').height($(window).height() - $(".searchnetTop").height());
        //模糊查询
        var searching = true;
        $(".search-net").on("input", function () {
            let value = $(this).val();
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                kw: value
            }
            if (value.length > 1 && searching == true) {
                searching = false;
                $.post(getApiUrl('/vehicle-charging/search-station'), param, function (data) {
                    let result = data.data;
                    let str = '';
                    if (data.status == '0') {
                        if (result != '') {
                            for (var i = 0; i < result.length; i++) {
                                str += '<li class="record">' + result[i].name + '<input type="hidden" value="' + result[i].name + '" class="name" /><input type="hidden" value="' + result[i].id + '" class="branch_id" /><input class="lng" type="hidden" value="' + result[i].lng + '" /><input class="lat" type="hidden" value="' + result[i].lat + '" /></li>';
                            }
                            $(".net-content").addClass("none");
                        } else {
                            $(".net-content").addClass("none");
                            $(".selectnetResult").removeClass("none");
                        }
                    } else {
                        new Toast(data.msg);
                    }
                    setTimeout(function () {
                        searching = true;
                    }, 500)
                    $(".searchnetwork-list").html(str);
                });
            } else {
                $(".net-content").removeClass("none");
                $(".selectnetResult").addClass("none");
                $(".searchnetwork-list").html('');
            }
        });

        //历史记录直接搜索
        $('.searchnetHistory').on('click', 'span', function () {
            historyrecord($(this).find(".branch_id").val(), $(this).find(".name").val(), $(this).find(".lng").val(), $(this).find(".lat").val());
        });

        //点击搜索列表跳转页面
        $(".searchnetwork-list").on('click', 'li', function () {
            historyrecord($(this).find(".branch_id").val(), $(this).find(".name").val(), $(this).find(".lng").val(), $(this).find(".lat").val());
        });

        //json数组去重
        function UniquePay(paylist) {
            var payArr = [paylist[0]];
            for (var i = 1; i < paylist.length; i++) {
                var payItem = paylist[i];
                var repeat = false;
                for (var j = 0; j < payArr.length; j++) {
                    if (payItem.id == payArr[j].id) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    payArr.push(payItem);
                }
            }
            return payArr;
        }

        //缓存搜索记录
        function historyrecord(branch_id, name, lng, lat) {
            if (localStorage.getItem("peichargenet")) {
                let netrecord = JSON.parse(localStorage.getItem("peichargenet"));
                if (netrecord.length < 10) {
                    netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat});
                    localStorage.setItem("peichargenet", JSON.stringify(UniquePay(netrecord)));
                } else {
                    netrecord = netrecord.slice(0, 9);
                    netrecord.unshift({id: branch_id, name: name, lng: lng, lat: lat});
                    localStorage.setItem("peichargenet", JSON.stringify(UniquePay(netrecord)));
                }
            } else {
                localStorage.setItem("peichargenet", JSON.stringify([{
                    id: branch_id,
                    name: name,
                    lng: lng,
                    lat: lat
                }]));
            }
            location.href = "charge.html#/choicechargestation?branch_id=" + branch_id + "&name=" + name + "&lng=" + lng + "&lat=" + lat;
        }

        //清除icon按钮展示
        $(".search-net").on("input", function () {
            if ($(this).val().length > 0) {
                $(".clear-icon2").removeClass("none");
            } else {
                $(".clear-icon2").addClass("none");
            }
        });

        //清空input框的数据
        $(".clear-icon2").on("click", function () {
            $(this).parent().find("input").val('');
            $(this).addClass("none");
            $(".net-content").removeClass("none");
            $(".selectnetResult").addClass("none");
            $(".searchnetwork-list").html('');
        });

        //取消跳转页面
        $(".cancel-btn").on("click", function () {
            location.href = "charge.html#/choicechargestation";
        });

        //删除本地缓存
        $(".delete-icon").on("click", function () {
            localStorage.removeItem("peichargenet");
            $(".searchnetHistory").html('');
        });
    }
    ,
    methods: {

    }
    }
</script>