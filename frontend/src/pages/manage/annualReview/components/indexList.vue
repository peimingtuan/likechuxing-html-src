<template>
    <div class="list-wrap">
        <div class="list" >
            <scroller :on-refresh="refreshList" :on-infinite="loadMore" ref="scroller" :noDataText="emptyText">      
                <ListItem v-for="(item,index) in listData" :key="index" 
                    type="indexItem"
                    :id="item.id"
                    :plate_no="item.plate_no" 
                    :vin="item.vin" 
                    :carStatus="item.car_status_name"
                    :model_name="item.model_name" 
                    :color="item.car_color"
                    :branch="item.branch.name"
                    :time="item.date_interval" 
                    :status="item.status_name"
                    :parking_no="item.branch.parking_no" 
                    :parking_floor="item.branch.parking_floor"
                    @press="handleListItem(item)"
                /> 
            </scroller>
        </div>
    </div>
</template>
<script>
import ListItem from './indexPageWorkListItem.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
    name:'indexList',
    components:{
        ListItem
    },
    data(){
        return{
            emptyText:'',
        }
    },
    computed:{
        ...mapState('workList',[
            "listData",
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
        this.getWorkList()
    },
    methods:{
        ...mapActions('workList',[
            'getWorkList',
        ]),
        ...mapMutations('workList',[
            'setListData',
        ]),
        async loadMore(){
                await this.getWorkList()
                this.$refs.scroller.finishInfinite(true)
                this.isNoMoreData && this.$refs.scroller.finishInfinite(true)
            },
        async refreshList(){
            this.setListData({ page:0,listData:[] })
            await this.getWorkList()
            this.$refs.scroller.finishPullToRefresh(false)
        },
        handleListItem(item){
            this.goDetailPage(item)
        },
        goDetailPage(item){
            if(item.status_name=='年检中'){
                this.$router.push({
                    path:'workDetail',
                    query:{
                        order_id:item.id,
                        car_id:item.car_id
                    }
                })
            }else{
                this.$router.push({
                    path:'detailPreview',
                    query:{
                        order_id:item.id
                    }
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .list-wrap{
        height: 100%;
        .list{
            height: 100%;
            position: relative;
        }
    }
</style>

