<template>
    <div id="rentlistsearch">
        <div class="repair_shop">
			<div class="repair_sear">
				<input type="text" class="searchkey" ref="searchkey" v-model='searchWord' placeholder="请输入车牌号或网点名称"
                       @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="searchWord!==''"
                         src="../images/close.png"/>
                <span class="icon">&#xe605;</span>
			</div>
            <div class="rightIcon" @click="cancel()">取消</div>
        </div>
        <div class="history_items" v-show="ishis">
            <!-- 搜索结果列表-->
            <p v-if='result.length!=0 && searchWord.length>0' class="history_item"
               v-for="(item,index) in result"
               data-type='index'
               @click="goDec(index,item)">
                {{item.name  || item.plate_no}}
            </p>
        </div>
        <div class="noSearch" v-if='limit && searchWord.length>0'>
            <img class="icon_nosearch" src="../images/icon_nosearch.png"/>

            <p>无搜索结果</p>
        </div>
        <!-- 历史记录列表-->
        <div class="history-list" v-if='arr.length>0 || arr1.length>0'>
            <div class="his_title">历史搜索
                <span class="delete-icon right" @click="deletesearch">&#xe6db;</span>
            </div>

            <div class="record colortype" v-if='arr1.length>0'>车辆历史</div>
            <div class="record top-list" v-if='arr1.length>0'>
                <div class="div1"
                      v-for="(item,index) in arr1"
                      @click="hsItem(item)">
                    {{item}}
                </div>
            </div>
            <div class="record colortype" v-if='arr.length>0'>网点历史</div>
            <div class="record" v-if='arr.length>0'>
                <div class="div2"
                     v-for="(item,index) in arr"
                     @click="hsItem(item)">
                    {{item}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    require("../css/rentlistsearch.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'
    import { MessageBox } from 'mint-ui'
    export default{
        data ()
    {
        return {
            searchWord: '',//input输入内容
            ishis: false,//弹层是否展示
            searching: true,//模糊查询时间间隔
            limit: false,//有无搜索结果
            result: [],//所有数据
            arr: JSON.parse(localStorage.getItem('peisearchnet')) || [],//存储的历史搜索网点
            arr1: JSON.parse(localStorage.getItem('peisearchcar')) || []//存储的历史搜索车辆
        }
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
        this.$refs.searchkey.focus();//获取焦点，弹起键盘
    }
    ,
    methods: {
        keyupall(e)
        {//模糊查询
            let _this = this;
            if($(".repair_sear input").val().replace(/(^\s*)|(\s*$)/g, '')!=''){//去除空格
                if ($(".repair_sear input").val().length > 0 && _this.searching) {
                    _this.searching = false;
                    myAjax.post(getApiUrl('/branch-car-stock/search'), {
                        mobile: sessionStorage.getItem('mobile'),
                        city_id: sessionStorage.getItem('city_id'),//权限城市id
                        kw: $(".repair_sear input").val()
                    }).then(data=>{
                        if (data.status == 0) {
                            if (data.data == ''|| JSON.stringify(data.data) == '{}') {
                                _this.limit = true;
                                _this.ishis = false;
                                _this.result = [];
                            } else {
                                if (data.data.branch && data.data.car) {//搜索出来的是网点和车辆
                                    _this.result = data.data.branch.concat(data.data.car);
                                }else if(data.data.branch && !data.data.car){//搜索出来的是网点
                                    _this.result=data.data.branch;
                                }else if(!data.data.branch && data.data.car){//搜索出来的是车辆
                                    _this.result=data.data.car;
                                }
                                _this.limit = false;
                                _this.ishis = true;
                            }
                        }else {
                            _this.$_LIKE_toast(data.msg)
                        }
                })
                setTimeout(function () {
                    _this.searching = true;
                }, 500)
            }
        }else{
            if(_this.searchWord.length==0){
                //展示历史记录
                _this.result = [];
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
        this.searchWord = '';
        this.ishis = false;
    }
    ,
    goDec(index,item)
    {
        this.ishis = false;
        if(item.plate_no){
            this.searchWord = item.plate_no;
            //车辆详情接口
            myAjax.post(getApiUrl('/work-order/car-detail'), {
                mobile: sessionStorage.getItem('mobile'),
                content: item.plate_no //车牌号
            }).then(data=>{
                if(data.status==0){
                    if(data.data=='' || JSON.stringify(data.data)=="{}" || data.data instanceof Array){
                        this.$_LIKE_toast("此车牌不存在")
                    }else{
                        if(data.data.plate_no){
                            this.arr1.unshift(this.searchWord);
                            this.unique(this.arr1,item);
                            if(data.data.status==2){//车辆租赁中
                                MessageBox.confirm('', {
                                    message: '该车当前处于租赁中，请确定是否继续操作！'
                                }).then(action => {
                                    if (action == 'confirm') { //确认的回调
                                        if (this.$route.query.type === '2') {
                                            this._toPrepare(data.data.car_id)//整备详情
                                        } else {
                                            //去车辆详情页面
                                            window.location.href="../manageOrderCardetail/index.html?plate_no="+item.plate_no;
                                        }
                                    }
                                }).catch(err =>{
                                    if (err == 'cancel') { //取消的回调

                                    }
                                });
                            }else{
                                if (this.$route.query.type === '2') {
                                    this._toPrepare(data.data.car_id)//整备详情
                                } else {
                                    //去车辆详情页面
                                    window.location.href="../manageOrderCardetail/index.html?plate_no="+item.plate_no;
                                }
                            }
                        }else{
                            this.$_LIKE_toast("此车牌不存在")
                        }
                    }
                }else{
                    this.$_LIKE_toast(data.msg)
                }
            });
        }else{
            this.searchWord=item.name;
            //非租赁列表接口
            myAjax.post(getApiUrl('/work-order/car-list'), {
                mobile: sessionStorage.getItem('mobile'),
                branch_id:item.id //网点id
            }).then(data=>{
                if(data.status==0){
                    this.arr.unshift(this.searchWord);
                    this.unique(this.arr,item);
                    if(data.data.length==0){
                        MessageBox('', '当前网点暂无车辆!');
                    }else{
                        //去非租赁网点详情页面
                        this.$router.push({
                            path:'/netnorentcar',
                            query:{
                                branch_id:item.id //网点id
                            }
                        })
                    }
                }else{
                    this.$_LIKE_toast(data.msg)
                }
            })
        }
    }
    ,
        // 整备工单过来的
        _toPrepare (car_id) {
            myAjax.post(getApiUrl('/work-order-kerb/order-by-car'), {
                mobile: sessionStorage.getItem('mobile'),
                car_id: car_id
            }).then(res => {
                if (res.status === 0) {
                    sessionStorage.setItem("id", res.data.id);//存储整备工单id
                    if (Number(res.data.status) === 2) {
                        window.location.href = "../manageOrder/prepareWork/prepareend.html";
                    } else {
                        window.location.href = "../manageOrder/prepareWork/preparedetail.html";
                    }
                } else {
                    this.$_LIKE_toast(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
    hsItem(hsWord)
    {//处理直接点击历史记录
        this.searchWord = hsWord;
        $(".repair_sear input").val(hsWord)
        $(".repair_sear input").focus();
        this.ishis = false;
        this.keyupall();
    }
    ,
    unique(allarr,item)
    {//历史记录去重
        var res = [];
        var obj = {};
        if(item.plate_no){//车辆
            for (var i = 0; i < allarr.length; i++) {
                if (!obj[allarr[i]]) {
                    obj[allarr[i]] = 1;
                    res.push(allarr[i]);
                }
            }
            this.arr1 = res;
            if(this.arr1.length>15){
                this.arr1 = this.arr1.slice(0, 15);
            }
            localStorage.setItem('peisearchcar',JSON.stringify(this.arr1));
        }else{//网点
            for (var i = 0; i < allarr.length; i++) {
                if (!obj[allarr[i]]) {
                    obj[allarr[i]] = 1;
                    res.push(allarr[i]);
                }
            }
            this.arr = res;
            if(this.arr.length>3){
                this.arr = this.arr.slice(0, 3);
            }
            localStorage.setItem('peisearchnet',JSON.stringify(this.arr));
        }
    },
    //删除缓存
    deletesearch()
    {
        this.ishis = false;
        localStorage.removeItem('peisearchnet');
        localStorage.removeItem('peisearchcar');
        this.arr=[];//历史网点记录置空
        this.arr1=[];//历史车辆记录置空
    },
    //取消搜索
    cancel(){
        window.history.back();
    }
    }
    }
</script>