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
        <div class="list">
            <scroller :on-refresh="refreshList" :on-infinite="loadMore" ref="scroller" :noDataText="emptyText">      
                <ListItem v-for="(item,index) in listData" :key="index" 
                    :name="item.plate_no" 
                    :numLabel="item.vin" 
                    :status="item.status_name" 
                    :label="item.brand_name+item.model_name" 
                    :time="item.last_time" 
                    @press="handleListItem(item.id)"
                /> 
            </scroller>
        </div>
        <FilterBox :list="filterList" type="checkbox" @onChangeValue="onChangeValue" :show="isShowFilter" @hideFilterBox="hideFilterBox"/>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ListItem from '../components/listItem.vue'
import FilterBox from '../components/filterBox.vue'
import { DDBase } from '../../../../../other_modules/like-manageOrder/ddSDK'
export default {
    name:'workList',
    components:{
        ListItem,
        FilterBox
    },
    data(){
        return{
            isShowFilter:false,
            emptyText:''
        }
    },
    computed:{
        ...mapState('workList',[
            "listData",
            "filterList",
            "isNoMoreData"
        ])
    },
    watch:{
      listData(v){
          if(v.length){
              this.emptyText = '没有更多数据了'
          }else{
              this.emptyText = '暂无数据'
          }
      }  
    },
    created(){
 
        DDBase.setWebTitle('事故保险工单')
        this.$store.commit('workList/setCarId',this.$route.query.car_id)
        this.getList()
        this.getFilterList()
    },
    methods:{
        ...mapActions('workList',[
            'getList',
            'getFilterList',
        ]),
        async loadMore(){
            await this.getList()
            this.$refs.scroller.finishInfinite(true)
            this.isNoMoreData && this.$refs.scroller.finishInfinite(true)
        },
        async refreshList(){
            this.$store.commit('workList/setListData',{ page:1,listData:[] })
            await this.getList()
            this.$refs.scroller.finishPullToRefresh(false)
        },
        showFilter(){
            this.isShowFilter = true
        },
        hideFilterBox(){
            this.isShowFilter = false
        },
        onChangeValue(data){
            let arr = data.map(item=>{
                if(item.id===0){
                    return ''
                }else{
                    return item.id
                }
                
            })
            this.$store.commit('workList/setStatus',arr.toString())
            this.getList()
        },
        handleListItem(id){
            this.goDetailPage(id)
        },
        goSearchPage(){
            this.$router.push('searchItem')
        },
        goDetailPage(id){
            this.$router.push({path:'workListDetail',query:{order_id:id}})
        }
    }
}
</script>
<style lang="less" scoped>
    .container{
        background: #F6F6F6;
        min-height: 100vh;
        font-size: .14rem;
        padding-top: .34rem;
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
        .list{
            position: relative;
            height: calc(100vh - .34rem);
        }
    }
</style>


