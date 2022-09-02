<template>
    <div class="container">
        <div class="header">
            <div class="item" @click="goSearchPage">
                <span class="icon icon_search"></span>
                <span>搜索</span>
            </div>
            <div class="item" @click="showFilter">
                <span class="icon icon_fliter"></span>
                <span>筛选</span>
            </div>
            <div class="item" @click="showSortBox" v-show="tabCurrentIndex===1">
                <span class="icon icon_fliter"></span>
                <span>排序</span>
            </div>
            <div class="item" @click="refreshList">
                <span class="icon icon_refresh"></span>
                <span>刷新</span>
            </div>
        </div>
        <div class="tab-group">
            <div class="tab-item" @click="changeTab(1)">
                <span :class="tabCurrentIndex===1?'active':''">年检提醒</span>
            </div>
            <div class="tab-item" @click="changeTab(2)">
                <span :class="tabCurrentIndex===2?'active':''">年检工单</span>
            </div>
        </div>
        <div class="list-group">
            <div class="list" v-show="tabCurrentIndex===1">
                <RemindList/>
            </div>
            <div class="list" v-show="tabCurrentIndex===2">
                <indexList/>
            </div>
        </div>
        <!-- 提醒筛选 -->
        <FilterBox :list="tipFilterList" type="radio"  @onChangeValue="selectFilterValue" :show="isShowTipFilter" @hideFilterBox="hideFilterBox"/>
        <!-- 年检筛选 -->
        <FilterBox :list="filterList" type="radio"  @onChangeValue="selectFilterValue" :show="isShowFilter" @hideFilterBox="hideFilterBox" title="工单状态"/>
        <!-- 提醒排序 -->
        <LikeRadio :list="sortList" :show="isShowSort" @onChangeValue="selectSortValue" @hideFilterBox="hideSortBox"/>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import RemindList from '../components/remindList.vue'
import indexList from '../components/indexList.vue'
import FilterBox from '../components/filterBox.vue'
import LikeRadio from '../components/likeRadio.vue'

export default {
    name:'workList',
    components:{
        FilterBox,
        RemindList,
        indexList,
        LikeRadio,
    },
    data(){
        return{
            isShowTipFilter:false,
            isShowFilter:false,
            isShowSort:false,
            tipFilterList:[
                {
                    id:0,
                    name:'全部',
                    isSelected:true
                },
                {
                    id:1,
                    name:'有违章',
                    isSelected:false
                },
                {
                    id:2,
                    name:'无违章',
                    isSelected:false
                }
            ],
            filterList:[
                {
                    id:0,
                    name:'全部',
                    isSelected:true
                },
                {
                    id:1,
                    name:'年检中',
                    isSelected:false
                },
                {
                    id:2,
                    name:'已完成',
                    isSelected:false
                },
            ],
            sortList:[
                {
                    id:1,
                    name:'距离最迟年检日期从近到远',
                    isSelected:true
                },
                {
                    id:2,
                    name:'违章数量从多到少',
                    isSelected:false
                }
            ]
        }
    },
    computed:{
        ...mapState('workList',[
            'tabCurrentIndex',
        ]),
    },
    methods:{
        ...mapActions('workList',[
            'getWorkList',
            'getTipList',
        ]),
        ...mapMutations('workList',[
            'setTabCurrentIndex',
            'setTipListData',
            'setListData',
            'setTipStatus',
            'setStatus',
            'setTipSort'
        ]),
        changeTab(index){
           this.setTabCurrentIndex(index)
        },
        refreshList(){
            if(this.tabCurrentIndex==1){
                this.setTipListData({ tipPage:0,tipListData:[] })
                this.getTipList()
            }else{
                this.setListData({ page:0,listData:[] })
                this.getWorkList() 
            }
            
        },
        showFilter(){
            if(this.tabCurrentIndex==1){
                this.isShowTipFilter = true
            }else{
                this.isShowFilter = true
            }  
        },
        hideFilterBox(){
            if(this.tabCurrentIndex==1){
                this.isShowTipFilter = false
            }else{
                this.isShowFilter = false
            }  
        },
        selectFilterValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            if(this.tabCurrentIndex==1){
                this.setTipStatus(arr.toString())
                this.getTipList()
            }else{
                this.setStatus(arr.toString())
                this.getWorkList()
            }
            
        },
        selectSortValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            this.setTipSort(arr.toString())
            this.getTipList()
        },
        showSortBox(){
            this.isShowSort = true
        },
        hideSortBox(){
            this.isShowSort = false
        },
        goSearchPage(){
            this.$router.push({
                path:'searchItem',
                query:{
                    type:this.tabCurrentIndex
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    @import url('../css/common.less');
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        padding-top: .69rem;
        .header{
            position: fixed;
            left: 0;
            top:0;
            width: 100%;
            display: flex;
            align-items: center;
            height: .34rem;
            background: #fff;
            border-bottom: 1px solid #F6F6F6;
            .item{
                flex:1;
                height: .26rem;
                font-size: .14rem;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid #f6f6f6;
                &:last-child{
                    border-right: 0;
                }
                .icon{
                    width:.12rem;
                    height: .12rem;
                    margin-right: .1rem;
                }
                .icon_search{
                    background: url('../images/icon_search.png') no-repeat;
                    background-size:100% 100%;
                }
                .icon_fliter{
                    background: url('../images/icon_fliter.png') no-repeat;
                    background-size:100% 100%;
                }
                .icon_refresh{
                    background: url('../images/icon_refresh.png') no-repeat;
                    background-size:100% 100%;
                }
            }
        }
        .tab-group{
            position: fixed;
            left: 0;
            top:.34rem;
            width: 100%;
            background: #fff;
            &::after{
                content:'';
                background :#F6F6F6;
                width: 100%;
                height: 1px;
                transform: scaleY(.5);
                position: absolute;
                left: 0;
                bottom: -1px;
            }
            .fc();
            .tab-item{
                flex:1;
                height: .34rem;
                color: #999;
                .fc();
                span{
                    height: .34rem;
                    border-bottom: 2px solid #fff;
                    .fc();
                }
                .active{
                    color: #42A6EA;
                    border-bottom: 2px solid #42A6EA;
                }
            }
        }
        .list-group{
            position: relative;
            height: calc(100vh - .64rem);
        }
        .list{
            position: relative;
            height: 100%;
        }
    }
</style>


