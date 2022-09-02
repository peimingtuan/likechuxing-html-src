<template>
    <div id="search2">
        <div class="repair_shop">
			<span class="repair_sear">
				<input type="text" class="searchkey" ref="searchkey" @focus="hisData()" v-model='searchWord' placeholder="请输入网点名称或者车牌号"
                       @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="isnone"
                         src="../images/close.png"/>
			</span>
            <span @click="cancel()">取消</span>
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
               @click="goDec(index,item.branch.name,item.branch_id)">
                {{item.branch.name}}
            </p>

            <p class="his_close" @click="ishis=false" v-if='result.length!=0&& searchWord.length>0'>关闭</p>
        </div>
        <div class="noSearch" v-if='limit && searchWord.length>0'>
            <img class="icon_nosearch" src="../images/icon_nosearch.png"/>

            <p>无搜索结果</p>
        </div>
    </div>
</template>
<script>
    require("../css/search2.css")
    import $ from 'jquery'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'
    export default{
        data ()
    {
        return {
            searchWord: '',//input输入内容
            ishis: false,//弹层是否展示
            isnone: false,//全部清除按钮
            searching: true,//模糊查询时间间隔
            limit: false,//有无搜索结果
            result: [],//所有数据
            arr: JSON.parse(localStorage.getItem('peisearch')) || []//存储的历史记录信息
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
        //this.$refs.searchkey.blur();//失去焦点，收起键盘
    }
    ,
    mounted()
    {
        $("body").css("background", "#f6f6f6");
        this.$refs.searchkey.focus();//获取焦点，弹起键盘
    }
    ,
    methods: {
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
                    myAjax.post(getApiUrl('/wash/task/group-list'), {
                        token:sessionStorage.getItem("access_token"),
                        search_name: $(".repair_sear input").val() //搜索名称
                    }).then(data=>{
                        if (data.status == 0) {
                            if (data.data != '') {
                                _this.result=data.data;
                                _this.limit = false;
                                _this.ishis = true;
                            } else {
                                _this.limit = true;
                                _this.ishis = false;
                                _this.result = [];
                            }
                        }else if(data.status==401){//验证过期信息
                            _this.$_LIKE_toast("验证信息已失效，请重新登录")
                            setTimeout(function(){
                                window.location.href="index.html#/logon"
                            },2000)
                        } else {
                            _this.$_LIKE_toast(data.msg)
                        }
                })
                setTimeout(function () {
                    _this.searching = true;
                }, 500)
            }
        }else{
            _this.isnone = false;
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
        this.searchWord = '';
        this.isnone = false;
        this.ishis = false;
        this.result = [];
        this.$emit('result', true);
    }
    ,
    goDec(index, name, id)
    {
        this.searchWord = name;
        this.isnone = true;
        this.ishis = false;
        this.arr.unshift(this.searchWord);
        this.unique(this.arr);
        this.$emit('result', true);
        //去网点详情页面
        this.$router.push({
            path:'/networkdetail2',
            query:{
                branch_id:id
            }
        })
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
        this.$emit('result', true);
    },
    //取消搜索
    cancel(){
        window.history.back();
    }
    }
    }
</script>