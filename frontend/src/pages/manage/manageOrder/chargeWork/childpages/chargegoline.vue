<template>
    <div id="chargegoline">
        <div class="endwork-netname">
            <span>网点名称：</span>
            <input class="choice-net input-foucs" type="text" value=""  readonly />
        </div>
        <div class="endwork-floor">
            <p class="choice-floor">
                <span>楼层：</span>
                <input class="floors input-foucs" @click="choicefloors()" type="text" value="" placeholder="请选择楼层" readonly/>
                <span class="endwork-icon right" @click="choicefloors()">&#xe623;</span>
            </p>

            <p>
                <span>车位号：</span>
                <input class="carposinum input-foucs" type="text" value="" placeholder="请输入车位号"/>
            </p>
        </div>
        <div class="remark-info">
            <span class="none">*</span>
              <textarea class="void_writeinfo" placeholder="请输入车辆状态备注信息，200字以内" maxlength="200">
            </textarea>
        </div>
        <div class="endworkname-submit">
            <button @click="submitgoline()" ref="submitinfo">提交</button>
        </div>
    </div>
</template>
<script>
    require('../../css/chargeWork/chargegoline.css')
    import $ from 'jquery'
    import FoundationTools from '../../js/functionAjax'
    import getApiUrl from '../../js/getApiUrl'
    import myAjax from '../../common/myAjax/withJq.js'
    import {Confirm,Toast} from '../../common/LikeAlert/index'
    import {Select} from '../../../../../component/Select/index'
    export default{
        data ()
    {
        return {
            golinenet:'',//上线网点
            golineid:'',//上线网点id
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
        $("body").css("background","#fff");
        $("body").unbind();//取消点击事件
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        var _this=this;
        dd.ready(function () {
            dd.biz.navigation.setTitle({
                title: '充电中上线',//控制标题文本，空字符串表示显示默认文本
                onSuccess: function (result) {

                },
                onFail: function (err) {
                }
            });
        });
        //初始化查询
        myAjax.post(getApiUrl('/vehicle-charging/item-result'), {
            mobile: sessionStorage.getItem('mobile'),
            order_id: sessionStorage.getItem('chargeorder_id'),
            item_id:'3'
        },function(data) {
            if (data.status == '0') {
                $(".choice-net").val(data.data.branch_name);
                _this.golinenet=data.data.branch_name;//网点
                _this.golineid=data.data.branch_id;//id
            }else{
                new Toast(data.msg)
            }
        });
        //input框的input事件
        $(".input-foucs").on("input", function () {
            let array_void = [];
            $(".input-foucs").each(function () {
                if ($(this).val() != '') {
                    array_void.push($(this).val());
                }
            })
            if (array_void.length == 3) {
                $(".endworkname-submit button").addClass("submit-btn");
            } else {
                $(".endworkname-submit button").removeClass("submit-btn");
            }
        });
        //input框的onchange事件
        $("body").on("click",function(){
            let array_void = [];
            $(".input-foucs").each(function () {
                if ($(this).val() != '') {
                    array_void.push($(this).val());
                }
            })
            if (array_void.length == 3) {
                $(".endworkname-submit button").addClass("submit-btn");
            } else {
                $(".endworkname-submit button").removeClass("submit-btn");
            }
        });
    }
    ,
    methods: {
        //选择楼层弹框
        choicefloors(){
            let array = [{name:'B1'},{name:'B2'},{name:'B3'},{name:'1'},{name:'2'},{name:'3'}];
            new Select({
                name: '楼层',
                options: array,
                callback: function (item) {
                    $(".floors").val(item.name);
                }
            })
        },
        //提交充电上线信息
        submitgoline(){
            if($(this.$refs.submitinfo).hasClass("submit-btn")){
                if($(".void_writeinfo").val()==''){
                    new Toast("请填写备注信息")
                    return false;
                }
                myAjax.post(getApiUrl('/vehicle-charging/operate'), {
                    mobile: sessionStorage.getItem('mobile'),
                    order_id: sessionStorage.getItem('chargeorder_id'),
                    item_id:'4',//操作项id
                    params:{
                        branch_id: this.golineid,//充电桩公司id
                        parking_floor:$(".floors").val(),//楼层
                        parking_no:$(".carposinum").val(),//车位号
                        remark:$(".void_writeinfo").val(),//备注
                        key:sessionStorage.getItem("returnsingleArray"),//车伤部位
                        photo_string:sessionStorage.getItem("chargepicture")//图片凭证
                    }
                },function(data) {
                    if (data.status == '0') {
                        window.location.href="charge.html#/chargedetail";
                    }else{
                        new Toast(data.msg)
                    }
                });
            }
        }
    }
    }
</script>