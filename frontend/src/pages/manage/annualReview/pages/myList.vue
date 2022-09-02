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
            <div class="item" @click="refreshList">
                <span class="icon icon_refresh"></span>
                <span>刷新</span>
            </div>
        </div>
        <div class="list-group">
            <div class="list" >
                <indexList/>
            </div>
        </div>

        <!-- 年检筛选 -->
        <FilterBox :list="filterList" type="radio"  @onChangeValue="selectFilterValue" :show="isShowFilter" @hideFilterBox="hideFilterBox"/>

    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import indexList from '../components/myList.vue'
import FilterBox from '../components/filterBox.vue'

export default {
    name:'myList',
    components:{
        FilterBox,
        indexList,
    },
    data(){
        return{
            isShowFilter:false,
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
            ]
        }
    },
    methods:{
        ...mapActions('myList',[
            'getWorkList',
        ]),
        ...mapMutations('myList',[
            'setListData',
            'setStatus',
        ]),
        refreshList(){
            this.setListData({ page:0,listData:[] })
            this.getWorkList() 
            
        },
        showFilter(){
            this.isShowFilter = true  
        },
        hideFilterBox(){
             this.isShowFilter = false 
        },
        selectFilterValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            this.setStatus(arr.toString())
            this.getWorkList()
            
        },
        goSearchPage(){
            this.$router.push({
                path:'searchItem',
                query:{
                    type:3
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
        padding-top: .35rem;
        .header{
            position: fixed;
            left: 0;
            top:0;
            width: 100%;
            display: flex;
            align-items: center;
            height: .34rem;
            background: #fff;
            .item{
                flex:1;
                height: .26rem;
                font-size: .14rem;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid #f6f6f6;
                border-bottom: 1px solid #F6F6F6;
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
        .list-group{
            position: relative;
            height: calc(100vh - .36rem);
        }
        .list{
            position: relative;
            height: 100%;
        }
    }
</style>


