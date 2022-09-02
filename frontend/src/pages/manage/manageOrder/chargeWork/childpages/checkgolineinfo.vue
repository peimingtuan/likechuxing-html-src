<template>
    <div id="checkgolineinfo">
        <div class="endwork-netname">
            <span>网点名称：</span>
            <span>{{resultData.branch}}</span>
        </div>
        <div class="endwork-floor">
            <p class="choice-floor">
                <span>楼层：</span>
                <span>{{resultData.parking_floor}}</span>
            </p>

            <p>
                <span>车位号：</span>
                <span>{{resultData.parking_no}}</span>
            </p>
        </div>
        <div class="remark-info2">
            {{resultData.remark}}
        </div>
        <!-- 图片展示-->
        <div class="editrefueling-content none">
            <div class="left photo-hide">
                <p>车辆左前照片</p>

                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
            <div class="right photo-hide">
                <p>车辆右前照片</p>

                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
            <div class="left photo-hide">
                <p>车辆左后照片</p>

                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
            <div class="right photo-hide">
                <p>车辆右后照片</p>

                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
            <div class="left">
                <p>驾驶舱前排照片</p>
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
            <div class="right">
                <p>驾驶舱后排照片</p>
                <div>
                    <img src="" alt="" name="pic" class="img-circle"/>
                    <input type="hidden" value="" class="img-val"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/checkgolineinfo.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    export default{
        data ()
    {
        return {
            resultData:''//存储数据
        }
    }
    ,
    beforeCreate()
    {
        document.title = '充电中上线';
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
        var _this=this;
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '充电中上线',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
            var imageArray = [];//存放图片路径的数组
            //初始化查询
            myAjax.post(getApiUrl('/vehicle-charging/item-result'), {
                mobile: sessionStorage.getItem('mobile'),
                order_id: sessionStorage.getItem('chargeorder_id'),
                item_id:'4'
            },function(data) {
                if(data.status=='0'){
                    _this.resultData=data.data;
                    imageArray = data.data.photo_string;
                    if(imageArray.length=='2'){
                        $(".photo-hide").remove();
                    }
                    $(".editrefueling-content").removeClass("none");
                    $(".img-circle").each(function (index, element) {
                        $(this).attr("src", imageArray[index])
                    })
                    $(".img-val").each(function (index, element) {
                        $(this).val(imageArray[index])
                    })
                    //钉钉查看大图
                    $(".img-circle").on("click", function () {
                        let btn = $(this);
                        dd.biz.util.previewImage({
                            urls: imageArray,//图片地址列表,数组
                            current: btn.parent().find(".img-val").val(),//当前显示的图片链接
                            onSuccess: function (result) {
                                /**/
                            },
                            onFail: function (err) {
                                new Toast("查看大图失败")
                            }
                        });
                    });
                }else{
                    new Toast(data.msg)
                }
            });
        });
    }
    ,
    methods: {
    }
    }
</script>