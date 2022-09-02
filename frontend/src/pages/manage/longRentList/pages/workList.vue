<template>
    <div class="container">
        <div class="header" @touchmove.prevent="">
            <div class="item" @click="goSearchPage">
                <span class="icon icon_search"></span>
                <span>搜索</span>
            </div>
            <div class="item" @click="showFilter" v-show="tabCurrentIndex===2">
                <span class="icon icon_fliter"></span>
                <span>筛选</span>
            </div>
            <div class="item" @click="showSortBox" >
                <span class="icon icon_fliter"></span>
                <span>排序</span>
            </div>
            <div class="item" @click="refreshList">
                <span class="icon icon_refresh"></span>
                <span>刷新</span>
            </div>
        </div>
        <div class="tab-group"  @touchmove.prevent="">
            <div class="tab-item" @click="changeTab(1)">
                <span :class="tabCurrentIndex===1?'active':''">长租列表</span>
            </div>
            <div class="tab-item" @click="changeTab(2)">
                <span :class="tabCurrentIndex===2?'active':''">整备列表</span>
            </div>
        </div>
        <div class="list-group">
            <div class="list" v-show="tabCurrentIndex===1">
                <longRent/>
            </div>
            <div class="list" v-show="tabCurrentIndex===2">
                <indexList/>
            </div>
        </div>
        <div class="footer" @touchmove.prevent="">
            <div class="item1" v-show="tabCurrentIndex===1">
                <div class="btn" @click="goStat" v-show="isShowStat">长租统计</div>
                <div class="btn" @click="openDesc">长租说明</div>
            </div>
            <div class="item2" @click="goAddCar" v-show="tabCurrentIndex===2">
                <span>添加整备车辆</span>
            </div>
        </div>

        <!-- 整备筛选 -->
        <FilterBox :list="carStatusList"   @onChangeValue="selectFilterValue" :show="isShowTipFilter" @hideFilterBox="hideFilterBox" title="车辆状态"/>
        <!-- 长租排序 -->
        <LikeRadio :list="sortList" :show="isShowSort" @onChangeValue="selectSortValue" @hideFilterBox="hideSortBox"/>
        <!-- 整备排序 -->
        <LikeRadio :list="sortAdjustmentList" :show="isShowAdjustmentSort" @onChangeValue="selectSortValue" @hideFilterBox="hideSortBox"/>

        <LongRentDesc :show="showDesc" @closeDesc="closeDesc"/>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import longRent from '../components/longRent.vue'
import indexList from '../components/indexList.vue'
import FilterBox from '../components/filterBox.vue'
import LikeRadio from '../components/likeRadio.vue'
import LongRentDesc from '../components/longRentDesc.vue'

export default {
    name:'workList',
    components:{
        FilterBox,
        longRent,
        indexList,
        LikeRadio,
        LongRentDesc
    },
    data(){
        return{
            showDesc:false,
            isShowTipFilter:false,
            isShowSort:false,
            isShowAdjustmentSort:false,
            sortList:[
                {
                    id:1,
                    name:'距离网点从近到远',
                    isSelected:true
                },
                {
                    id:2,
                    name:'需求数从大到小',
                    isSelected:false
                }
            ],
            sortAdjustmentList:[
                {
                    id:1,
                    name:'距离当前位置从近到远',
                    isSelected:true
                },
                {
                    id:2,
                    name:'整备时长从长到短',
                    isSelected:false
                }
            ],
            isShowStat:false
        }
        
    },
    computed:{
        ...mapState('workList',[
            'tabCurrentIndex',
            'carStatusList',
            'longRentDate',
            'longRentCity'
        ]),
    },
    created(){
        let long_rental_stat = sessionStorage.getItem('long_rental_stat')
        if(long_rental_stat){
            this.isShowStat = true
        }
        this.getSelectList()
    },
    methods:{
        ...mapActions('workList',[
            'getList',
            'getTipList',
            'getSelectList'
        ]),
        ...mapMutations('workList',[
            'setTabCurrentIndex',
            'setTipListData',
            'setListData',
            'setTipStatus',
            'setLongRentSort',
            'setTipSort'
        ]),
        changeTab(index){
           this.setTabCurrentIndex(index)
        },
        refreshList(){
            if(this.tabCurrentIndex==1){
                this.setListData({ page:0,listData:[] })
                this.getList() 
            }else{
                this.setTipListData({ tipPage:0,tipListData:[] })
                this.getTipList()
            }
            
        },
        showFilter(){
            this.isShowTipFilter = true 
        },
        hideFilterBox(){
            this.isShowTipFilter = false
        },
        selectFilterValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            this.setTipStatus(arr.toString())
            this.getTipList()
            
        },
        selectSortValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            if(this.tabCurrentIndex===1){
                this.setLongRentSort(arr.toString())
                this.getList()
            }else{
                this.setTipSort(arr.toString())
                this.getTipList()
            }
            
        },
        showSortBox(){
            if(this.tabCurrentIndex===1){
                this.isShowSort = true
            }else{
                this.isShowAdjustmentSort = true
            }
            
        },
        hideSortBox(){
            if(this.tabCurrentIndex===1){
                this.isShowSort = false
            }else{
                this.isShowAdjustmentSort = false
            }
        },
        goSearchPage(){
            let { longRentDate, longRentCity } = this
            if(this.tabCurrentIndex===1){
                this.$router.push({
                    path:'searchLongRent',
                    query:{
                        date:longRentDate,
                        city_id:longRentCity
                    }
                })
            }else{
                this.$router.push('searchPreparation')
            }
        },
        goAddCar(){
            this.$router.push('addCar')
        },
        goStat(){
            this.$router.push('longRentStatistics')
            
        },
        openDesc(){
            this.showDesc = true
        },
        closeDesc(){
            this.showDesc = false
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
        padding-bottom: .7rem;
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
            z-index:100;
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
            z-index: 100;
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
            height: calc(100vh - 1.39rem);
        }
        .list{
            position: relative;
            height: 100%;
        }
        .footer{
            .item1{
                width: 100%;
                height: .54rem;
                position: fixed;
                bottom: 0;
                left: 0;
                background: #fff;
                padding: .1rem;
                .fb();
                .btn{
                    width: 1.72rem;
                    height: 100%;
                    border-radius: 1px;
                    border: 1px solid #999999;
                    .fc();
                    .fco(.12rem,#333);

                }   
            }
            .item2{
                width: 100%;
                height: .54rem;
                position: fixed;
                bottom: 0;
                left: 0;
                background: #fff;
                padding: .1rem;
                .fc();
                span{
                    flex:1;
                    height: 100%;
                    .fc();
                    background: #333333;
                    border-radius: 2px;
                    .fco(.14rem,#fff)
                }
            }
        }
    }
</style>


