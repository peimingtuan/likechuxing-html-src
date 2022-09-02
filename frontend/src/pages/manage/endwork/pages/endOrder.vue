<template>
    <div id="endorder">
        <div class="endwork-netname">
            <div class="repair_shop">
                <span class="netname">网点名称：</span>
			<span class="repair_sear">
				<input type="text" @focus="hisData()" v-model='searchWord' placeholder="请输入网点或使用地图选择"
                       @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="isnone"
                         src="../images/close.png"/>
			</span>
                <span class="search_map" @click="goMap()">地图选择</span>
            </div>
            <div class="history_items" v-show="ishis">
                <!-- 历史记录列表-->
                <p v-if='result.length==0&&arr.length!=0&&searchWord==""' class="his_title">历史记录
                    <span class="delete-icon right" @click="deletesearch">&#xe6db;</span>
                </p>

                <p v-if='result.length==0&&arr.length!=0&&searchWord==""' class="his_list"
                   v-for="(item,index) in arr"
                   @click="hsItem(item)">
                    {{item}}
                </p>
                <!-- 搜索结果列表-->
                <p v-if='result.length!=0 && searchWord.length>0' class="history_item"
                   v-for="(item,index) in result"
                   data-type='index'
                   @click="goDec(index,item.name,item.id,item.choice_floor)">
                    {{item.name}}
                </p>

                <p class="his_close" @click="ishis=false" v-if='result.length==0&&arr.length!=0&&searchWord==""'>关闭</p>
            </div>
            <div class="noSearch" v-if='limit && searchWord.length>0'>
                <img class="icon_nosearch" src="../images/icon_nosearch.png"/>

                <p>无搜索结果</p>
            </div>
        </div>
        <div class="endwork-floor">
            <p class="choice-floor" @click="choiceFloor()">
                <span>楼层：</span>
                <input class="floors input-foucs" type="text" value="" placeholder="请选择楼层" readonly />
                <span class="endwork-icon right">&#xe623;</span>
            </p>

            <p>
                <span>车位号：</span>
                <input class="carposinum input-foucs" type="text" value="" @input.trim="parknumber($event)" placeholder="请输入车位号"/>
            </p>
        </div>
        <div class="endwork-state" @click="choiceStatus()">
            <span>更改车辆状态：</span>
            <input class="car-state input-foucs" type="text" value="" placeholder="请选择车辆状态" readonly/>
            <input class="car-stateid" type="hidden" value=""/>
            <span class="endwork-icon right">&#xe623;</span>
        </div>
        <!-- 车辆状态备注-->
        <remark :showblock="true"  :text_value="placeholder2" v-show="carstatusremark"/>
        <Button :show="showsubmit" :text="text" @clickbtn="submitInfo"/>
        <!--alert弹框1-->
        <div class="net-contentwindow1 common_cover3 none">
            <div class="net-content1">
                <span class="close-icon">&#xe601;</span>
                <div class="top">
                    车机里程为0，请检查车机
                </div>
                <div class="bottom">
                    <span class="cancel">取消</span><span class="qure">继续提交</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import {Select} from '../../../../component/Select/index'
    import remark from '../component/remark'
    import Button from '../component/bottomBtn'
    import {Indicator} from 'mint-ui'
    export default{
        name:'endorder',
        components: {
            remark,
            Button

        },
        data(){
        return{
            type:'',//1来自加油工单，2来自调度工单
            placeholder2:'请填写备注，200字以内(必填)',
            carstatusremark:false,
            showsubmit:false,//底部按钮
            text:'提交',
            array1:[],
            array2:[],//存储车辆状态
            //搜索
            searchWord: '',//input输入内容
            ishis: false,//弹层是否展示
            isnone: false,//全部清除按钮
            searching: true,//模糊查询时间间隔
            limit: false,//有无搜索结果
            result: [],//所有数据
            search_id:'',//搜索的网点id
            arr: JSON.parse(localStorage.getItem('peisearch')) || []//存储的历史记录信息
        }
    },
    created () {
        this.getcarstatus();
    },
    destroyed(){
        $("body").css("background","#fff");
    },
    mounted () {
        $("body").css("background","#f6f6f6");
        if(this.$route.query.branch_id && this.$route.query.name){//是否来自网点搜索页面
            if(this.$route.query.type){
                if(this.$route.query.type==1){
                    this.type=1;
                }else{
                    this.type=2;
                }
            }
            this.search_id=this.$route.query.branch_id;
            this.searchWord=this.$route.query.name;
            this.isnone=true;
            if (sessionStorage.getItem('choicefloor')) {
                if (sessionStorage.getItem('choicefloor').split(',').length == 1) {
                    $(".floors").val(sessionStorage.getItem('choicefloor'));
                }
            }
        }else{//来自工单结束页面
            if(this.$route.query.type){
                if(this.$route.query.type==1){
                    this.type=1;
                }else{
                    this.type=2;
                }
            }
        }

        //关闭弹框
        $(".close-icon").on("click", function () {
            $(".net-contentwindow1").addClass("none");
        });
        $(".net-contentwindow1").on("click", ".cancel", function () {
            $(".net-contentwindow1").addClass("none");
        });
        $(".net-contentwindow1").on("click", ".cance2", function () {
            $(".net-contentwindow1").addClass("none");
        });

    },
    methods: {
        choiceFloor(){
            if($(".endwork-netname input").val()!=''){
                if(this.search_id==''){
                    this.$_LIKE_toast("网点选择失败，请重新选择")
                }else{
                    let _this = this,
                            choicefloor = sessionStorage.getItem('choicefloor'),
                            array = [];
                    if (!choicefloor) {
                        new Toast("获取网点楼层失败");
                        return false;
                    }
                    $.each(choicefloor.split(','), function (i, val) {
                        let text = {
                            name: ''
                        };
                        text.name = val;
                        array.push(text);
                    });
                    new Select({
                        name: '楼层',
                        options: array,
                        callback: function (item) {
                            $(".floors").val(item.name);
                        }
                    })
                }
            }else{
                this.$_LIKE_toast('请先选择网点')
            }
        },
        //输入车位号
        parknumber(e){
            if($(".floors").val()==''){
                $(".carposinum").val('');
                this.$_LIKE_toast("请先选择楼层")
            }
        },
        //获取车辆状态
        getcarstatus(){
            myAjax.post(getApiUrl('/work-order/car-status'),{
                mobile:sessionStorage.getItem("mobile")
            }).then(res=>{
                if(res.status == 0){
                this.array1=res.data;
                for(var i=0;i<this.array1.length;i++){
                    if(this.array1[i].id!='32'){//去掉故障
                        this.array2.push(this.array1[i]);
                    }
                }
            }else{
                this.$_LIKE_toast(res.msg)
            }
        }).catch(err => {
            console.log(err)
    })
    },
    //选择车辆状态
    choiceStatus(){
        let _this2=this;
        if(_this2.array2.length!=0){
            new Select({
                name: '更改车辆状态',
                id: '公司id',
                options: _this2.array2,
                callback: function (item) {
                   $(".car-state").val(item.name);
                    $(".car-stateid").val(item.id);
                    if(item.id==1 || item.id==3 || item.id==37){//空闲，长租空闲，预约空闲,备注不显示
                        _this2.carstatusremark=false;
                    }else{
                        _this2.carstatusremark=true;
                    }
                }
            })
        }else{
            _this2.$_LIKE_toast("正在获取车辆状态数据，请稍后重试")
        }
    },
    goMap(){
            if(this.type==1){
                window.location.href = './index.html#/selectmapnet?type=1'
            }else{
                window.location.href = './index.html#/selectmapnet'
            }
    },
    //提交信息
    submitInfo(){
            let _this=this;
            if(_this.search_id==''){
                if(_this.searchWord==''){
                    _this.$_LIKE_toast("请选择网点")
                }else{
                    _this.$_LIKE_toast("网点选择失败，请重新选择")
                }
                return false;
            }
            let param = {
                mobile: sessionStorage.getItem("mobile"),
                city_id: sessionStorage.getItem("carcity_id"),//车辆当前城市id
                work_order_id: sessionStorage.getItem('id'), //工单id
                car_id: sessionStorage.getItem('car_id'), //车辆id
                branch_id: _this.search_id,//网点id
                parking_floor: $(".floors").val(),//楼层
                parking_no: $(".carposinum").val(),//车位号
                branch_type: '1',//网点类型1网点，2加油站
                PhoneInfo: sessionStorage.getItem("PhoneInfo") || '',
                type: '',//1结束加油工单,2结束调度工单
                comment: '',//车辆状态备注信息
                is_tool_car:'2',//1为工具车，2为否
                car_status: $(".car-stateid").val() //车辆状态id
            }
            if(_this.type==1){
                param.type=1;
            }else{
                param.type=2;
            }
            if($(".floors").val()==''){
                _this.$_LIKE_toast("请选择楼层")
                return false;
            }
            if ($(".floors").val() == '地面' || Number($(".floors").val()) > 0) {
                console.log($(".floors").val())
            }else{
                if($(".carposinum").val()==''){
                    _this.$_LIKE_toast("请输入车位号")
                    return false;
                }
            }
            if($(".car-stateid").val()==''){
                _this.$_LIKE_toast("请选择车辆状态")
                return false;
            }
            if ($(".car-stateid").val() == '33' || $(".car-stateid").val() == '25' || $(".car-stateid").val() == '23' || $(".car-stateid").val() == '20') {//状态为保养，保险，办公用车,车辆整备
                if ($("#remark .void_writeinfo").val().replace(/(^\s*)|(\s*$)/g, "") == "") {
                    _this.$_LIKE_toast("请填写车辆状态备注信息")
                    return false;
                }
            }else{
                param.comment=$(".void_writeinfo").val().replace(/(^\s*)|(\s*$)/g, "");//车辆状态备注信息
            }
            postshow(param);
            function postshow(param) {
                $.ajax({
                    type: "post",
                    data: param,
                    url: getApiUrl('/work-order/over'),
                    beforeSend: function () {
                        Indicator.open({//加载loading
                            text: '提交中...',
                            spinnerType: 'fading-circle'
                        });
                    },
                    complete:function(){
                        Indicator.close();//取消loading
                    },
                    success: function (data) {
                        if (data.status == '0') {
                            if(data.data.notice){
                                _this.$_LIKE_toast(data.data.notice)
                            }else{
                                _this.$_LIKE_toast("请拉门确认已锁门");
                            }
                            setTimeout(function () {
                                if(_this.type==2){
                                    window.location.href = "../manageOrder/commonFile/jobend.html?type=2";
                                }else{
                                    window.location.href = "../manageOrder/commonFile/jobend.html";
                                }
                            }, 2000)
                        } else if (data.status == '10011') {
                            $(".net-contentwindow1 .top").text("车机里程为0，禁止上线，请更改其他状态");
                            $(".net-contentwindow1 .bottom").html("<span class='cance2'>取消</span>");
                            $(".net-contentwindow1").removeClass("none");
                        } else if (data.status == '10012') {
                            $(".net-contentwindow1 .top").text("车机里程为0，请检查车机");
                            $(".net-contentwindow1 .bottom").html('<span class="cancel">取消</span><span class="qure">继续提交</span>');
                            $(".net-contentwindow1").removeClass("none");
                            $(".net-contentwindow1").on("click", ".qure", function () {
                                param.force_commit = '1';
                                postshow(param);
                            });
                        } else if (data.status == '10013') {
                            _this.$_LIKE_toast(data.msg);
                            setTimeout(function () {
                                if(_this.type==2){
                                    window.location.href = "../manageOrder/commonFile/jobend.html?type=2";
                                }else{
                                    window.location.href = "../manageOrder/commonFile/jobend.html";
                                }
                            }, 2000)
                        } else {
                            _this.$_LIKE_toast(data.msg);
                        }
                    }
                });
            }
    },

    hisData()
    {//展示历史记录
        this.arr && this.arr.length != 0 ? this.ishis = true : this.ishis = false;
    }
    ,
    keyupall(e)
    {//模糊查询
        let _this = this;
        if($(".repair_sear input").val().replace(/(^\s*)|(\s*$)/g, '')!=''){//去除空格
            _this.isnone = true;
            if ($(".repair_sear input").val().length > 0 && _this.searching) {
                _this.searching = false;
                myAjax.post(getApiUrl('/branch-car-stock/search'), {
                    mobile: sessionStorage.getItem('mobile'),
                    city_id: sessionStorage.getItem('city_id'),//权限城市id
                    kw: $(".repair_sear input").val()
                }).then(data=>
                {
                    if (data.status == 0) {
                        if (data.data == ''|| JSON.stringify(data.data) == '{}') {
                            _this.limit = true;
                            _this.ishis = false;
                            _this.result = [];
                        }else{
                            if (data.data.branch) {//搜索出来的是网点
                                _this.result = data.data.branch;
                                _this.limit = false;
                                _this.ishis = true;
                            }
                        }
                    } else {
                        _this.$_LIKE_toast(data.msg)
                    }
            }
        )
            setTimeout(function () {
                _this.searching = true;
            }, 500)
        }
    }else{
            _this.isnone = false;
            _this.searchWord = '';//网点清空
            _this.search_id = '';//网点id清空
            $(".floors").val('');//清空楼层
            $(".carposinum").val('');//清空车位号
        if(_this.searchWord.length==0){
            //展示历史记录
            _this.result = [];
            _this.hisData()
        }else{
            _this.$_LIKE_toast("输入的值不能为空")
            _this.ishis = false;
        }
    }
    }
    ,
    clearInput(e)
    {//清除按钮
        e.preventDefault();
        this.searchWord = '';//网点清空
        this.search_id='';//网点id清空
        this.isnone = false;
        this.ishis = false;
        this.result = [];
        $(".floors").val('');//清空楼层
        $(".carposinum").val('');//清空车位号
    }
    ,
    goDec(index, name, id,choicefloor)
    {
        this.searchWord = name;
        this.isnone = true;
        this.ishis = false;
        this.arr.unshift(this.searchWord);
        this.unique(this.arr);
        this.search_id=id;//搜索的网点id
        if (choicefloor.length == 1) {
            $(".floors").val(choicefloor[0]);
        }else{
            $(".floors").val('');
        }
        sessionStorage.setItem('choicefloor', choicefloor.toString());//存储对应网点楼层
    }
    ,
    hsItem(hsWord)
    {//处理直接点击历史记录
        this.searchWord = hsWord;
        $(".repair_sear input").val(hsWord)
        $(".repair_sear input").focus();
        this.isnone = true;
        this.ishis = false;
        this.keyupall();
    }
    ,
    unique(allarr)
    {//历史记录去重
        var res = [];
        var obj = {};
        for (var i = 0; i < allarr.length; i++) {
            if (!obj[allarr[i]]) {
                obj[allarr[i]] = 1;
                res.push(allarr[i]);
            }
        }
        this.arr = res;
        if(this.arr.length>10){
            this.arr = this.arr.slice(0, 10);
        }
        localStorage.setItem('peisearch',JSON.stringify(this.arr));
    },
    //删除缓存
    deletesearch()
    {
        this.ishis = false;
        localStorage.removeItem('peisearch');
        this.arr=[];//历史记录置空
    },



    }

    }
</script>
<style>
    #endorder .repair_shop input {
        /*height: .4rem;*/
        /*line-height: .4rem;*/
        border: none;
        outline: none;
        padding: 0;
        -webkit-appearance: none;
        width: 2.15rem;
        padding-left: .12rem;
        padding-right: .31rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-right: 1px solid #dcdcdc;
        border-radius:0;
        box-sizing: border-box;
    }

    #endorder .repair_shop .netname{
        width:.7rem;
        display:inline-block;
    }

    #endorder .repair_sear {
        display: inline-block;
        position: relative;
    }

    #endorder .input_clearn {
        right: .12rem;
        top: .18rem;
        position: absolute;
        width: .18rem;
    }

    /*历史记录*/
    #endorder .history_items {
        z-index: 120;
        background: #FFFFFF;
        position: absolute;
        width: 3.51rem;
        left: .12rem;
        border: 1px solid #F0F0F0;
        overflow: hidden;
        padding:0 .1rem;
        box-shadow: 1px 2px 2px #e8e8e8;

    }

    #endorder .his_list,#endorder .his_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        display: -webkit-flex;
        line-height: 1.1;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        /*padding: 0.1rem 0.15rem;*/
    }

    #endorder .his_list {
        border-bottom: 1px solid #ededed;
        padding: 0.1rem 0;
        line-height: 1.5;
        /*margin: 0 0.15rem;*/
    }

    #endorder .his_close {
        /*padding: .1rem .15rem;*/
        text-align: right;
        color: #ccc;
        line-height: 1.5;
        padding: .1rem 0;
    }

    #endorder .delete-icon {
        font-family: iconfont;
        width: .468rem;
        line-height: .468rem;
        font-size: .18rem;
        display: inline-block;
        text-align: center;
    }

    #endorder .his_clearn {
        display: inline-block;
        width: .14rem;
        height: .14rem;
    }

    #endorder .his_clearn img {
        width: 100%;
    }

    #endorder .history_item {
        padding: 0.1rem 0;
        line-height: 1.5;
        border-bottom: 1px solid #ededed;
    }

    #endorder .noSearch {
        text-align: center;
        padding: .5rem 0;
        box-shadow: 1px 2px 2px #e8e8e8;
        background:#fff;
    }

    #endorder .noSearch img {
        width: 0.5rem;
    }

    #endorder .endwork-netname{
        position:relative;
    }
    #endorder .search_map{
        display:inline-block;
        /*padding:0 .05rem;*/
        color:#4caced;
        position:absolute;
        right:0rem;
        top:.12rem;
        width:.65rem;
    }
    #endorder .endwork-netname{
        padding: .12rem;
        line-height: .538rem;
        background: #fff;
    }

    #endorder .endwork-state,
    #endorder .endwork-floor p {
        padding: .12rem;
        line-height: .438rem;
        background: #fff;
    }

    #endorder .choice-floor{
        border-bottom: 1px solid #ededed;
    }

    #endorder input
    {
        height: .281rem;
        line-height: .281rem;
        border: none;
        outline: none;
        box-sizing: border-box;
    }

    #endorder input::-webkit-input-placeholder,
    {
        font-size: .14rem;
    }

    #endorder .endwork-floor,
    #endorder .endwork-state {
        margin-top: .12rem;
    }
    #endorder .endwork-icon {
        font-family: 'iconfont';
        float: right;
    }

    /*弹框*/
    #endorder .common_cover3 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .44);
        z-index: 100;
    }

    #endorder .net-content1 {
        width: 2.81rem;
        height: 1.405rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 5px;
        margin-top: -0.7025rem;
        margin-left: -1.405rem;
        box-sizing: border-box;
    }

    #endorder .net-content1 .close-icon{
        display: inline-block;
        width:.234rem;
        line-height:.234rem;
        text-align: center;
        font-family: 'iconfont';
        position:absolute;
        right:.0468rem;
        top:.0468rem;
    }

    #endorder .net-content1 .top {
        padding: .234rem 0;
        text-align: center;
        height: .936rem;
        line-height: .468rem;
        box-sizing: border-box;
    }

    #endorder .net-content1 .bottom{
        box-sizing: border-box;
        height: .468rem;
        border-top: 1px solid #ececec;
    }

    #endorder .net-content1 .bottom span{
        display: inline-block;
        width: 1.405rem;
        line-height: .456rem;
        text-align: center;
        box-sizing: border-box;
    }

    #endorder .net-content1 .qure{
        color: #65b7ef;
        border-left: 1px solid #ececec;
    }

    #endorder .net-content1 .bottom .cance2{
        width:2.81rem;
        color: #65b7ef;
    }
</style>