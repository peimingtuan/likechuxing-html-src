<template>
    <div id="inspection">
        <div class="carsingle-content">
        </div>
        <div class="carsingle-check">
            <input class="" name="" type="checkbox" value=""/>
            外观无伤
        </div>
        <div class="carsingle-nextbtn">
            <button>下一步</button>
        </div>
    </div>
</template>
<script>
    require("../css/inspection.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import CarDamage from '../../../../component/carDamage/index'
    export default{
        data ()
    {
        return {

        }
    }
    ,
    created()
    {

    }
    ,
    destroyed()
    {

    }
    ,
    mounted()
    {
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
                } else {
                    $(".carsingle-check input").prop("checked", true);
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
    }
    ,
    methods: {
    }
    }
</script>