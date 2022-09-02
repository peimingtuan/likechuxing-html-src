<template>
    <div class="search">
        <div class="repair_shop">
            <span>{{search_name}}</span>
			<span class="repair_sear">
				<input type="text" @focus="hisData()" v-model='searchWord' :placeholder="plac_txt"
                       @input.trim="keyupall($event)"/>
					<img class="input_clearn" @mousedown="clearInput($event)" v-show="isnone"
                         src="../images/close.png"/>
			</span>
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
               @click="goDec(index,item.name,item.id,item)">
                {{item.name||item.plate_no}}
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
    import $ from 'jquery'
    import userData from '../../../../../other_modules/like-manageOrder/UserData'
    import getApiUrl from '../js/getApiUrl'
    import myAjax from '../../../../../other_modules/like-request/withAxiosV2'
    export default {
        name: 'search',
        props: {
            search_name: '',
            plac_txt: '',//placeholder
            apiUrl: '',//请求接口地址
            search_type: ''//type为来源
        },
        data()
    {
        return {
            searchWord: '',//input输入内容
            ishis: false,//弹层是否展示
            isnone: false,//全部清除按钮
            searching: true,//模糊查询时间间隔
            limit: false,//有无搜索结果
            result: [],//所有数据
            search_id: '',
            arr: JSON.parse(localStorage.getItem('peisearch')) || [],//存储的历史记录信息
            list_item: ''
        }
    }
    ,
    mounted()
    {

    }
    ,
    methods: {
        hisData()
        {//展示历史记录
            this.arr && this.arr.length != 0 ? this.ishis = true : this.ishis = false;
//	    		if(this.searchWord&&this.searchWord.length>0){
//	    			this.isnone = false;
//				 	this.issucc = false;
//				 	//this.result = [];
//	    		}
        }
    ,
        keyupall(e)
        {//模糊查询
            let _this = this;
            if($(".repair_sear input").val().replace(/(^\s*)|(\s*$)/g, '')!=''){//去除空格
                _this.isnone = true;
                if ($(".repair_sear input").val().length > 0 && _this.searching) {
                    _this.searching = false;
                    myAjax.post(getApiUrl(_this.apiUrl), {
                        mobile: userData.state.mobile || '18501935330',
                        city_id: userData.state.city_ids,//权限城市id
                        kw: $(".repair_sear input").val()
                    }).then(data=>
                    {
                        if (data.status == 0) {
                            //if(_this.search_type==2||_this.search_type==3)_this.result=_this.result.branch;
                            if (data.data != '') {
                                if (data.data.branch) {//搜索出来的是网点
                                    _this.result = data.data.branch;
                                } else if (data.data.car) {//搜索出来的是车辆
                                    _this.result = data.data.car;
                                }
                                _this.limit = false;
                                _this.ishis = true;
                            } else {
                                _this.limit = true;
                                _this.ishis = false;
                                _this.result = [];
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
            this.search_id = '';
            this.isnone = false;
            this.ishis = false;
            this.result = [];
            this.$emit('result', true);
        }
    ,
        goDec(index, name, id, list_item)
        {
            this.searchWord = name;
            this.isnone = true;
            this.ishis = false;
            this.search_id = id;
            this.arr.push(this.searchWord);
            this.unique(this.arr);
            this.list_item = list_item
            this.$emit('result', true);
        }
    ,
        hsItem(hsWord)
        {//处理直接点击历史记录
            this.searchWord = hsWord;
            this.isnone = true;
            this.ishis = false;
            //this.keyupall();

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
    }
    }
</script>

<style scoped>
    * {
        box-sizing: border-box;
    }
    .repair_shop input {
        height: .281rem;
        line-height: .281rem;
        border: none;
        outline: none;
        border-right: 1px solid #dcdcdc !important;
        padding: 0;
        -webkit-appearance: none;
        width: 2rem;
        padding-right: .31rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .repair_sear {
        display: inline-block;
        position: relative;
    }

    .input_clearn {
        right: .12rem;
        top: .167rem;
        position: absolute;
        width: .18rem;
    }

    /*历史记录*/
    .history_items {
        z-index: 120;
        background: #FFFFFF;
        position: absolute;
        width: 3.51rem;
        left: .12rem;
        /*min-height: 1rem;*/
        border: 1px solid #F0F0F0;
        /*max-height: 6rem;*/
        overflow: hidden;
        padding:0 .1rem;
        box-shadow: 1px 2px 2px #e8e8e8;

    }

    .his_list, .his_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        display: -webkit-flex;
        line-height: 1.1;
        -webkit-justify-content: space-between;
        -webkit-align-items: center;
        /*padding: 0.1rem 0.15rem;*/
    }

    .his_list {
        border-bottom: 1px solid #ededed;
        padding: 0.1rem 0;
        line-height: 1.5;
        /*margin: 0 0.15rem;*/
    }

    .his_close {
        /*padding: .1rem .15rem;*/
        text-align: right;
        color: #ccc;
        line-height: 1.5;
        padding: .1rem 0;
    }

    .delete-icon {
        font-family: iconfont;
        width: .468rem;
        line-height: .468rem;
        font-size: .18rem;
        display: inline-block;
        text-align: center;
    }

    .his_clearn {
        display: inline-block;
        width: .14rem;
        height: .14rem;
    }

    .his_clearn img {
        width: 100%;
    }

    .history_item {
        padding: 0.1rem 0;
        line-height: 1.5;
        border-bottom: 1px solid #ededed;
    }

    .noSearch {
        text-align: center;
        padding: .5rem 0;
        box-shadow: 1px 2px 2px #e8e8e8;
        background:#fff;
    }

    .noSearch img {
        width: 0.5rem;
    }
</style>