<template>
    <div id="addmatter">
        <div class="top" v-if="saveid2.length>0">
            <p>已添加的物料</p>
            <div class="top-div" v-for="(item,index) in saveid2">
                <div class="div1">
                    {{item.name}}
                </div>
                <div class="div2">
                    <div @click="reduce(item,index)"><img src="../images/show1.png"/></div>
                    <div class="num">{{item.num}}</div>
                    <div @click="add(item,index)"><img src="../images/merge.png"/></div>
                    <div class="xe" @click="remove(item,index)">
                        <img src="../images/cha.png"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="faultdetail-type">
            <span class="span1">添加物料：</span>
            <span class="span2">请选择物料</span>
            <span class="span3 right">&#xe623;</span>
        </div>
        <!--添加物料类型弹层-->
        <div class="fault-type common_cover none">
            <div class="faultcontent">
                <p class="title">添加物料
                    <span class="close-btn left">&#xe601;</span>
                </p>
                <div class="content">
                    <p>
                        <span class="choice-type none">停车费类</span>
                        <span class="choice">请选择</span>
                    </p>
                    <!-- 一级分类-->
                    <ul class="faulttype-list">
                    </ul>
                    <!--二级分类-->
                    <ul class="faultchoice-list none">
                    </ul>
                </div>
            </div>
        </div>
        <!-- 底部按钮-->
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
    </div>
</template>
<script>
    require("../css/addmatter.css")
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import $ from 'jquery'
    import Button from '../component/bottomBtn'
    export default{
        name: "addmatter",
        components: {
            Button
        },
        data ()
    {
        return {
            saveid2:[],//已经添加的二级类型id
            showsubmit:true,//底部按钮
            text:'提交'
        }
    }
    ,
    created()
    {
        if(this.$route.query.record){
            this.record();
        }
    }
    ,
    destroyed()
    {
        $("body").css("background","#fff");
    }
    ,
    mounted()
    {
        $("body").css("background","#f6f6f6");
        var _this=this;
        //请求物料类型配置数据
        var arraymenu = [],//存储类型配置一级数据的id
                arraysecond = [],//存储类型配置的二级数据
                saveid=[],//已经添加的类型id
                type_name = '',//一级分类的name
                cat_id = '';//二级分类
        $.post(getApiUrl('/vehicle-inspection/items'), {
            mobile: sessionStorage.getItem('mobile'),
        }, function (data) {
            if (data.status == '0') {
                let str = '';
                for (var i = 0; i < data.data.length; i++) {
                    arraymenu.push(data.data[i].id);
                    arraysecond.push(data.data[i].items);
                    str += '<li><span>' + data.data[i].name + '</span><input class="id" type="hidden" value="' + data.data[i].id + '"/></li>';
                }
                $(".faulttype-list").html(str);
            } else {
                _this.$_LIKE_toast(data.msg)
            }
        });

        //打开弹框
        $(".faultdetail-type").on("click", function () {
            $(".fault-type").removeClass("none");
        });
        var paramtype = {
            params: {}
        }
        //一级菜单
        $(".faulttype-list").on("click", "li", function () {
            $(".faulttype-list li span").removeClass("font-color");
            $(this).find("span").addClass("font-color");
            $(".choice-type").text($(this).find("span").text());
            $(".choice-type").removeClass("none");
            type_name = $(this).find("span").text();
            //获取对应的二级菜单数据
            let index = arraymenu.indexOf($(this).find(".id").val()),
                    str = '';
            let qure=true;
                for (var i = 0; i < arraysecond[index].length; i++) {
                    str += '<li><span>' + arraysecond[index][i].name + '</span><input class="id" type="hidden" value="' + arraysecond[index][i].id + '"/></li>';
                }
                $(".faultchoice-list").html(str);
                //一级菜单隐藏，二级菜单显示
                $(".faulttype-list").addClass("none");
                $(".faultchoice-list").removeClass("none");
        });
        //二级菜单
        $(".faultchoice-list").on("click", "li", function () {
            let btn = $(this);
            //关闭弹框,数据还原
            $(".fault-type").addClass("none");
            $(".choice-type").text("");
            $(".choice-type").addClass("none");
            $(".faulttype-list li span").removeClass("font-color");
            $(".faultchoice-list li span").removeClass("font-color");
            $(".faulttype-list").removeClass("none");
            $(".faultchoice-list").addClass("none");
            paramtype.params.cat_id = $(this).find("input").val()//二级分类
            let qure2=true;
            for(var i=0;i<_this.saveid2.length;i++){
                if(_this.saveid2[i].cat_id==paramtype.params.cat_id){
                    qure2=false;
                    break;
                }
            }
            if(qure2){
                _this.saveid2.push({cat_id:paramtype.params.cat_id,num:1,name:type_name+'-'+btn.find("span").text()})
                _this.showsubmit=false;
            }else{
                _this.$_LIKE_toast("不能添加相同的物料类型")
            }
        });
        //关闭弹框,数据还原
        $(".close-btn").on("click", function () {
            $(".fault-type").addClass("none");
            $(".choice-type").text("");
            $(".choice-type").addClass("none");
            $(".faulttype-list li span").removeClass("font-color");
            $(".faultchoice-list li span").removeClass("font-color");
            $(".faulttype-list").removeClass("none");
            $(".faultchoice-list").addClass("none");
        });

        //优化新增逻辑
        $(".choice-type").on("click",function(){
            $(this).addClass("none");
            $(".faultchoice-list").addClass("none");//二级隐藏
            $(".faulttype-list li span").removeClass("font-color");
            $(".faulttype-list").removeClass("none");//一级显示
        });
    }
    ,
    methods: {
        //操作记录
        record(){
            let _this=this;
            myAjax.post(getApiUrl('/vehicle-inspection/item-result'),{
                mobile: sessionStorage.getItem('mobile'),
                order_id: _this.$route.query.id, //工单id
                item_id:4
            }).then(data=>{
                if(data.status==0){
                    if(data.data.length>0){
                        _this.saveid2=data.data;
                    }
                }else{
                    _this.$_LIKE_toast(data.msg)
                }
            }).catch(data => {
                console.log(data)
            })
        },
        //添加数量
        add(item,index){
            if(item.num<9){
                item.num++;
            }else{
                this.$_LIKE_toast("添加数量已达上限")
            }
        },
        //减少数量
        reduce(item,index){
            if(item.num>1){
                item.num--;
            }
        },
        //移除
        remove(item,index){
            this.saveid2.splice(index,1);
            if(this.saveid2.length==0){
                this.showsubmit=false;
            }
        },
        //提交
        submitInfo(){
            let _this=this,
                key=[],
                num=[],
                name=[];
            for(var i=0;i<_this.saveid2.length;i++){
                key.push(_this.saveid2[i].cat_id)
                num.push(_this.saveid2[i].num)
                name.push(_this.saveid2[i].name)
            }
            $.post(getApiUrl('/vehicle-inspection/operate'),{
                mobile: sessionStorage.getItem("mobile"),
                order_id: _this.$route.query.id, //工单id
                item_id: 4,
                params:{
                    key:key.toString(),
                    num:num.toString(),
                    name:name.toString()
                }
            }, function (data) {
                if (data.status == '0') {
                    _this.$router.push({
                        path:'/workdetail',
                        query:{
                            id:_this.$route.query.id //工单id
                        }
                    })
                } else {
                    _this.$_LIKE_toast(data.msg);
                }
            });
        }
    }
    }
</script>