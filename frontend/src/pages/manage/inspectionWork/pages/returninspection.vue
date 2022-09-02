<template>
    <div id="returninspection">
        <div class="returncarsingle-content">
        </div>
        <div class="returncarsingle-check">
            <input class="" name="" type="checkbox" value=""/>
            外观无伤
        </div>
        <div class="returncarsingle-nextbtn">
            <button>下一步</button>
        </div>
    </div>
</template>
<script>
    require("../css/returninspection.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import CarDamage from '../../../../component/carDamage/index'
    import dd from '../../../../../other_modules/like-manageOrder/ddSDK'
    export default{
        data ()
    {
        return {

        }
    }
    ,
    created()
    {
        if(this.$route.query.type==1 && dd.inDDApp){
            dd.setWebTitle("记录巡检事项")
        }
    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
        var _this=this;
        //默认选中checkbox
        $(".returncarsingle-check input").attr("checked", true);
        $(".returncarsingle-check input").attr("disabled", true);
        var returnsingleArray=[];
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
                    img.addClass('select')
                    returnsingleArray.push(area.id)
                }
                if ($(".select").length > 0) {
                    $(".returncarsingle-check input").prop("checked", false);
                } else {
                    $(".returncarsingle-check input").prop("checked", true);
                }
            }
        });
        //提交下一页
        $(".returncarsingle-nextbtn button").on("click", function () {
            sessionStorage.setItem("returnsingleArray", returnsingleArray);
            if (_this.$route.query.type==1) {
                window.location.href = "./index.html#/recordinspection"
            } else {
                window.location.href = "./index.html#/returnafterphoto"
            }
        });
    }
    ,
    methods: {
    }
    }
</script>